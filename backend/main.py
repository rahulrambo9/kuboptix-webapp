import os
from pathlib import Path
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from kubernetes import client, config

app = FastAPI()

# 1. ALLOW CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000"],
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
        
        print(f"[INFO] Looking for config at: {kube_config_path}")
        
        if os.path.exists(kube_config_path):
            config.load_kube_config(config_file=kube_config_path)
            print(f"[SUCCESS] Loaded config successfully from: {kube_config_path}")
            return True
        else:
            # Fallback: Try loading from default location
            config.load_kube_config()
            print("[SUCCESS] Loaded config from default location")
            return True
            
    except Exception as e:
        print(f"[ERROR] FAILED to load config: {e}")
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
        print(f"[ERROR] Connection Error: {e}")
        return {"status": "offline", "cluster": "Connection Refused"}

def get_age_string(creation_timestamp):
    if not creation_timestamp:
        return "Unknown"
    try:
        delta = datetime.now(timezone.utc) - creation_timestamp
        days = delta.days
        hours = delta.seconds // 3600
        minutes = (delta.seconds % 3600) // 60
        if days > 0:
            return f"{days}d"
        elif hours > 0:
            return f"{hours}h"
        else:
            return f"{minutes}m"
    except Exception as e:
        print(f"Error formatting age: {e}")
        return "Unknown"

@app.get("/api/pods")
def get_pods(namespace: str = None):
    try:
        v1 = client.CoreV1Api()
        if namespace and namespace != "all":
            ret = v1.list_namespaced_pod(namespace=namespace, watch=False)
        else:
            ret = v1.list_pod_for_all_namespaces(watch=False)
        
        pods_data = []
        for i in ret.items:
            restarts = 0
            if i.status.container_statuses:
                restarts = sum(c.restart_count for c in i.status.container_statuses if c.restart_count is not None)
            
            age = get_age_string(i.metadata.creation_timestamp)
            
            pod = {
                "name": i.metadata.name,
                "namespace": i.metadata.namespace,
                "status": i.status.phase,
                "ip": i.status.pod_ip if i.status.pod_ip else "Pending",
                "node": i.spec.node_name if i.spec.node_name else "Pending",
                "restarts": restarts,
                "age": age
            }
            pods_data.append(pod)
            
        return pods_data
    except Exception as e:
        print(f"Error fetching pods: {e}")
        return []
    
@app.get("/api/deployments")
def get_deployments(namespace: str = None):
    try:
        apps_v1 = client.AppsV1Api()
        if namespace and namespace != "all":
            ret = apps_v1.list_namespaced_deployment(namespace=namespace, watch=False)
        else:
            ret = apps_v1.list_deployment_for_all_namespaces(watch=False)
        
        deployments_data = []
        for i in ret.items:
            ready = i.status.ready_replicas if i.status.ready_replicas is not None else 0
            total = i.spec.replicas if i.spec.replicas is not None else 0
            is_healthy = ready == total
            
            age = get_age_string(i.metadata.creation_timestamp)
            
            dep = {
                "name": i.metadata.name,
                "ns": i.metadata.namespace,
                "namespace": i.metadata.namespace,
                "ready": ready,
                "total": total,
                "strategy": i.spec.strategy.type if i.spec.strategy else "Unknown",
                "age": age,
                "status": "healthy" if is_healthy else "scaling"
            }
            deployments_data.append(dep)
        return deployments_data
    except Exception as e:
        print(f"Error fetching deployments: {e}")
        return []

@app.get("/api/namespaces")
def get_namespaces():
    try:
        v1 = client.CoreV1Api()
        ns_list = v1.list_namespace()
        names = [ns.metadata.name for ns in ns_list.items]
        return names
    except Exception as e:
        print(f"Error fetching namespaces: {e}")
        return ["default"]