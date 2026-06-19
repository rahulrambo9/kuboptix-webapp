"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Activity, Box, Layers, Server, Share2, Cpu, HardDrive,
  AlertTriangle, CheckCircle2, XCircle, ChevronRight, ChevronDown,
  Zap, Terminal, Bell, Search, ExternalLink, Key, ShieldCheck,
  Wifi, Package, ArrowLeft, Eye, Globe, Lock, Users, FileCode,
  Database, Cloud, LayoutGrid, Settings,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";

// ─── CLUSTERS ─────────────────────────────────────────────────────────────────

const CLUSTERS = [
  { id: "prod-us-east1",    label: "prod-cluster-us-east1",     region: "us-east-1",  status: "Degraded", nodes: 4, k8s: "v1.29.2" },
  { id: "staging-eu-west2", label: "staging-cluster-eu-west2",  region: "eu-west-2",  status: "Healthy",  nodes: 3, k8s: "v1.28.6" },
  { id: "dev-ap-south1",    label: "dev-cluster-ap-south1",     region: "ap-south-1", status: "Healthy",  nodes: 2, k8s: "v1.29.1" },
  { id: "dr-us-west2",      label: "dr-cluster-us-west2",       region: "us-west-2",  status: "Warning",  nodes: 2, k8s: "v1.28.5" },
];

// ─── NAMESPACES (per cluster) ─────────────────────────────────────────────────

const NAMESPACES: Record<string, string[]> = {
  "prod-us-east1":    ["All Namespaces", "production", "data", "monitoring", "security", "kube-system"],
  "staging-eu-west2": ["All Namespaces", "staging", "qa", "monitoring", "kube-system"],
  "dev-ap-south1":    ["All Namespaces", "development", "testing", "kube-system"],
  "dr-us-west2":      ["All Namespaces", "production", "monitoring", "kube-system"],
};

// ─── PODS ─────────────────────────────────────────────────────────────────────

const ALL_PODS = [
  // prod-us-east1
  { cluster: "prod-us-east1", name: "api-gateway-7d9f8b-xk2lp",       namespace: "production", status: "Running",   restarts: 0, node: "kuboptix-node-02", age: "2d",  image: "api-gateway:2.3.1" },
  { cluster: "prod-us-east1", name: "auth-service-6c4d7f-mnp9q",      namespace: "production", status: "Running",   restarts: 1, node: "kuboptix-node-02", age: "2d",  image: "auth-service:1.8.0" },
  { cluster: "prod-us-east1", name: "payment-svc-crash-1bj4x-p8krl",  namespace: "production", status: "CrashLoop", restarts: 7, node: "kuboptix-node-03", age: "12m", image: "payment-svc:1.0.4" },
  { cluster: "prod-us-east1", name: "postgres-primary-0",             namespace: "data",       status: "Running",   restarts: 0, node: "kuboptix-node-01", age: "14d", image: "postgres:15.2" },
  { cluster: "prod-us-east1", name: "redis-cache-5f9c3d-wq7rx",       namespace: "data",       status: "Running",   restarts: 2, node: "kuboptix-node-03", age: "5d",  image: "redis:7.2-alpine" },
  { cluster: "prod-us-east1", name: "prometheus-server-0",            namespace: "monitoring",  status: "Running",   restarts: 0, node: "kuboptix-node-02", age: "14d", image: "prom/prometheus:v2.49" },
  { cluster: "prod-us-east1", name: "log-shipper-9z3m6-cdt8y",        namespace: "monitoring",  status: "Pending",   restarts: 0, node: "—",               age: "4m",  image: "fluent-bit:2.2.0" },
  { cluster: "prod-us-east1", name: "vault-agent-0",                  namespace: "security",   status: "Running",   restarts: 0, node: "kuboptix-node-01", age: "7d",  image: "vault:1.15.4" },
  // staging-eu-west2
  { cluster: "staging-eu-west2", name: "api-gateway-staging-5kr2p",   namespace: "staging",    status: "Running",   restarts: 0, node: "stg-node-01", age: "1d",  image: "api-gateway:2.3.0-rc1" },
  { cluster: "staging-eu-west2", name: "auth-staging-7mc4q",          namespace: "staging",    status: "Running",   restarts: 0, node: "stg-node-02", age: "1d",  image: "auth-service:1.8.0-rc2" },
  { cluster: "staging-eu-west2", name: "qa-runner-8xb1v",             namespace: "qa",         status: "Running",   restarts: 0, node: "stg-node-03", age: "3h",  image: "cypress:13.6.0" },
  { cluster: "staging-eu-west2", name: "kube-dns-557m8-x9f2k",        namespace: "kube-system",status: "Running",   restarts: 0, node: "stg-node-01", age: "30d", image: "coredns:1.11.1" },
  // dev-ap-south1
  { cluster: "dev-ap-south1",    name: "dev-api-6rfp2-qx8kl",         namespace: "development",status: "Running",   restarts: 3, node: "dev-node-01", age: "6h",  image: "api-gateway:2.4.0-dev" },
  { cluster: "dev-ap-south1",    name: "test-runner-2vmt9",           namespace: "testing",    status: "Running",   restarts: 0, node: "dev-node-02", age: "2h",  image: "jest:29.0.0" },
  // dr-us-west2
  { cluster: "dr-us-west2",      name: "dr-api-gateway-3kl9p",        namespace: "production", status: "Running",   restarts: 0, node: "dr-node-01",  age: "2d",  image: "api-gateway:2.3.1" },
  { cluster: "dr-us-west2",      name: "dr-postgres-0",               namespace: "production", status: "Warning",   restarts: 4, node: "dr-node-02",  age: "2d",  image: "postgres:15.2" },
];

// ─── NODES ────────────────────────────────────────────────────────────────────

const ALL_NODES = [
  { cluster: "prod-us-east1",    name: "kuboptix-node-01", role: "control-plane", status: "Ready",    cpu: "4 cores", memory: "16Gi", kubelet: "v1.29.2", age: "14d", cpuPct: 38, memPct: 52 },
  { cluster: "prod-us-east1",    name: "kuboptix-node-02", role: "worker",        status: "Ready",    cpu: "8 cores", memory: "32Gi", kubelet: "v1.29.2", age: "14d", cpuPct: 61, memPct: 71 },
  { cluster: "prod-us-east1",    name: "kuboptix-node-03", role: "worker",        status: "Ready",    cpu: "8 cores", memory: "32Gi", kubelet: "v1.29.2", age: "14d", cpuPct: 45, memPct: 48 },
  { cluster: "prod-us-east1",    name: "kuboptix-node-04", role: "worker",        status: "NotReady", cpu: "8 cores", memory: "32Gi", kubelet: "v1.29.1", age: "3d",  cpuPct: 0,  memPct: 0 },
  { cluster: "staging-eu-west2", name: "stg-node-01",      role: "control-plane", status: "Ready",    cpu: "4 cores", memory: "16Gi", kubelet: "v1.28.6", age: "30d", cpuPct: 22, memPct: 34 },
  { cluster: "staging-eu-west2", name: "stg-node-02",      role: "worker",        status: "Ready",    cpu: "8 cores", memory: "32Gi", kubelet: "v1.28.6", age: "30d", cpuPct: 35, memPct: 42 },
  { cluster: "staging-eu-west2", name: "stg-node-03",      role: "worker",        status: "Ready",    cpu: "8 cores", memory: "32Gi", kubelet: "v1.28.6", age: "30d", cpuPct: 28, memPct: 38 },
  { cluster: "dev-ap-south1",    name: "dev-node-01",      role: "control-plane", status: "Ready",    cpu: "4 cores", memory: "8Gi",  kubelet: "v1.29.1", age: "7d",  cpuPct: 55, memPct: 66 },
  { cluster: "dev-ap-south1",    name: "dev-node-02",      role: "worker",        status: "Ready",    cpu: "4 cores", memory: "16Gi", kubelet: "v1.29.1", age: "7d",  cpuPct: 42, memPct: 51 },
  { cluster: "dr-us-west2",      name: "dr-node-01",       role: "control-plane", status: "Ready",    cpu: "4 cores", memory: "16Gi", kubelet: "v1.28.5", age: "60d", cpuPct: 18, memPct: 29 },
  { cluster: "dr-us-west2",      name: "dr-node-02",       role: "worker",        status: "Ready",    cpu: "8 cores", memory: "32Gi", kubelet: "v1.28.5", age: "60d", cpuPct: 31, memPct: 45 },
];

// ─── DEPLOYMENTS ──────────────────────────────────────────────────────────────

const ALL_DEPLOYMENTS = [
  { cluster: "prod-us-east1",    name: "api-gateway",     namespace: "production", desired: 3, ready: 3, available: 3, image: "api-gateway:2.3.1",  age: "14d", status: "Healthy" },
  { cluster: "prod-us-east1",    name: "auth-service",    namespace: "production", desired: 2, ready: 2, available: 2, image: "auth-service:1.8.0", age: "14d", status: "Healthy" },
  { cluster: "prod-us-east1",    name: "payment-service", namespace: "production", desired: 2, ready: 0, available: 0, image: "payment-svc:1.0.4",  age: "12m", status: "Degraded" },
  { cluster: "prod-us-east1",    name: "prometheus",      namespace: "monitoring",  desired: 1, ready: 1, available: 1, image: "prom/prometheus:v2.49", age: "14d", status: "Healthy" },
  { cluster: "prod-us-east1",    name: "log-shipper",     namespace: "monitoring",  desired: 3, ready: 2, available: 2, image: "fluent-bit:2.2.0",  age: "4m",  status: "Scaling" },
  { cluster: "staging-eu-west2", name: "api-gateway",     namespace: "staging",    desired: 2, ready: 2, available: 2, image: "api-gateway:2.3.0-rc1", age: "1d", status: "Healthy" },
  { cluster: "staging-eu-west2", name: "auth-service",    namespace: "staging",    desired: 1, ready: 1, available: 1, image: "auth-service:1.8.0-rc2", age: "1d", status: "Healthy" },
  { cluster: "dev-ap-south1",    name: "dev-api",         namespace: "development",desired: 1, ready: 1, available: 1, image: "api-gateway:2.4.0-dev", age: "6h", status: "Healthy" },
  { cluster: "dr-us-west2",      name: "dr-api-gateway",  namespace: "production", desired: 2, ready: 2, available: 2, image: "api-gateway:2.3.1",  age: "2d",  status: "Healthy" },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────

const ALL_SERVICES = [
  { cluster: "prod-us-east1",    name: "api-gateway-svc", namespace: "production", type: "LoadBalancer", clusterIP: "10.96.45.12",  externalIP: "34.121.88.5",  ports: "80, 443",   age: "14d" },
  { cluster: "prod-us-east1",    name: "auth-svc",        namespace: "production", type: "ClusterIP",    clusterIP: "10.96.22.7",   externalIP: "—",            ports: "8080",      age: "14d" },
  { cluster: "prod-us-east1",    name: "postgres-svc",    namespace: "data",       type: "ClusterIP",    clusterIP: "10.96.11.100", externalIP: "—",            ports: "5432",      age: "14d" },
  { cluster: "prod-us-east1",    name: "prometheus-lb",   namespace: "monitoring",  type: "LoadBalancer", clusterIP: "10.96.77.2",   externalIP: "34.121.10.22", ports: "9090",      age: "14d" },
  { cluster: "staging-eu-west2", name: "api-gateway-svc", namespace: "staging",    type: "LoadBalancer", clusterIP: "10.97.10.5",   externalIP: "35.180.22.11", ports: "80",        age: "1d" },
  { cluster: "dev-ap-south1",    name: "dev-api-svc",     namespace: "development",type: "NodePort",     clusterIP: "10.98.1.5",    externalIP: "—",            ports: "8080:31000",age: "6h" },
  { cluster: "dr-us-west2",      name: "dr-api-svc",      namespace: "production", type: "LoadBalancer", clusterIP: "10.99.45.1",   externalIP: "34.90.15.3",   ports: "80, 443",   age: "2d" },
];

// ─── SECRETS ──────────────────────────────────────────────────────────────────

const ALL_SECRETS = [
  { cluster: "prod-us-east1",    name: "api-tls-cert",        namespace: "production", type: "kubernetes.io/tls",                keys: 2, age: "30d" },
  { cluster: "prod-us-east1",    name: "db-credentials",      namespace: "production", type: "Opaque",                           keys: 3, age: "14d" },
  { cluster: "prod-us-east1",    name: "payment-api-key",     namespace: "production", type: "Opaque",                           keys: 1, age: "1d" },
  { cluster: "prod-us-east1",    name: "registry-pull-secret",namespace: "production", type: "kubernetes.io/dockerconfigjson",   keys: 1, age: "60d" },
  { cluster: "prod-us-east1",    name: "prometheus-token",    namespace: "monitoring",  type: "kubernetes.io/service-account-token", keys: 3, age: "14d" },
  { cluster: "prod-us-east1",    name: "vault-root-token",    namespace: "security",   type: "Opaque",                           keys: 2, age: "7d" },
  { cluster: "prod-us-east1",    name: "postgres-tls",        namespace: "data",       type: "kubernetes.io/tls",                keys: 2, age: "30d" },
  { cluster: "staging-eu-west2", name: "stg-tls-cert",        namespace: "staging",    type: "kubernetes.io/tls",                keys: 2, age: "15d" },
  { cluster: "staging-eu-west2", name: "stg-db-creds",        namespace: "staging",    type: "Opaque",                           keys: 3, age: "15d" },
  { cluster: "dev-ap-south1",    name: "dev-api-secret",      namespace: "development",type: "Opaque",                           keys: 2, age: "3d" },
  { cluster: "dr-us-west2",      name: "dr-tls-cert",         namespace: "production", type: "kubernetes.io/tls",                keys: 2, age: "60d" },
];

// ─── RBAC ─────────────────────────────────────────────────────────────────────

const ALL_RBAC = [
  { cluster: "prod-us-east1",    kind: "ClusterRole",   name: "kuboptix-admin",      namespace: "—",           rules: 12, subjects: "ServiceAccount: kuboptix-sa", age: "60d" },
  { cluster: "prod-us-east1",    kind: "ClusterRole",   name: "prometheus-scraper",  namespace: "—",           rules: 4,  subjects: "ServiceAccount: prometheus",  age: "14d" },
  { cluster: "prod-us-east1",    kind: "Role",          name: "payment-svc-role",    namespace: "production",  rules: 3,  subjects: "ServiceAccount: payment-svc", age: "1d"  },
  { cluster: "prod-us-east1",    kind: "Role",          name: "data-reader",         namespace: "data",        rules: 2,  subjects: "User: data-team@kuboptix.io", age: "7d"  },
  { cluster: "prod-us-east1",    kind: "RoleBinding",   name: "payment-binding",     namespace: "production",  rules: 1,  subjects: "Role: payment-svc-role",      age: "1d"  },
  { cluster: "prod-us-east1",    kind: "ClusterRoleBinding", name: "kuboptix-admin-binding", namespace: "—",   rules: 1,  subjects: "ClusterRole: kuboptix-admin", age: "60d" },
  { cluster: "staging-eu-west2", kind: "ClusterRole",   name: "stg-viewer",          namespace: "—",           rules: 6,  subjects: "Group: staging-team",         age: "30d" },
  { cluster: "staging-eu-west2", kind: "RoleBinding",   name: "stg-binding",         namespace: "staging",     rules: 1,  subjects: "ClusterRole: stg-viewer",     age: "30d" },
  { cluster: "dev-ap-south1",    kind: "Role",          name: "dev-full-access",     namespace: "development", rules: 20, subjects: "Group: dev-team@kuboptix.io", age: "7d"  },
  { cluster: "dr-us-west2",      kind: "ClusterRole",   name: "dr-reader",           namespace: "—",           rules: 8,  subjects: "ServiceAccount: dr-monitor",  age: "60d" },
];

// ─── CRDs ─────────────────────────────────────────────────────────────────────

const ALL_CRDS = [
  { cluster: "prod-us-east1",    name: "prometheusrules.monitoring.coreos.com",   group: "monitoring.coreos.com",  kind: "PrometheusRule",  scope: "Namespaced", versions: "v1",       instances: 8,  age: "14d" },
  { cluster: "prod-us-east1",    name: "servicemonitors.monitoring.coreos.com",   group: "monitoring.coreos.com",  kind: "ServiceMonitor",  scope: "Namespaced", versions: "v1",       instances: 5,  age: "14d" },
  { cluster: "prod-us-east1",    name: "certificates.cert-manager.io",            group: "cert-manager.io",        kind: "Certificate",     scope: "Namespaced", versions: "v1",       instances: 3,  age: "30d" },
  { cluster: "prod-us-east1",    name: "issuers.cert-manager.io",                 group: "cert-manager.io",        kind: "Issuer",          scope: "Namespaced", versions: "v1",       instances: 2,  age: "30d" },
  { cluster: "prod-us-east1",    name: "vaultauths.secrets.hashicorp.com",        group: "secrets.hashicorp.com",  kind: "VaultAuth",       scope: "Namespaced", versions: "v1beta1",  instances: 4,  age: "7d"  },
  { cluster: "prod-us-east1",    name: "kubeoptixtasks.kuboptix.io",              group: "kuboptix.io",            kind: "KuboptixTask",    scope: "Cluster",    versions: "v1alpha1", instances: 12, age: "60d" },
  { cluster: "staging-eu-west2", name: "prometheusrules.monitoring.coreos.com",   group: "monitoring.coreos.com",  kind: "PrometheusRule",  scope: "Namespaced", versions: "v1",       instances: 3,  age: "30d" },
  { cluster: "staging-eu-west2", name: "certificates.cert-manager.io",            group: "cert-manager.io",        kind: "Certificate",     scope: "Namespaced", versions: "v1",       instances: 2,  age: "30d" },
  { cluster: "dev-ap-south1",    name: "kubeoptixtasks.kuboptix.io",              group: "kuboptix.io",            kind: "KuboptixTask",    scope: "Cluster",    versions: "v1alpha1", instances: 2,  age: "7d"  },
  { cluster: "dr-us-west2",      name: "prometheusrules.monitoring.coreos.com",   group: "monitoring.coreos.com",  kind: "PrometheusRule",  scope: "Namespaced", versions: "v1",       instances: 4,  age: "60d" },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────

const CHART_DATA: Record<string, { cpu: { t: string; v: number }[]; mem: { t: string; v: number }[] }> = {
  "prod-us-east1":    { cpu: [{t:"00",v:32},{t:"04",v:28},{t:"08",v:58},{t:"12",v:81},{t:"16",v:69},{t:"20",v:55},{t:"24",v:43}], mem: [{t:"00",v:48},{t:"04",v:52},{t:"08",v:68},{t:"12",v:75},{t:"16",v:72},{t:"20",v:66},{t:"24",v:62}] },
  "staging-eu-west2": { cpu: [{t:"00",v:18},{t:"04",v:15},{t:"08",v:32},{t:"12",v:44},{t:"16",v:38},{t:"20",v:28},{t:"24",v:20}], mem: [{t:"00",v:30},{t:"04",v:32},{t:"08",v:40},{t:"12",v:46},{t:"16",v:42},{t:"20",v:38},{t:"24",v:34}] },
  "dev-ap-south1":    { cpu: [{t:"00",v:45},{t:"04",v:50},{t:"08",v:62},{t:"12",v:71},{t:"16",v:60},{t:"20",v:55},{t:"24",v:48}], mem: [{t:"00",v:55},{t:"04",v:58},{t:"08",v:65},{t:"12",v:70},{t:"16",v:66},{t:"20",v:62},{t:"24",v:58}] },
  "dr-us-west2":      { cpu: [{t:"00",v:12},{t:"04",v:10},{t:"08",v:18},{t:"12",v:25},{t:"16",v:22},{t:"20",v:16},{t:"24",v:14}], mem: [{t:"00",v:25},{t:"04",v:26},{t:"08",v:30},{t:"12",v:32},{t:"16",v:30},{t:"20",v:28},{t:"24",v:26}] },
};

const ALERTS: Record<string, { severity: string; msg: string; time: string }[]> = {
  "prod-us-east1":    [
    { severity: "critical", msg: "payment-svc CrashLoopBackOff — 7 restarts in 12 min", time: "2m ago" },
    { severity: "warning",  msg: "kuboptix-node-04 is NotReady — kubelet unresponsive",  time: "8m ago" },
    { severity: "warning",  msg: "log-shipper pod stuck in Pending — insufficient CPU",  time: "11m ago" },
    { severity: "info",     msg: "TLS certificate api-tls-cert expires in 14 days",      time: "1h ago" },
  ],
  "staging-eu-west2": [
    { severity: "info", msg: "New staging deploy triggered via CI/CD pipeline",   time: "5m ago" },
    { severity: "info", msg: "QA runner completed test suite — 98% pass rate",    time: "30m ago" },
  ],
  "dev-ap-south1":    [
    { severity: "warning", msg: "dev-api pod has 3 restarts — OOMKilled suspected", time: "20m ago" },
    { severity: "info",    msg: "dev-cluster CPU at 55% — consider right-sizing",   time: "1h ago" },
  ],
  "dr-us-west2":      [
    { severity: "warning", msg: "dr-postgres-0 has 4 restarts — disk I/O pressure", time: "15m ago" },
    { severity: "info",    msg: "DR failover test scheduled in 2h",                  time: "2h ago" },
  ],
};

// ─── TYPES ────────────────────────────────────────────────────────────────────

type View = "overview" | "pods" | "nodes" | "deployments" | "services" | "secrets" | "rbac" | "crds";

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [selectedCluster,   setSelectedCluster]   = useState(CLUSTERS[0].id);
  const [selectedNamespace, setSelectedNamespace] = useState("All Namespaces");
  const [clusterOpen,       setClusterOpen]       = useState(false);
  const [nsOpen,            setNsOpen]            = useState(false);
  const [view,              setView]              = useState<View>("overview");
  const [selectedPod,       setSelectedPod]       = useState<typeof ALL_PODS[0] | null>(null);

  const cluster    = CLUSTERS.find(c => c.id === selectedCluster)!;
  const namespaces = NAMESPACES[selectedCluster];

  // Auto-reset namespace when cluster switches
  const handleClusterSwitch = (id: string) => {
    setSelectedCluster(id);
    setSelectedNamespace("All Namespaces");
    setView("overview");
    setSelectedPod(null);
    setClusterOpen(false);
  };

  const handleNsSwitch = (ns: string) => {
    setSelectedNamespace(ns);
    setSelectedPod(null);
    setNsOpen(false);
  };

  // Filtered data helpers
  const filterNs = <T extends { cluster: string; namespace: string }>(arr: T[]) =>
    arr.filter(r => r.cluster === selectedCluster &&
      (selectedNamespace === "All Namespaces" || r.namespace === selectedNamespace));

  const pods        = filterNs(ALL_PODS);
  const deployments = filterNs(ALL_DEPLOYMENTS);
  const services    = filterNs(ALL_SERVICES);
  const secrets     = filterNs(ALL_SECRETS);
  const rbac        = ALL_RBAC.filter(r => r.cluster === selectedCluster &&
    (selectedNamespace === "All Namespaces" || r.namespace === selectedNamespace || r.namespace === "—"));
  const crds        = ALL_CRDS.filter(r => r.cluster === selectedCluster);
  const nodes       = ALL_NODES.filter(r => r.cluster === selectedCluster);
  const alerts      = ALERTS[selectedCluster] ?? [];

  const podAlerts   = pods.filter(p => p.status !== "Running" && p.status !== "Warning").length > 0;
  const nodeAlerts  = nodes.some(n => n.status !== "Ready");

  const NAV_CORE = [
    { id: "overview",    label: "Overview",    icon: <LayoutGrid size={18} /> },
    { id: "pods",        label: "Pods",        icon: <Box size={18} />,     badge: podAlerts ? "ERR" : null },
    { id: "nodes",       label: "Nodes",       icon: <Server size={18} />,  badge: nodeAlerts ? "WARN" : null },
    { id: "deployments", label: "Deployments", icon: <Layers size={18} /> },
    { id: "services",    label: "Services",    icon: <Share2 size={18} /> },
  ];
  const NAV_CONFIG = [
    { id: "secrets", label: "Secrets", icon: <Lock size={18} /> },
    { id: "rbac",    label: "RBAC",    icon: <ShieldCheck size={18} /> },
    { id: "crds",    label: "CRDs",    icon: <FileCode size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] font-sans text-white">

      {/* ── DEMO BANNER ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#00f2fe]/10 border-b border-[#00f2fe]/30 backdrop-blur-md flex items-center justify-between px-6 py-2.5">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-[#00f2fe] animate-pulse" />
          <span className="text-xs font-semibold text-[#00f2fe] tracking-wide">
            Sample Dashboard — Demo Mode · All data is simulated
          </span>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors font-medium">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 border-r border-slate-800 flex flex-col fixed h-full z-20 bg-[#020617] overflow-y-auto pt-11">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/60">
          <div className="w-8 h-8 border-2 border-[#00f0ff]/70 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Activity className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div>
            <div className="font-orbitron font-bold text-sm tracking-widest text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">KUBOPTIX</div>
            <div className="text-[10px] text-slate-500 tracking-wider uppercase">Cluster Monitor</div>
          </div>
        </div>

        {/* Cluster Dropdown */}
        <div className="px-4 py-3 border-b border-slate-800/60">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Cloud size={10} /> Active Cluster
          </div>
          <button
            onClick={() => setClusterOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-[#0a1628] border border-[#00f2fe]/20 hover:border-[#00f2fe]/40 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${cluster.status === "Healthy" ? "bg-[#10b981]" : cluster.status === "Degraded" ? "bg-red-400" : "bg-amber-400"}`} />
              <span className="text-xs font-semibold text-white truncate">{cluster.label}</span>
            </div>
            <ChevronDown size={13} className={`text-slate-500 flex-shrink-0 transition-transform ${clusterOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Cluster panel */}
          {clusterOpen && (
            <div className="mt-2 border border-slate-700 rounded-lg bg-[#0c1425] overflow-hidden shadow-xl">
              {CLUSTERS.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleClusterSwitch(c.id)}
                  className={`w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[#00f2fe]/5 transition-colors border-b border-slate-800/50 last:border-0
                    ${c.id === selectedCluster ? "bg-[#00f2fe]/8" : ""}`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${c.status === "Healthy" ? "bg-[#10b981]" : c.status === "Degraded" ? "bg-red-400" : "bg-amber-400"}`} />
                  <div className="min-w-0">
                    <div className={`text-xs font-semibold truncate ${c.id === selectedCluster ? "text-[#00f2fe]" : "text-slate-300"}`}>{c.label}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Globe size={9} /> {c.region}
                      <span>·</span> {c.nodes} nodes
                    </div>
                  </div>
                  <div className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${
                    c.status === "Healthy" ? "text-emerald-400 bg-emerald-500/10" :
                    c.status === "Degraded" ? "text-red-400 bg-red-500/10" :
                    "text-amber-400 bg-amber-500/10"}`}>
                    {c.status}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav - Core */}
        <nav className="flex-1 px-3 pt-3 space-y-0.5">
          <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1">Workloads</div>
          {NAV_CORE.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as View); setSelectedPod(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-lg border-l-2
                ${view === item.id
                  ? "text-[#00f0ff] border-[#00f0ff] bg-[#00f0ff]/8 shadow-[0_0_15px_-8px_rgba(0,240,255,0.4)]"
                  : "text-slate-400 hover:text-white border-transparent hover:bg-slate-800/50"}`}
            >
              <span className={view === item.id ? "text-[#00f0ff]" : "text-slate-500"}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  item.badge === "ERR" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                }`}>{item.badge}</span>
              )}
            </button>
          ))}

          <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mt-4 mb-1">Config & Security</div>
          {NAV_CONFIG.map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as View); setSelectedPod(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-lg border-l-2
                ${view === item.id
                  ? "text-[#00f0ff] border-[#00f0ff] bg-[#00f0ff]/8"
                  : "text-slate-400 hover:text-white border-transparent hover:bg-slate-800/50"}`}
            >
              <span className={view === item.id ? "text-[#00f0ff]" : "text-slate-500"}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar System Status */}
        <div className="p-4 mt-auto">
          <div className="border border-[#00f0ff]/20 rounded-xl p-3.5 bg-[#0a0f1c] space-y-2.5">
            <div className="text-xs font-semibold text-[#00f0ff] tracking-wider uppercase mb-1">System Status</div>
            <StatusRow label="API Latency" value="12 ms"  color="text-[#10b981]" />
            <StatusRow label="Uptime"      value="99.97%" color="text-[#00f0ff]" />
            <StatusRow label="Alerts"      value={`${alerts.length} active`} color={alerts.length > 2 ? "text-red-400" : "text-amber-400"} />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 ml-64 flex flex-col pt-11">

        {/* Top Header */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#020617]/60 backdrop-blur-sm sticky top-11 z-10 gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400 min-w-0">
            <span className="text-slate-600 shrink-0 text-xs">{cluster.region}</span>
            <ChevronRight size={12} className="text-slate-700 shrink-0" />
            <span className="text-white capitalize shrink-0">{view}</span>
            {selectedPod && (
              <>
                <ChevronRight size={12} className="text-slate-700 shrink-0" />
                <span className="text-[#00f2fe] font-mono text-xs truncate">{selectedPod.name}</span>
              </>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Namespace dropdown */}
            <div className="relative">
              <button
                onClick={() => setNsOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-medium text-slate-300 transition-colors min-w-[160px] justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <Database size={12} className="text-[#00f2fe]" />
                  <span className="truncate">{selectedNamespace}</span>
                </div>
                <ChevronDown size={12} className={`text-slate-500 transition-transform ${nsOpen ? "rotate-180" : ""}`} />
              </button>
              {nsOpen && (
                <div className="absolute top-full mt-1 right-0 bg-[#0c1425] border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[180px] z-50">
                  {namespaces.map(ns => (
                    <button
                      key={ns}
                      onClick={() => handleNsSwitch(ns)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-[#00f2fe]/5 transition-colors border-b border-slate-800/50 last:border-0
                        ${ns === selectedNamespace ? "text-[#00f2fe] bg-[#00f2fe]/8" : "text-slate-300"}`}
                    >
                      <Database size={11} className={ns === selectedNamespace ? "text-[#00f2fe]" : "text-slate-600"} />
                      {ns}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981]">
              <Wifi size={12} className="animate-pulse" /> LIVE
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-700 rounded-lg text-sm text-slate-500 cursor-pointer hover:border-slate-500 transition-colors">
              <Search size={13} /><span className="text-xs">Search...</span>
            </div>
            <div className="relative cursor-pointer">
              <Bell size={17} className="text-slate-400 hover:text-white transition-colors" />
              {alerts.filter(a => a.severity !== "info").length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                  {alerts.filter(a => a.severity !== "info").length}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 flex-1 overflow-auto">
          {view === "overview"    && <OverviewView cluster={cluster} nodes={nodes} pods={pods} deployments={deployments} services={services} secrets={secrets} alerts={alerts} />}
          {view === "pods"        && (selectedPod ? <PodDetailView pod={selectedPod} onBack={() => setSelectedPod(null)} /> : <PodsView pods={pods} onSelect={setSelectedPod} />)}
          {view === "nodes"       && <NodesView nodes={nodes} />}
          {view === "deployments" && <DeploymentsView deployments={deployments} />}
          {view === "services"    && <ServicesView services={services} />}
          {view === "secrets"     && <SecretsView secrets={secrets} />}
          {view === "rbac"        && <RbacView rbac={rbac} />}
          {view === "crds"        && <CrdsView crds={crds} />}
        </main>
      </div>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────

function OverviewView({ cluster, nodes, pods, deployments, services, secrets, alerts }: any) {
  const cd = CHART_DATA[cluster.id];
  const nodeBar = nodes.map((n: any) => ({ name: n.name.split("-").pop(), cpu: n.cpuPct, mem: n.memPct }));
  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title="Cluster Overview" sub={`${cluster.label} · ${cluster.region} · ${cluster.k8s} · Demo Mode`} />
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 ${
          cluster.status === "Healthy"  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
          cluster.status === "Degraded" ? "bg-red-500/10 border-red-500/30 text-red-400" :
          "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}>
          {cluster.status.toUpperCase()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Nodes"       value={`${nodes.filter((n:any)=>n.status==="Ready").length}/${nodes.length}`} sub="Ready nodes"      icon={<Server size={20}/>}   color="#00f0ff" />
        <StatCard title="Pods"        value={`${pods.filter((p:any)=>p.status==="Running").length}/${pods.length}`} sub="Running pods"    icon={<Box size={20}/>}      color="#10b981" bad={pods.some((p:any)=>p.status==="CrashLoop")} />
        <StatCard title="Deployments" value={deployments.length.toString()} sub={`${deployments.filter((d:any)=>d.status==="Healthy").length} healthy`} icon={<Layers size={20}/>}  color="#3b82f6" />
        <StatCard title="Secrets"     value={secrets.length.toString()} sub="Active secrets"   icon={<Lock size={20}/>}     color="#f59e0b" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="CPU Usage" subtitle={`Cluster avg · Current ${cd.cpu.at(-1)?.v ?? 0}%`} icon={<Cpu size={15}/>} color="#00f0ff">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cd.cpu}>
              <defs><linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25}/><stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="t" stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} unit="%"/>
              <Tooltip content={<ChartTooltip unit="%"/>}/>
              <Area type="monotone" dataKey="v" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#gCpu)"/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Memory Usage" subtitle={`Cluster avg · Current ${cd.mem.at(-1)?.v ?? 0}%`} icon={<HardDrive size={15}/>} color="#10b981">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cd.mem}>
              <defs><linearGradient id="gMem" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="t" stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} unit="%"/>
              <Tooltip content={<ChartTooltip unit="%"/>}/>
              <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gMem)"/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Node bars */}
      <div className="p-6 border border-slate-800 rounded-xl bg-[#0a0f1c]/50">
        <div className="text-sm font-semibold text-slate-200 mb-5 flex items-center gap-2">
          <Server size={15} className="text-[#00f0ff]"/> Per-Node Resource Utilization
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nodeBar} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
              <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} unit="%"/>
              <Tooltip content={<ChartTooltip unit="%"/>}/>
              <Bar dataKey="cpu" name="CPU" radius={[3,3,0,0]}>
                {nodeBar.map((d:any,i:number)=><Cell key={i} fill={d.cpu===0?"#374151":"#00f0ff"} fillOpacity={0.7}/>)}
              </Bar>
              <Bar dataKey="mem" name="MEM" radius={[3,3,0,0]}>
                {nodeBar.map((d:any,i:number)=><Cell key={i} fill={d.mem===0?"#374151":"#10b981"} fillOpacity={0.7}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 mt-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#00f0ff]/70"/>CPU %</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#10b981]/70"/>Memory %</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-600"/>Down</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="p-6 border border-slate-800 rounded-xl bg-[#0a0f1c]/50">
        <div className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Bell size={15} className="text-amber-400"/> Active Alerts <span className="ml-1 text-xs text-slate-500 font-normal">({alerts.length})</span>
        </div>
        <div className="space-y-3">
          {alerts.map((a: any, i: number) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm
              ${a.severity==="critical"?"bg-red-950/30 border-red-500/30 text-red-300":a.severity==="warning"?"bg-amber-950/30 border-amber-500/30 text-amber-300":"bg-blue-950/30 border-blue-500/30 text-blue-300"}`}>
              {a.severity==="critical"?<XCircle size={16} className="shrink-0 mt-0.5"/>:a.severity==="warning"?<AlertTriangle size={16} className="shrink-0 mt-0.5"/>:<CheckCircle2 size={16} className="shrink-0 mt-0.5"/>}
              <span className="flex-1 font-medium">{a.msg}</span>
              <span className="text-slate-500 text-xs font-mono shrink-0 mt-0.5">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border border-slate-800 bg-[#0a0f1c]/50 rounded-xl text-center">
        <HealthMetric label="Cluster Status" value={cluster.status.toUpperCase()} color={cluster.status==="Healthy"?"text-[#10b981]":cluster.status==="Degraded"?"text-red-400":"text-amber-400"} />
        <HealthMetric label="Healthy Nodes"  value={`${nodes.filter((n:any)=>n.status==="Ready").length} / ${nodes.length}`} color="text-white"/>
        <HealthMetric label="Pod Success"    value={`${pods.length>0?Math.round(pods.filter((p:any)=>p.status==="Running").length/pods.length*100):100}%`} color="text-[#10b981]"/>
        <HealthMetric label="K8s Version"    value={cluster.k8s} color="text-[#00f0ff]"/>
      </div>
    </div>
  );
}

// ─── PODS ─────────────────────────────────────────────────────────────────────

function PodsView({ pods, onSelect }: { pods: typeof ALL_PODS; onSelect: (p: typeof ALL_PODS[0]) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Pods" sub={`${pods.length} total · ${pods.filter(p=>p.status==="Running").length} Running · ${pods.filter(p=>p.status==="Pending").length} Pending · ${pods.filter(p=>p.status==="CrashLoop").length} CrashLoop`} />
      {pods.length === 0
        ? <EmptyState label="No pods in this namespace" />
        : (
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#0a0f1c] border-b border-slate-800">
                <tr>{["Name","Namespace","Status","Restarts","Node","Age","Image"].map(h=>(
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}<th className="px-5 py-4"/></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pods.map((pod, i) => (
                  <tr key={i} onClick={() => onSelect(pod)} className="hover:bg-[#00f2fe]/5 cursor-pointer transition-colors group">
                    <td className="px-5 py-4"><span className="text-sm font-semibold text-white group-hover:text-[#00f2fe] transition-colors font-mono">{pod.name}</span></td>
                    <td className="px-5 py-4"><NsBadge ns={pod.namespace}/></td>
                    <td className="px-5 py-4"><PodStatusBadge status={pod.status}/></td>
                    <td className="px-5 py-4"><span className={`text-sm font-semibold ${pod.restarts>3?"text-red-400":"text-slate-300"}`}>{pod.restarts}</span></td>
                    <td className="px-5 py-4"><span className="text-sm text-slate-400 font-mono">{pod.node}</span></td>
                    <td className="px-5 py-4"><span className="text-sm text-slate-500">{pod.age}</span></td>
                    <td className="px-5 py-4"><span className="text-sm text-slate-500 font-mono">{pod.image}</span></td>
                    <td className="px-5 py-4 text-slate-600 group-hover:text-[#00f2fe] transition-colors"><ChevronRight size={16}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

// ─── POD DETAIL ───────────────────────────────────────────────────────────────

function PodDetailView({ pod, onBack }: { pod: typeof ALL_PODS[0]; onBack: () => void }) {
  const isCrash = pod.status === "CrashLoop";
  const [remediated, setRemediated] = useState(false);
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium"><ArrowLeft size={14}/> Back to Pods</button>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-[#00f0ff] tracking-wide">{pod.name}</h1>
          <p className="text-sm text-slate-400 mt-1.5">Namespace: <span className="text-slate-300 font-medium">{pod.namespace}</span> · Node: <span className="text-slate-300 font-medium font-mono">{pod.node}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <PodStatusBadge status={pod.status}/>
          {isCrash && !remediated && (
            <button onClick={() => setRemediated(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#00f2fe]/10 border border-[#00f2fe]/50 rounded-lg text-[#00f2fe] text-sm font-semibold hover:bg-[#00f2fe]/20 transition-all animate-pulse">
              <Zap size={14}/> AI Auto-Repair
            </button>
          )}
          {remediated && <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-semibold"><CheckCircle2 size={14}/> Remediated</div>}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="Image"    value={pod.image}/>
        <InfoCard label="Age"      value={pod.age}/>
        <InfoCard label="Restarts" value={pod.restarts.toString()} highlight={pod.restarts > 3}/>
        <InfoCard label="Status"   value={pod.status}/>
      </div>
      <div className="border border-slate-800 rounded-xl bg-[#030811] p-5">
        <div className="flex items-center gap-2 text-slate-400 mb-4 pb-3 border-b border-slate-800">
          <Terminal size={14} className="text-[#00f2fe]"/>
          <span className="text-sm font-semibold">Pod Logs <span className="text-slate-600 font-normal">(last 10 lines)</span></span>
        </div>
        <div className="space-y-2 font-mono text-sm leading-relaxed">
          {isCrash && !remediated ? (<>
            <LogLine time="22:53:01" level="ERROR" msg="panic: runtime error: invalid memory address"/>
            <LogLine time="22:53:01" level="ERROR" msg="goroutine 1 [running]:"/>
            <LogLine time="22:53:02" level="ERROR" msg="main.main() /app/main.go:42 +0x78"/>
            <LogLine time="22:53:02" level="INFO"  msg="Container will be restarted by kubelet..."/>
            <LogLine time="22:53:12" level="INFO"  msg="[kuboptix-ai] CrashLoop detected — analyzing root cause..."/>
            <LogLine time="22:53:12" level="WARN"  msg="[kuboptix-ai] Suspected: missing env var PAYMENT_API_KEY"/>
          </>) : (<>
            <LogLine time="22:50:01" level="INFO" msg="Service started successfully on :8080"/>
            <LogLine time="22:50:02" level="INFO" msg="Connected to postgres at 10.96.11.100:5432"/>
            <LogLine time="22:52:10" level="INFO" msg="Health check passed — /healthz 200 OK"/>
            <LogLine time="22:53:00" level="INFO" msg="Processed 142 requests in last 60s"/>
            <LogLine time="22:53:45" level="INFO" msg="Memory usage: 142MiB / 512MiB"/>
          </>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border border-slate-800 rounded-xl p-5 bg-[#0a0f1c]/50 space-y-4">
          <div className="text-sm font-semibold text-slate-300">Resource Limits</div>
          <ResourceBar label="CPU Request"  value={45}  max={500} unit="m"   color="#00f0ff"/>
          <ResourceBar label="CPU Limit"    value={200} max={500} unit="m"   color="#00f0ff"/>
          <ResourceBar label="Mem Request"  value={128} max={512} unit="MiB" color="#10b981"/>
          <ResourceBar label="Mem Limit"    value={512} max={512} unit="MiB" color="#10b981"/>
        </div>
        <div className="border border-slate-800 rounded-xl p-5 bg-[#0a0f1c]/50 space-y-3">
          <div className="text-sm font-semibold text-slate-300 mb-2">Labels & Annotations</div>
          {[["app",pod.name.split("-")[0]],["version",pod.image.split(":")[1]||"latest"],["env",pod.namespace],["managed-by","kuboptix"]].map(([k,v])=>(
            <div key={k} className="flex items-center gap-2 text-sm font-mono">
              <span className="px-2 py-0.5 bg-[#00f2fe]/10 border border-[#00f2fe]/20 rounded text-[#00f2fe] text-xs">{k}</span>
              <span className="text-slate-500">=</span>
              <span className="text-slate-300">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NODES ────────────────────────────────────────────────────────────────────

function NodesView({ nodes }: { nodes: typeof ALL_NODES }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Cluster Nodes" sub={`${nodes.length} nodes · ${nodes.filter(n=>n.status==="Ready").length} Ready · ${nodes.filter(n=>n.status!=="Ready").length} NotReady`}/>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {nodes.map((node, i) => {
          const isReady = node.status === "Ready";
          const color   = isReady ? "#10b981" : "#ef4444";
          return (
            <div key={i} className="relative border border-slate-800 rounded-xl bg-[#0a0f1c]/60 p-5 flex flex-col gap-4 hover:border-slate-600 transition-all overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:color}}/>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-semibold text-slate-200 font-mono">{node.name}</div>
                  <div className="text-xs text-[#00f0ff] font-semibold uppercase tracking-wider mt-1">{node.role}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{color}}>
                  <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{background:color}}/>
                  {node.status}
                </div>
              </div>
              <div className="space-y-2.5">
                <MiniBar label="CPU" pct={node.cpuPct} color="#00f0ff"/>
                <MiniBar label="Memory" pct={node.memPct} color="#10b981"/>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-3 border-t border-slate-800/60">
                <span className="text-slate-500">CPU: <span className="text-slate-300 font-medium">{node.cpu}</span></span>
                <span className="text-slate-500">Mem: <span className="text-slate-300 font-medium">{node.memory}</span></span>
                <span className="text-slate-500">K8s: <span className="text-slate-300 font-mono">{node.kubelet}</span></span>
                <span className="text-slate-500">Age: <span className="text-slate-300 font-medium">{node.age}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DEPLOYMENTS ──────────────────────────────────────────────────────────────

function DeploymentsView({ deployments }: { deployments: typeof ALL_DEPLOYMENTS }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Deployments" sub={`${deployments.length} deployments · ${deployments.filter(d=>d.status==="Healthy").length} Healthy`}/>
      {deployments.length === 0 ? <EmptyState label="No deployments in this namespace"/> : (
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0f1c] border-b border-slate-800">
              <tr>{["Name","Namespace","Desired","Ready","Available","Status","Age"].map(h=>
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deployments.map((d, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4"><div className="flex items-center gap-2"><Package size={15} className="text-[#00f2fe] shrink-0"/><span className="text-sm font-semibold text-white">{d.name}</span></div></td>
                  <td className="px-5 py-4"><NsBadge ns={d.namespace}/></td>
                  <td className="px-5 py-4"><span className="text-sm font-medium text-slate-300">{d.desired}</span></td>
                  <td className="px-5 py-4"><span className={`text-sm font-bold ${d.ready<d.desired?"text-red-400":"text-[#10b981]"}`}>{d.ready}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-300">{d.available}</span></td>
                  <td className="px-5 py-4"><StatusBadge status={d.status}/></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-500">{d.age}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

function ServicesView({ services }: { services: typeof ALL_SERVICES }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Services" sub={`${services.length} services · ${services.filter(s=>s.type==="LoadBalancer").length} LoadBalancers`}/>
      {services.length === 0 ? <EmptyState label="No services in this namespace"/> : (
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0f1c] border-b border-slate-800">
              <tr>{["Name","Namespace","Type","Cluster IP","External IP","Ports","Age"].map(h=>
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {services.map((s, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4"><div className="flex items-center gap-2"><Share2 size={14} className="text-[#00f2fe] shrink-0"/><span className="text-sm font-semibold text-white">{s.name}</span></div></td>
                  <td className="px-5 py-4"><NsBadge ns={s.namespace}/></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${s.type==="LoadBalancer"?"bg-[#00f2fe]/10 border-[#00f2fe]/30 text-[#00f2fe]":s.type==="NodePort"?"bg-purple-500/10 border-purple-500/30 text-purple-400":"bg-slate-800 border-slate-700 text-slate-400"}`}>{s.type}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-400 font-mono">{s.clusterIP}</span></td>
                  <td className="px-5 py-4"><span className={`text-sm font-mono ${s.externalIP!=="—"?"text-[#10b981] font-semibold":"text-slate-600"}`}>{s.externalIP}{s.externalIP!=="—"&&<ExternalLink size={11} className="inline ml-1 opacity-60"/>}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-400 font-mono">{s.ports}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-500">{s.age}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SECRETS ──────────────────────────────────────────────────────────────────

function SecretsView({ secrets }: { secrets: typeof ALL_SECRETS }) {
  const typeColor = (t: string) => {
    if (t.includes("tls"))    return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    if (t.includes("docker")) return "bg-purple-500/10 border-purple-500/30 text-purple-400";
    if (t.includes("token"))  return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    return "bg-slate-800 border-slate-700 text-slate-400";
  };
  const shortType = (t: string) => {
    if (t === "Opaque") return "Opaque";
    if (t.includes("tls")) return "TLS";
    if (t.includes("docker")) return "DockerConfig";
    if (t.includes("token")) return "ServiceAccount";
    return t;
  };
  return (
    <div className="space-y-6">
      <SectionHeader title="Secrets" sub={`${secrets.length} secrets · TLS, Opaque, DockerConfig · All data redacted`}/>
      {secrets.length === 0 ? <EmptyState label="No secrets in this namespace"/> : (
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0f1c] border-b border-slate-800">
              <tr>{["Name","Namespace","Type","Data Keys","Age"].map(h=>
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {secrets.map((s, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4"><div className="flex items-center gap-2"><Key size={14} className="text-amber-400 shrink-0"/><span className="text-sm font-semibold text-white">{s.name}</span></div></td>
                  <td className="px-5 py-4"><NsBadge ns={s.namespace}/></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${typeColor(s.type)}`}>{shortType(s.type)}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-300">{s.keys}</span>
                      <span className="text-xs text-slate-600">{Array(s.keys).fill("••••").join(", ")}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-500">{s.age}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── RBAC ─────────────────────────────────────────────────────────────────────

function RbacView({ rbac }: { rbac: typeof ALL_RBAC }) {
  const kindColor = (k: string) => {
    if (k === "ClusterRole")        return "bg-[#00f2fe]/10 border-[#00f2fe]/30 text-[#00f2fe]";
    if (k === "ClusterRoleBinding") return "bg-purple-500/10 border-purple-500/30 text-purple-400";
    if (k === "Role")               return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    return "bg-amber-500/10 border-amber-500/30 text-amber-400";
  };
  return (
    <div className="space-y-6">
      <SectionHeader title="RBAC" sub={`${rbac.length} resources · Roles, ClusterRoles, RoleBindings, ClusterRoleBindings`}/>
      {rbac.length === 0 ? <EmptyState label="No RBAC resources in this namespace"/> : (
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0f1c] border-b border-slate-800">
              <tr>{["Kind","Name","Namespace","Rules","Subjects","Age"].map(h=>
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rbac.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${kindColor(r.kind)}`}>{r.kind}</span></td>
                  <td className="px-5 py-4"><div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#00f2fe] shrink-0"/><span className="text-sm font-semibold text-white">{r.name}</span></div></td>
                  <td className="px-5 py-4">{r.namespace==="—"?<span className="text-slate-600 text-sm">Cluster-wide</span>:<NsBadge ns={r.namespace}/>}</td>
                  <td className="px-5 py-4"><span className="text-sm font-semibold text-slate-300">{r.rules} rules</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-400">{r.subjects}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-500">{r.age}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── CRDs ─────────────────────────────────────────────────────────────────────

function CrdsView({ crds }: { crds: typeof ALL_CRDS }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Custom Resource Definitions" sub={`${crds.length} CRDs installed · Cluster-scoped`}/>
      {crds.length === 0 ? <EmptyState label="No CRDs found in this cluster"/> : (
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0f1c] border-b border-slate-800">
              <tr>{["Kind","Group","Scope","Versions","Instances","Age"].map(h=>
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              )}</tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {crds.map((c, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4"><div className="flex items-center gap-2"><FileCode size={14} className="text-purple-400 shrink-0"/><span className="text-sm font-semibold text-white">{c.kind}</span></div></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-400 font-mono">{c.group}</span></td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${c.scope==="Namespaced"?"bg-blue-500/10 border-blue-500/30 text-blue-400":"bg-purple-500/10 border-purple-500/30 text-purple-400"}`}>
                      {c.scope}
                    </span>
                  </td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-300 font-mono">{c.versions}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-200">{c.instances}</span>
                      <span className="text-xs text-slate-600">objects</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-500">{c.age}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h1 className="font-orbitron text-3xl font-bold text-[#00f0ff] tracking-wide drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">{title}</h1>
      <p className="text-sm text-slate-400 mt-2">{sub}</p>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color, bad }: any) {
  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-[#0a0f1c]/80 relative overflow-hidden hover:border-slate-700 transition-all" style={{borderColor:`${color}20`}}>
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{backgroundColor:color}}/>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</h3>
        <div style={{color}}>{icon}</div>
      </div>
      <div className="text-4xl font-orbitron font-bold text-white mb-1.5">{value}</div>
      <div className="text-sm text-slate-400">{sub}</div>
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-r border-b" style={{borderColor:color}}/>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, color, children }: any) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-[#0a0f1c]/50 h-72 flex flex-col relative">
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-l border-t border-slate-700"/>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-r border-t border-slate-700"/>
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-l border-b border-slate-700"/>
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-r border-b border-slate-700"/>
      <div className="flex items-center gap-2 mb-1" style={{color}}>{icon}<h3 className="font-orbitron tracking-wide text-sm font-bold">{title}</h3></div>
      <p className="text-xs text-slate-500 font-medium mb-5">{subtitle}</p>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function HealthMetric({ label, value, color }: any) {
  return (
    <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className={`font-orbitron font-bold text-xl ${color}`}>{value}</span>
    </div>
  );
}

function PodStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, any> = {
    "Running":   { cls: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", dot: "#10b981", pulse: true },
    "Pending":   { cls: "bg-amber-500/10 border-amber-500/30 text-amber-400",       dot: "#f59e0b", pulse: false },
    "CrashLoop": { cls: "bg-red-500/10 border-red-500/30 text-red-400",             dot: "#ef4444", pulse: false },
    "Warning":   { cls: "bg-orange-500/10 border-orange-500/30 text-orange-400",    dot: "#f97316", pulse: true },
  };
  const c = cfg[status] ?? { cls: "bg-slate-800 border-slate-700 text-slate-400", dot: "#64748b", pulse: false };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${c.pulse?"animate-pulse":""}`} style={{background:c.dot}}/>
      {status}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    "Healthy":  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    "Degraded": "bg-red-500/10 border-red-500/30 text-red-400",
    "Scaling":  "bg-amber-500/10 border-amber-500/30 text-amber-400",
  };
  return <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${cfg[status]??"bg-slate-800 border-slate-700 text-slate-400"}`}>{status}</span>;
}

function NsBadge({ ns }: { ns: string }) {
  const colors: Record<string, string> = {
    production: "bg-blue-500/10 border-blue-500/25 text-blue-400",
    staging:    "bg-purple-500/10 border-purple-500/25 text-purple-400",
    data:       "bg-amber-500/10 border-amber-500/25 text-amber-400",
    monitoring: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
    security:   "bg-red-500/10 border-red-500/25 text-red-400",
    development:"bg-pink-500/10 border-pink-500/25 text-pink-400",
    testing:    "bg-orange-500/10 border-orange-500/25 text-orange-400",
    qa:         "bg-teal-500/10 border-teal-500/25 text-teal-400",
  };
  return <span className={`px-2.5 py-0.5 rounded-md border text-xs font-semibold ${colors[ns]??"bg-slate-800 border-slate-700 text-slate-400"}`}>{ns}</span>;
}

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-[#0a0f1c]/50">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-sm font-semibold font-mono ${highlight?"text-red-400":"text-slate-200"}`}>{value}</div>
    </div>
  );
}

function LogLine({ time, level, msg }: { time: string; level: string; msg: string }) {
  const lc = level==="ERROR"?"text-red-400":level==="WARN"?"text-amber-400":"text-[#10b981]";
  return (
    <div className="flex gap-3">
      <span className="text-slate-600 shrink-0 select-none">{time}</span>
      <span className={`shrink-0 font-bold w-16 ${lc}`}>[{level}]</span>
      <span className="text-slate-300">{msg}</span>
    </div>
  );
}

function MiniBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-500">{label}</span>
        <span style={{color}}>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,backgroundColor:color,opacity:0.8}}/>
      </div>
    </div>
  );
}

function ResourceBar({ label, value, max, unit, color }: any) {
  const pct = Math.round((value/max)*100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-500">{label}</span>
        <span style={{color}} className="font-mono">{value}{unit} / {max}{unit}</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:color,opacity:0.75}}/>
      </div>
    </div>
  );
}

function StatusRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-slate-800 rounded-xl bg-[#0a0f1c]/30 text-slate-500 gap-3">
      <Database size={32} className="opacity-30"/>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function ChartTooltip({ active, payload, label, unit }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-[#020617] border border-slate-700 px-3 py-2 rounded-lg shadow-lg text-sm font-mono">
        <span className="text-slate-400">{label}: </span>
        <span className="text-white font-bold">{payload[0].value}{unit}</span>
      </div>
    );
  }
  return null;
}
