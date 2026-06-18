package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

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
)

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
	// Try loading default Kubeconfig immediately on startup
	autoLoadKubeconfig()

	mux := http.NewServeMux()

	// 1. HEALTH ENDPOINT
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		cs, name := getClientset()
		status := "offline"

		if cs != nil {
			// Test cluster connection by hitting Discovery API
			_, err := cs.Discovery().ServerVersion()
			if err == nil {
				status = "online"
			} else {
				log.Printf("[ERROR] Discovery API health check failed: %v", err)
				status = "offline"
				name = "Connection Refused"
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  status,
			"cluster": name,
		})
	})

	// 2. NAMESPACES LIST
	mux.HandleFunc("GET /api/namespaces", func(w http.ResponseWriter, r *http.Request) {
		cs, _ := getClientset()
		namespaces := []string{"default"}

		if cs != nil {
			list, err := cs.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
			if err == nil {
				namespaces = []string{}
				for _, ns := range list.Items {
					namespaces = append(namespaces, ns.Name)
				}
			} else {
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

			list, err := cs.CoreV1().Pods(ns).List(context.TODO(), metav1.ListOptions{})
			if err == nil {
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

					podsData = append(podsData, PodResponse{
						Name:      pod.Name,
						Namespace: pod.Namespace,
						Status:    string(pod.Status.Phase),
						IP:        ip,
						Node:      node,
						Restarts:  restarts,
						Age:       getAgeString(pod.CreationTimestamp.Time),
					})
				}
			} else {
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

			list, err := cs.AppsV1().Deployments(ns).List(context.TODO(), metav1.ListOptions{})
			if err == nil {
				for _, dep := range list.Items {
					ready := dep.Status.ReadyReplicas
					total := dep.Status.Replicas // or *dep.Spec.Replicas
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

					deploymentsData = append(deploymentsData, DeploymentResponse{
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
			} else {
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

	log.Println("[INFO] Go Kubernetes Backend running on port 8000...")
	if err := http.ListenAndServe(":8000", corsMiddleware(mux)); err != nil {
		log.Fatalf("[FATAL] Server failed: %v", err)
	}
}
