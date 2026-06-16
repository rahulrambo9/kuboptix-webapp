import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from kubernetes import client, config

app = FastAPI()

# 1. ALLOW CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. ROBUST CONFIG LOADING
# We force Python to look in C:\Users\YOUR_NAME\.kube\config
def load_k8s_config():
    try:
        # Standard Windows path approach
        home = str(Path.home())
        kube_config_path = os.path.join(home, ".kube", "config")
        
        print(f"🔍 Looking for config at: {kube_config_path}")
        
        if os.path.exists(kube_config_path):
            config.load_kube_config(config_file=kube_config_path)
            print(f"✅ Loaded config successfully from: {kube_config_path}")
            return True
        else:
            # Fallback: Try loading from default location
            config.load_kube_config()
            print("✅ Loaded config from default location")
            return True
            
    except Exception as e:
        print(f"⚠️ FAILED to load config: {e}")
        return False

# Load config immediately on startup
is_config_loaded = load_k8s_config()

@app.get("/")
def read_root():
    return {"message": "Welcome to K8s Jarvis API"}

@app.get("/api/health")
def get_health_status():
    if not is_config_loaded:
        return {"status": "offline", "cluster": "Config File Missing"}

    try:
        # 1. Get Cluster Name
        contexts, active_context = config.list_kube_config_contexts()
        if not active_context:
            return {"status": "offline", "cluster": "No Context Selected"}
        
        cluster_name = active_context['name']

        # 2. Test Connection (List 1 node)
        v1 = client.CoreV1Api()
        v1.list_node(limit=1) 

        return {
            "status": "online", 
            "cluster": cluster_name
        }

    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return {"status": "offline", "cluster": "Connection Refused"}

@app.get("/api/pods")
def get_pods():
    try:
        v1 = client.CoreV1Api()
        ret = v1.list_pod_for_all_namespaces(watch=False)
        
        pods_data = []
        for i in ret.items:
            pod = {
                "name": i.metadata.name,
                "namespace": i.metadata.namespace,
                "status": i.status.phase,
                "ip": i.status.pod_ip if i.status.pod_ip else "Pending",
                "node": i.spec.node_name if i.spec.node_name else "Pending",
                "restarts": sum(c.restart_count for c in i.status.container_statuses) if i.status.container_statuses else 0,
                "age": "Unknown" # Simplified for now
            }
            pods_data.append(pod)
            
        return pods_data
    except Exception as e:
        print(f"Error fetching pods: {e}")
        return []
    
# ... (keep all your existing code)

@app.get("/api/namespaces")
def get_namespaces():
    try:
        v1 = client.CoreV1Api()
        # Fetch all namespaces
        ns_list = v1.list_namespace()
        
        # Extract just the names (e.g., ["default", "kube-system", "production"])
        names = [ns.metadata.name for ns in ns_list.items]
        return names
        
    except Exception as e:
        print(f"Error fetching namespaces: {e}")
        return ["default"] # Fallback if something breaks