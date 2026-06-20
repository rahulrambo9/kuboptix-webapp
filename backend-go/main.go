package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

// Thread-safe global state for the active Kubernetes connection
var (
	clientset   *kubernetes.Clientset
	activeConf  *rest.Config
	clusterName = "Disconnected"
	mu          sync.RWMutex

	dbPool      *pgxpool.Pool
	redisClient *redis.Client
)

// loadEnv reads a .env file and sets environment variables if not already set
func loadEnv() {
	paths := []string{".env", filepath.Join("..", ".env")}
	for _, path := range paths {
		if _, err := os.Stat(path); err == nil {
			log.Printf("[INFO] Loading environment from: %s", path)
			content, err := os.ReadFile(path)
			if err != nil {
				log.Printf("[WARN] Failed to read .env file: %v", err)
				continue
			}
			lines := strings.Split(string(content), "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if line == "" || strings.HasPrefix(line, "#") {
					continue
				}
				parts := strings.SplitN(line, "=", 2)
				if len(parts) == 2 {
					key := strings.TrimSpace(parts[0])
					val := strings.TrimSpace(parts[1])
					// Remove quotes if present
					val = strings.Trim(val, "\"'`")
					if os.Getenv(key) == "" {
						os.Setenv(key, val)
					}
				}
			}
			break // Only load the first one found
		}
	}
}

// Helper to mask passwords in connection strings for secure logging
func maskPassword(connStr string) string {
	if strings.Contains(connStr, "@") && strings.Contains(connStr, "://") {
		parts := strings.SplitN(connStr, "@", 2)
		prefixParts := strings.SplitN(parts[0], ":", 3)
		if len(prefixParts) == 3 {
			return fmt.Sprintf("%s:%s:*****@%s", prefixParts[0], prefixParts[1], parts[1])
		}
	}
	return connStr
}

// Initialize PostgreSQL Connection Pool
func initDB() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		host := os.Getenv("DB_HOST")
		port := os.Getenv("DB_PORT")
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		dbname := os.Getenv("DB_NAME")
		sslmode := os.Getenv("DB_SSL")

		if host != "" && user != "" && password != "" && dbname != "" {
			if port == "" {
				port = "5432"
			}
			if sslmode == "" {
				sslmode = "disable"
			}
			connStr = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s", user, password, host, port, dbname, sslmode)
		} else {
			connStr = "postgres://kuboptix:kuboptix_pass@localhost:5432/kuboptix?sslmode=disable"
		}
	}

	log.Printf("[INFO] Connecting to PostgreSQL at: %s", maskPassword(connStr))
	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Printf("[ERROR] Unable to parse database connection string: %v", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Printf("[ERROR] Unable to connect to PostgreSQL: %v", err)
		return
	}

	err = pool.Ping(ctx)
	if err != nil {
		log.Printf("[ERROR] PostgreSQL ping failed: %v", err)
		pool.Close()
		return
	}

	dbPool = pool
	log.Println("[SUCCESS] Connected to PostgreSQL")

	applySchema()
}

// Auto-run schema migrations on startup
func applySchema() {
	if dbPool == nil {
		return
	}

	// Try relative or absolute path of schema.sql
	schemaPath := "schema.sql"
	if _, err := os.Stat(schemaPath); os.IsNotExist(err) {
		// Fallback to parent path if we are running from a subfolder
		schemaPath = filepath.Join("..", "backend-go", "schema.sql")
	}

	log.Printf("[INFO] Applying database schema from: %s", schemaPath)
	schemaBytes, err := os.ReadFile(schemaPath)
	if err != nil {
		log.Printf("[ERROR] Failed to read schema file: %v", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = dbPool.Exec(ctx, string(schemaBytes))
	if err != nil {
		log.Printf("[ERROR] Failed to apply schema: %v", err)
		return
	}
	log.Println("[SUCCESS] Database schema applied successfully")
}

// Initialize Redis Client
func initRedis() {
	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		addr = "localhost:7379"
	}

	log.Printf("[INFO] Connecting to Redis at: %s", addr)
	redisClient = redis.NewClient(&redis.Options{
		Addr: addr,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := redisClient.Ping(ctx).Result()
	if err != nil {
		log.Printf("[ERROR] Redis connection failed: %v", err)
		redisClient = nil
		return
	}

	log.Println("[SUCCESS] Connected to Redis")
}

// Helper function to handle Redis caching easily
func getCachedData(ctx context.Context, key string, target interface{}, fetchFunc func() (interface{}, error), ttl time.Duration) error {
	if redisClient == nil {
		// Fallback to direct fetch if Redis is down
		data, err := fetchFunc()
		if err != nil {
			return err
		}
		// Convert directly to target by marshaling and unmarshaling
		bytes, err := json.Marshal(data)
		if err != nil {
			return err
		}
		return json.Unmarshal(bytes, target)
	}

	// Check Redis Cache
	val, err := redisClient.Get(ctx, key).Result()
	if err == nil {
		log.Printf("[CACHE HIT] Redis key: %s", key)
		return json.Unmarshal([]byte(val), target)
	}

	log.Printf("[CACHE MISS] Redis key: %s. Fetching raw...", key)
	data, err := fetchFunc()
	if err != nil {
		return err
	}

	serialized, err := json.Marshal(data)
	if err != nil {
		return err
	}

	// Save to Redis
	redisClient.Set(ctx, key, serialized, ttl)
	return json.Unmarshal(serialized, target)
}

// UserClaims holds authenticated user information
type UserClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
}

type contextKey string
const userContextKey contextKey = "user"

// Auth Middleware for Clerk JWT validation (with local mock fallback)
func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		devMode := os.Getenv("CLERK_DEV_MODE") != "false" // default to true for local testing

		if authHeader == "" {
			if devMode {
				claims := UserClaims{
					UserID: "user_mock123",
					Email:  "dev@kuboptix.com",
					Role:   "admin",
				}
				ctx := context.WithValue(r.Context(), userContextKey, claims)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
			http.Error(w, "Unauthorized: Authorization header is required", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, "Unauthorized: Invalid Authorization format. Expected Bearer <token>", http.StatusUnauthorized)
			return
		}

		token := parts[1]

		if devMode && (token == "mock-token" || os.Getenv("CLERK_PEM_PUBLIC_KEY") == "") {
			claims := UserClaims{
				UserID: "user_mock123",
				Email:  "dev@kuboptix.com",
				Role:   "admin",
			}
			ctx := context.WithValue(r.Context(), userContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		// Parse token claims
		claims, err := parseAndValidateClerkToken(token)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unauthorized: %v", err), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Extract base64 payload claims
func parseAndValidateClerkToken(tokenStr string) (UserClaims, error) {
	parts := strings.Split(tokenStr, ".")
	if len(parts) != 3 {
		return UserClaims{}, fmt.Errorf("invalid token format")
	}

	payloadSegment := parts[1]
	if l := len(payloadSegment) % 4; l > 0 {
		payloadSegment += strings.Repeat("=", 4-l)
	}

	decoded, err := base64.URLEncoding.DecodeString(payloadSegment)
	if err != nil {
		return UserClaims{}, fmt.Errorf("failed to decode token payload: %v", err)
	}

	var claims map[string]interface{}
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return UserClaims{}, fmt.Errorf("failed to unmarshal token claims: %v", err)
	}

	userId, _ := claims["sub"].(string)
	email, _ := claims["email"].(string)
	role, _ := claims["role"].(string)

	if userId == "" {
		userId = "user_unknown"
	}

	return UserClaims{
		UserID: userId,
		Email:  email,
		Role:   role,
	}, nil
}




// Get active clientset and cluster name thread-safely
func getClientset() (*kubernetes.Clientset, string) {
	mu.RLock()
	defer mu.RUnlock()
	return clientset, clusterName
}

// Set active clientset and cluster name thread-safely
func setClientset(c *kubernetes.Clientset, conf *rest.Config, name string) {
	mu.Lock()
	defer mu.Unlock()
	clientset = c
	activeConf = conf
	clusterName = name
	log.Printf("[SUCCESS] Active Kubernetes context set to: %s", name)
}

func getKubeconfigPath() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return ""
	}
	return filepath.Join(home, ".kube", "config")
}

// Helper to format creation time into a human-readable age
func getAgeString(creationTime time.Time) string {
	if creationTime.IsZero() {
		return "Unknown"
	}
	delta := time.Since(creationTime)
	days := int(delta.Hours() / 24)
	hours := int(delta.Hours()) % 24
	minutes := int(delta.Minutes()) % 60

	if days > 0 {
		return fmt.Sprintf("%dd", days)
	} else if hours > 0 {
		return fmt.Sprintf("%dh", hours)
	} else {
		return fmt.Sprintf("%dm", minutes)
	}
}

// CORS Middleware to handle Next.js client requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Auto-loads the default context on startup if config exists
func autoLoadKubeconfig() {
	path := getKubeconfigPath()
	if path == "" {
		log.Println("[INFO] Home directory not found. Auto-load skipped.")
		return
	}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		log.Printf("[INFO] Kubeconfig not found at: %s. Auto-load skipped.", path)
		return
	}

	log.Printf("[INFO] Found kubeconfig at: %s. Loading default context...", path)
	config, err := clientcmd.BuildConfigFromFlags("", path)
	if err != nil {
		log.Printf("[WARN] Failed to load default kubeconfig: %v", err)
		return
	}

	cs, err := kubernetes.NewForConfig(config)
	if err != nil {
		log.Printf("[WARN] Failed to create clientset from default config: %v", err)
		return
	}

	// Read context name
	apiConfig, err := clientcmd.LoadFromFile(path)
	name := "default"
	if err == nil && apiConfig.CurrentContext != "" {
		name = apiConfig.CurrentContext
	}

	setClientset(cs, config, name)
}

func main() {
	// Load environment variables if .env exists
	loadEnv()

	// Initialize PostgreSQL and Redis
	initDB()
	initRedis()

	// Try loading default Kubeconfig immediately on startup
	autoLoadKubeconfig()

	mux := http.NewServeMux()

	// 1. HEALTH ENDPOINT
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		cs, name := getClientset()
		k8sStatus := "offline"

		if cs != nil {
			// Test cluster connection by hitting Discovery API
			_, err := cs.Discovery().ServerVersion()
			if err == nil {
				k8sStatus = "online"
			} else {
				log.Printf("[ERROR] Discovery API health check failed: %v", err)
				k8sStatus = "offline"
				name = "Connection Refused"
			}
		}

		dbStatus := "disconnected"
		if dbPool != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			if err := dbPool.Ping(ctx); err == nil {
				dbStatus = "connected"
			}
			cancel()
		}

		redisStatus := "disconnected"
		if redisClient != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			if _, err := redisClient.Ping(ctx).Result(); err == nil {
				redisStatus = "connected"
			}
			cancel()
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    k8sStatus,
			"cluster":   name,
			"postgres":  dbStatus,
			"redis":     redisStatus,
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	// 2. NAMESPACES LIST
	mux.HandleFunc("GET /api/namespaces", func(w http.ResponseWriter, r *http.Request) {
		cs, _ := getClientset()
		namespaces := []string{"default"}

		if cs != nil {
			cacheKey := "k8s:namespaces"
			fetchFunc := func() (interface{}, error) {
				list, err := cs.CoreV1().Namespaces().List(r.Context(), metav1.ListOptions{})
				if err != nil {
					return nil, err
				}
				nsList := []string{}
				for _, ns := range list.Items {
					nsList = append(nsList, ns.Name)
				}
				return nsList, nil
			}
			err := getCachedData(r.Context(), cacheKey, &namespaces, fetchFunc, 5*time.Second)
			if err != nil {
				log.Printf("[ERROR] Failed to fetch namespaces: %v", err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(namespaces)
	})

	// 3. WORKLOAD PODS LIST
	mux.HandleFunc("GET /api/pods", func(w http.ResponseWriter, r *http.Request) {
		cs, _ := getClientset()
		type PodResponse struct {
			Name      string `json:"name"`
			Namespace string `json:"namespace"`
			Status    string `json:"status"`
			IP        string `json:"ip"`
			Node      string `json:"node"`
			Restarts  int    `json:"restarts"`
			Age       string `json:"age"`
		}

		podsData := []PodResponse{}
		if cs != nil {
			ns := r.URL.Query().Get("namespace")
			if ns == "all" {
				ns = "" // empty string fetches all namespaces in client-go
			}

			cacheKey := fmt.Sprintf("k8s:pods:namespace:%s", ns)
			fetchFunc := func() (interface{}, error) {
				list, err := cs.CoreV1().Pods(ns).List(r.Context(), metav1.ListOptions{})
				if err != nil {
					return nil, err
				}
				data := []PodResponse{}
				for _, pod := range list.Items {
					restarts := 0
					for _, status := range pod.Status.ContainerStatuses {
						restarts += int(status.RestartCount)
					}

					node := pod.Spec.NodeName
					if node == "" {
						node = "Pending"
					}

					ip := pod.Status.PodIP
					if ip == "" {
						ip = "Pending"
					}

					data = append(data, PodResponse{
						Name:      pod.Name,
						Namespace: pod.Namespace,
						Status:    string(pod.Status.Phase),
						IP:        ip,
						Node:      node,
						Restarts:  restarts,
						Age:       getAgeString(pod.CreationTimestamp.Time),
					})
				}
				return data, nil
			}

			err := getCachedData(r.Context(), cacheKey, &podsData, fetchFunc, 5*time.Second)
			if err != nil {
				log.Printf("[ERROR] Failed to fetch pods: %v", err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(podsData)
	})

	// 4. DEPLOYMENTS LIST
	mux.HandleFunc("GET /api/deployments", func(w http.ResponseWriter, r *http.Request) {
		cs, _ := getClientset()
		type DeploymentResponse struct {
			Name      string `json:"name"`
			Ns        string `json:"ns"`
			Namespace string `json:"namespace"`
			Ready     int32  `json:"ready"`
			Total     int32  `json:"total"`
			Strategy  string `json:"strategy"`
			Age       string `json:"age"`
			Status    string `json:"status"`
		}

		deploymentsData := []DeploymentResponse{}
		if cs != nil {
			ns := r.URL.Query().Get("namespace")
			if ns == "all" {
				ns = ""
			}

			cacheKey := fmt.Sprintf("k8s:deployments:namespace:%s", ns)
			fetchFunc := func() (interface{}, error) {
				list, err := cs.AppsV1().Deployments(ns).List(r.Context(), metav1.ListOptions{})
				if err != nil {
					return nil, err
				}
				data := []DeploymentResponse{}
				for _, dep := range list.Items {
					ready := dep.Status.ReadyReplicas
					total := dep.Status.Replicas
					if dep.Spec.Replicas != nil {
						total = *dep.Spec.Replicas
					}

					status := "scaling"
					if ready == total {
						status = "healthy"
					}

					strategy := "Unknown"
					if dep.Spec.Strategy.Type != "" {
						strategy = string(dep.Spec.Strategy.Type)
					}

					data = append(data, DeploymentResponse{
						Name:      dep.Name,
						Ns:        dep.Namespace,
						Namespace: dep.Namespace,
						Ready:     ready,
						Total:     total,
						Strategy:  strategy,
						Age:       getAgeString(dep.CreationTimestamp.Time),
						Status:    status,
					})
				}
				return data, nil
			}

			err := getCachedData(r.Context(), cacheKey, &deploymentsData, fetchFunc, 5*time.Second)
			if err != nil {
				log.Printf("[ERROR] Failed to fetch deployments: %v", err)
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(deploymentsData)
	})

	// 5. GET KUBECONFIG CONTEXTS LIST
	mux.HandleFunc("GET /api/connect/contexts", func(w http.ResponseWriter, r *http.Request) {
		path := getKubeconfigPath()
		contexts := []string{}

		if path != "" {
			apiConfig, err := clientcmd.LoadFromFile(path)
			if err == nil {
				for name := range apiConfig.Contexts {
					contexts = append(contexts, name)
				}
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(contexts)
	})

	// 6. CONNECT TO LOCAL KUBECONFIG CONTEXT
	mux.HandleFunc("POST /api/connect/local", func(w http.ResponseWriter, r *http.Request) {
		type RequestBody struct {
			Context string `json:"context"`
		}

		var body RequestBody
		err := json.NewDecoder(r.Body).Decode(&body)
		if err != nil || body.Context == "" {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		path := getKubeconfigPath()
		if path == "" {
			http.Error(w, "Kubeconfig path not found", http.StatusInternalServerError)
			return
		}

		// Build config overriding the current-context
		config, err := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
			&clientcmd.ClientConfigLoadingRules{ExplicitPath: path},
			&clientcmd.ConfigOverrides{CurrentContext: body.Context},
		).ClientConfig()

		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to load context: %v", err), http.StatusBadRequest)
			return
		}

		cs, err := kubernetes.NewForConfig(config)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create clientset: %v", err), http.StatusInternalServerError)
			return
		}

		// Verify connection
		_, err = cs.Discovery().ServerVersion()
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed cluster handshake: %v", err), http.StatusBadGateway)
			return
		}

		setClientset(cs, config, body.Context)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"cluster": body.Context,
		})
	})

	// 7. CONNECT VIA MANUAL SERVICE ACCOUNT TOKEN
	mux.HandleFunc("POST /api/connect/manual", func(w http.ResponseWriter, r *http.Request) {
		type RequestBody struct {
			Server string `json:"server"`
			Token  string `json:"token"`
		}

		var body RequestBody
		err := json.NewDecoder(r.Body).Decode(&body)
		if err != nil || body.Server == "" || body.Token == "" {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		config := &rest.Config{
			Host:        body.Server,
			BearerToken: body.Token,
			TLSClientConfig: rest.TLSClientConfig{
				Insecure: true, // Bypass verification for direct token dev logins
			},
		}

		cs, err := kubernetes.NewForConfig(config)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create configuration: %v", err), http.StatusInternalServerError)
			return
		}

		// Verify connection
		_, err = cs.Discovery().ServerVersion()
		if err != nil {
			http.Error(w, fmt.Sprintf("Connection test failed: %v", err), http.StatusBadGateway)
			return
		}

		setClientset(cs, config, "manual-token-cluster")

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"cluster": "manual-token-cluster",
		})
	})

	// 8. CONNECT VIA UPLOADED KUBECONFIG FILE
	mux.HandleFunc("POST /api/connect/upload", func(w http.ResponseWriter, r *http.Request) {
		// Read multipart form file
		err := r.ParseMultipartForm(10 << 20) // 10MB limit
		if err != nil {
			http.Error(w, "Failed to parse form", http.StatusBadRequest)
			return
		}

		file, _, err := r.FormFile("config")
		if err != nil {
			http.Error(w, "Missing config file in form", http.StatusBadRequest)
			return
		}
		defer file.Close()

		fileBytes, err := io.ReadAll(file)
		if err != nil {
			http.Error(w, "Failed to read file bytes", http.StatusInternalServerError)
			return
		}

		// Load client configuration from raw file bytes
		apiConfig, err := clientcmd.Load(fileBytes)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid Kubeconfig format: %v", err), http.StatusBadRequest)
			return
		}

		// Use the current context specified inside the file
		name := apiConfig.CurrentContext
		if name == "" {
			for ctxName := range apiConfig.Contexts {
				name = ctxName // fallback to first context
				break
			}
		}

		if name == "" {
			http.Error(w, "No contexts found in uploaded kubeconfig", http.StatusBadRequest)
			return
		}
		overrides := &clientcmd.ConfigOverrides{
			CurrentContext: name,
		}
		config, err := clientcmd.NewDefaultClientConfig(*apiConfig, overrides).ClientConfig()
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to construct REST client config: %v", err), http.StatusBadRequest)
			return
		}

		cs, err := kubernetes.NewForConfig(config)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to initialize Clientset: %v", err), http.StatusInternalServerError)
			return
		}

		// Verify connection
		_, err = cs.Discovery().ServerVersion()
		if err != nil {
			http.Error(w, fmt.Sprintf("Broke during cluster connection handshake: %v", err), http.StatusBadGateway)
			return
		}

		setClientset(cs, config, name)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"cluster": name,
		})
	})

	// 9. NODES LIST
	mux.HandleFunc("GET /api/nodes", func(w http.ResponseWriter, r *http.Request) {
		cs, _ := getClientset()
		type NodeResponse struct {
			Name    string `json:"name"`
			Status  string `json:"status"`
			Role    string `json:"role"`
			Version string `json:"version"`
			CPU     string `json:"cpu"`
			Memory  string `json:"memory"`
			Age     string `json:"age"`
		}
		nodesData := []NodeResponse{}
		if cs != nil {
			cacheKey := "k8s:nodes"
			fetchFunc := func() (interface{}, error) {
				list, err := cs.CoreV1().Nodes().List(r.Context(), metav1.ListOptions{})
				if err != nil {
					return nil, err
				}
				data := []NodeResponse{}
				for _, node := range list.Items {
					status := "Ready"
					for _, cond := range node.Status.Conditions {
						if cond.Type == "Ready" && cond.Status != "True" {
							status = "NotReady"
						}
					}
					// Role extraction
					role := "worker"
					for label := range node.Labels {
						if label == "node-role.kubernetes.io/control-plane" || label == "node-role.kubernetes.io/master" {
							role = "control-plane"
						}
					}
					data = append(data, NodeResponse{
						Name:    node.Name,
						Status:  status,
						Role:    role,
						Version: node.Status.NodeInfo.KubeletVersion,
						CPU:     node.Status.Allocatable.Cpu().String(),
						Memory:  node.Status.Allocatable.Memory().String(),
						Age:     getAgeString(node.CreationTimestamp.Time),
					})
				}
				return data, nil
			}

			err := getCachedData(r.Context(), cacheKey, &nodesData, fetchFunc, 5*time.Second)
			if err != nil {
				log.Printf("[ERROR] Failed to fetch nodes: %v", err)
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(nodesData)
	})

	// 10. SERVICES LIST
	mux.HandleFunc("GET /api/services", func(w http.ResponseWriter, r *http.Request) {
		cs, _ := getClientset()
		type ServiceResponse struct {
			Name      string `json:"name"`
			Namespace string `json:"namespace"`
			Type      string `json:"type"`
			ClusterIP string `json:"clusterIP"`
			ExternalIP string `json:"externalIP"`
			Age       string `json:"age"`
		}
		servicesData := []ServiceResponse{}
		if cs != nil {
			ns := r.URL.Query().Get("namespace")
			if ns == "all" {
				ns = ""
			}

			cacheKey := fmt.Sprintf("k8s:services:namespace:%s", ns)
			fetchFunc := func() (interface{}, error) {
				list, err := cs.CoreV1().Services(ns).List(r.Context(), metav1.ListOptions{})
				if err != nil {
					return nil, err
				}
				data := []ServiceResponse{}
				for _, svc := range list.Items {
					extIP := "None"
					if len(svc.Status.LoadBalancer.Ingress) > 0 {
						extIP = svc.Status.LoadBalancer.Ingress[0].IP
						if extIP == "" {
							extIP = svc.Status.LoadBalancer.Ingress[0].Hostname
						}
					}
					data = append(data, ServiceResponse{
						Name:       svc.Name,
						Namespace:  svc.Namespace,
						Type:       string(svc.Spec.Type),
						ClusterIP:  svc.Spec.ClusterIP,
						ExternalIP: extIP,
						Age:        getAgeString(svc.CreationTimestamp.Time),
					})
				}
				return data, nil
			}

			err := getCachedData(r.Context(), cacheKey, &servicesData, fetchFunc, 5*time.Second)
			if err != nil {
				log.Printf("[ERROR] Failed to fetch services: %v", err)
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(servicesData)
	})

	log.Println("[INFO] Go Kubernetes Backend running on port 8000...")
	handler := corsMiddleware(authMiddleware(mux))
	if err := http.ListenAndServe(":8000", handler); err != nil {
		log.Fatalf("[FATAL] Server failed: %v", err)
	}
}
