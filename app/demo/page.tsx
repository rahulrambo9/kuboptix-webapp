"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity, Box, Layers, Server, Share2, Cpu, HardDrive,
  AlertTriangle, CheckCircle2, XCircle, RefreshCw, ChevronRight,
  Shield, Zap, Terminal, Bell, Search, MoreVertical, ExternalLink,
  TrendingUp, TrendingDown, Wifi, Clock, GitBranch, Package,
  ArrowLeft, Eye, Play, RotateCcw
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

// ─── DUMMY DATA ────────────────────────────────────────────────────────────────

const NODES = [
  { name: "kuboptix-node-01", role: "control-plane", status: "Ready", cpu: "4 cores", memory: "16Gi", kubelet: "v1.29.2", age: "14d", cpuPct: 38, memPct: 52 },
  { name: "kuboptix-node-02", role: "worker",        status: "Ready", cpu: "8 cores", memory: "32Gi", kubelet: "v1.29.2", age: "14d", cpuPct: 61, memPct: 71 },
  { name: "kuboptix-node-03", role: "worker",        status: "Ready", cpu: "8 cores", memory: "32Gi", kubelet: "v1.29.2", age: "14d", cpuPct: 45, memPct: 48 },
  { name: "kuboptix-node-04", role: "worker",        status: "NotReady", cpu: "8 cores", memory: "32Gi", kubelet: "v1.29.1", age: "3d",  cpuPct: 0,  memPct: 0  },
];

const PODS = [
  { name: "api-gateway-7d9f8b-xk2lp",       namespace: "production", status: "Running",   restarts: 0, node: "kuboptix-node-02", age: "2d",  image: "api-gateway:2.3.1" },
  { name: "auth-service-6c4d7f-mnp9q",      namespace: "production", status: "Running",   restarts: 1, node: "kuboptix-node-02", age: "2d",  image: "auth-service:1.8.0" },
  { name: "ml-inference-5b8a2c-rlst4",      namespace: "production", status: "Running",   restarts: 0, node: "kuboptix-node-03", age: "6h",  image: "ml-inference:3.1.2" },
  { name: "postgres-primary-0",             namespace: "data",       status: "Running",   restarts: 0, node: "kuboptix-node-01", age: "14d", image: "postgres:15.2" },
  { name: "redis-cache-5f9c3d-wq7rx",       namespace: "data",       status: "Running",   restarts: 2, node: "kuboptix-node-03", age: "5d",  image: "redis:7.2-alpine" },
  { name: "monitoring-agent-4k8p1-vn2wx",  namespace: "monitoring",  status: "Running",   restarts: 0, node: "kuboptix-node-02", age: "14d", image: "prom-agent:0.9.3" },
  { name: "log-shipper-9z3m6-cdt8y",        namespace: "monitoring",  status: "Pending",   restarts: 0, node: "—",              age: "4m",  image: "fluent-bit:2.2.0" },
  { name: "payment-svc-crash-1bj4x-p8krl", namespace: "production", status: "CrashLoop", restarts: 7, node: "kuboptix-node-03", age: "12m", image: "payment-svc:1.0.4" },
];

const DEPLOYMENTS = [
  { name: "api-gateway",     namespace: "production", desired: 3, ready: 3, available: 3, image: "api-gateway:2.3.1",   age: "14d", status: "Healthy" },
  { name: "auth-service",    namespace: "production", desired: 2, ready: 2, available: 2, image: "auth-service:1.8.0",  age: "14d", status: "Healthy" },
  { name: "ml-inference",    namespace: "production", desired: 2, ready: 2, available: 2, image: "ml-inference:3.1.2", age: "6h",  status: "Healthy" },
  { name: "payment-service", namespace: "production", desired: 2, ready: 0, available: 0, image: "payment-svc:1.0.4",  age: "12m", status: "Degraded" },
  { name: "redis-cache",     namespace: "data",       desired: 1, ready: 1, available: 1, image: "redis:7.2-alpine",    age: "5d",  status: "Healthy" },
  { name: "log-shipper",     namespace: "monitoring",  desired: 3, ready: 2, available: 2, image: "fluent-bit:2.2.0",  age: "4m",  status: "Scaling" },
];

const SERVICES = [
  { name: "api-gateway-svc",   namespace: "production", type: "LoadBalancer", clusterIP: "10.96.45.12",  externalIP: "34.121.88.5",  ports: "80:30080,443:30443", age: "14d" },
  { name: "auth-svc",          namespace: "production", type: "ClusterIP",    clusterIP: "10.96.22.7",   externalIP: "—",            ports: "8080:8080",         age: "14d" },
  { name: "ml-grpc-svc",       namespace: "production", type: "ClusterIP",    clusterIP: "10.96.99.3",   externalIP: "—",            ports: "9090:9090",         age: "6h"  },
  { name: "postgres-svc",      namespace: "data",       type: "ClusterIP",    clusterIP: "10.96.11.100", externalIP: "—",            ports: "5432:5432",         age: "14d" },
  { name: "redis-svc",         namespace: "data",       type: "ClusterIP",    clusterIP: "10.96.55.8",   externalIP: "—",            ports: "6379:6379",         age: "5d"  },
  { name: "monitoring-lb",     namespace: "monitoring",  type: "LoadBalancer", clusterIP: "10.96.77.2",   externalIP: "34.121.10.22", ports: "3000:30300",        age: "14d" },
];

const CPU_DATA = [
  { t: "00:00", v: 32 }, { t: "02:00", v: 28 }, { t: "04:00", v: 24 },
  { t: "06:00", v: 41 }, { t: "08:00", v: 58 }, { t: "10:00", v: 72 },
  { t: "12:00", v: 81 }, { t: "14:00", v: 76 }, { t: "16:00", v: 69 },
  { t: "18:00", v: 65 }, { t: "20:00", v: 55 }, { t: "22:00", v: 43 },
];

const MEM_DATA = [
  { t: "00:00", v: 48 }, { t: "02:00", v: 49 }, { t: "04:00", v: 47 },
  { t: "06:00", v: 52 }, { t: "08:00", v: 61 }, { t: "10:00", v: 68 },
  { t: "12:00", v: 73 }, { t: "14:00", v: 75 }, { t: "16:00", v: 72 },
  { t: "18:00", v: 70 }, { t: "20:00", v: 66 }, { t: "22:00", v: 62 },
];

const NODE_CPU_BAR = NODES.map(n => ({ name: n.name.split("-").slice(-2).join("-"), cpu: n.cpuPct, mem: n.memPct }));

const ALERTS = [
  { severity: "critical", msg: "payment-svc CrashLoopBackOff — 7 restarts detected", time: "2m ago" },
  { severity: "warning",  msg: "kuboptix-node-04 is NotReady — possible kubelet failure", time: "8m ago" },
  { severity: "warning",  msg: "log-shipper pod stuck in Pending — insufficient resources", time: "11m ago" },
  { severity: "info",     msg: "ml-inference deployment scaled up to 2 replicas", time: "6h ago" },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

type View = "overview" | "pods" | "nodes" | "deployments" | "services";

export default function DemoPage() {
  const [view, setView] = useState<View>("overview");
  const [selectedPod, setSelectedPod] = useState<typeof PODS[0] | null>(null);

  return (
    <div className="flex min-h-screen bg-[#020617] font-sans text-white">

      {/* ── DEMO BANNER ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#00f2fe]/10 border-b border-[#00f2fe]/30 backdrop-blur-md flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-[#00f2fe] animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-[#00f2fe] tracking-widest uppercase">
            Sample Dashboard — Demo Mode · All data is simulated
          </span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={12} />
          Back to Home
        </Link>
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="w-64 border-r border-slate-800 flex flex-col fixed h-full z-20 bg-[#020617] overflow-y-auto pt-10">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 mb-4">
          <div className="w-8 h-8 border-2 border-[#00f0ff]/70 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Activity className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div>
            <div className="font-orbitron font-bold text-base tracking-widest text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              KUBOPTIX
            </div>
            <div className="text-[9px] text-slate-500 tracking-[0.25em] uppercase font-mono">
              Cluster Monitor
            </div>
          </div>
        </div>

        {/* Cluster selector badge */}
        <div className="mx-4 mb-4 px-3 py-2 bg-[#0a1628] border border-[#00f2fe]/20 rounded-lg">
          <div className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mb-0.5">Active Cluster</div>
          <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse inline-block" />
            prod-cluster-us-east1
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: "overview",     label: "OVERVIEW",     icon: <Activity size={16} /> },
            { id: "pods",         label: "PODS",         icon: <Box size={16} /> },
            { id: "nodes",        label: "NODES",        icon: <Server size={16} /> },
            { id: "deployments",  label: "DEPLOYMENTS",  icon: <Layers size={16} /> },
            { id: "services",     label: "SERVICES",     icon: <Share2 size={16} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setView(item.id as View); setSelectedPod(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-widest transition-all rounded hover:bg-[#00f0ff]/10 border-l-2
                ${view === item.id
                  ? "text-[#00f0ff] border-[#00f0ff] bg-[#00f0ff]/5 shadow-[0_0_15px_-5px_rgba(0,240,255,0.3)]"
                  : "text-slate-500 hover:text-[#00f0ff] border-transparent"}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.id === "pods" && (
                <span className="ml-auto text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-mono">1 ERR</span>
              )}
              {item.id === "nodes" && (
                <span className="ml-auto text-[9px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded font-mono">1 !!</span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Status */}
        <div className="p-4">
          <div className="border border-[#00f0ff]/20 rounded-lg p-3 bg-[#0a0f1c] space-y-2">
            <div className="text-[9px] text-[#00f0ff] font-mono tracking-widest font-bold uppercase mb-2">System Status</div>
            <StatusRow label="Latency" value="12ms" color="text-[#10b981]" />
            <StatusRow label="Uptime"  value="99.97%" color="text-[#00f0ff]" />
            <StatusRow label="Alerts"  value="3 active" color="text-amber-400" />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 ml-64 flex flex-col pt-10">

        {/* Top Header */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-sm sticky top-10 z-10">
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-500 tracking-widest uppercase">
              {view === "overview" ? "Cluster Overview" :
               view === "pods" ? "Pods" :
               view === "nodes" ? "Nodes" :
               view === "deployments" ? "Deployments" : "Services"}
            </div>
            {selectedPod && (
              <>
                <ChevronRight size={12} className="text-slate-600" />
                <div className="text-xs font-mono text-[#00f2fe] truncate max-w-xs">{selectedPod.name}</div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#10b981]">
              <Wifi size={11} className="animate-pulse" />
              LIVE STREAM
            </div>
            <div className="px-3 py-1.5 border border-slate-700 rounded text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Search size={11} />
              <span className="text-slate-600">Search resources...</span>
            </div>
            <div className="relative">
              <Bell size={16} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] font-bold flex items-center justify-center">3</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8 flex-1 overflow-auto">
          {view === "overview" && <OverviewView />}
          {view === "pods" && (
            selectedPod
              ? <PodDetailView pod={selectedPod} onBack={() => setSelectedPod(null)} />
              : <PodsView onSelect={setSelectedPod} />
          )}
          {view === "nodes"       && <NodesView />}
          {view === "deployments" && <DeploymentsView />}
          {view === "services"    && <ServicesView />}
        </main>
      </div>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────

function OverviewView() {
  return (
    <div className="space-y-6">
      <SectionHeader title="CLUSTER OVERVIEW" sub="prod-cluster-us-east1 · Demo Mode · 4 Nodes · Kubernetes v1.29.2" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="TOTAL NODES"   value="4"      sub="3 Ready · 1 NotReady" icon={<Server size={18}/>}   color="#00f0ff" trend="+1" />
        <StatCard title="RUNNING PODS"  value="6 / 8"  sub="1 CrashLoop · 1 Pending" icon={<Box size={18}/>}    color="#10b981" trend="↑2%" bad />
        <StatCard title="DEPLOYMENTS"   value="6"      sub="1 Degraded" icon={<Layers size={18}/>} color="#3b82f6" trend="All up" />
        <StatCard title="SERVICES"      value="6"      sub="2 LoadBalancers" icon={<Share2 size={18}/>} color="#f59e0b" trend="Stable" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="CPU USAGE" subtitle="Cluster avg · Current 61%" icon={<Cpu size={16}/>} color="#00f0ff">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CPU_DATA}>
              <defs>
                <linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00f0ff" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="t" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<ChartTooltip unit="%" />} />
              <Area type="monotone" dataKey="v" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#gCpu)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="MEMORY USAGE" subtitle="Cluster avg · Current 62%" icon={<HardDrive size={16}/>} color="#10b981">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MEM_DATA}>
              <defs>
                <linearGradient id="gMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="t" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<ChartTooltip unit="%" />} />
              <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gMem)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Node CPU/Mem bar */}
      <div className="p-5 border border-slate-800 rounded-lg bg-[#0a0f1c]/50">
        <div className="text-xs font-mono font-bold text-slate-300 tracking-widest uppercase mb-4 flex items-center gap-2">
          <Server size={13} className="text-[#00f0ff]" /> Per-Node Resource Utilization
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={NODE_CPU_BAR} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} unit="%" />
              <Tooltip content={<ChartTooltip unit="%" />} />
              <Bar dataKey="cpu" name="CPU" radius={[2,2,0,0]}>
                {NODE_CPU_BAR.map((_, i) => <Cell key={i} fill={_.cpu === 0 ? "#374151" : "#00f0ff"} fillOpacity={0.7} />)}
              </Bar>
              <Bar dataKey="mem" name="MEM" radius={[2,2,0,0]}>
                {NODE_CPU_BAR.map((_, i) => <Cell key={i} fill={_.mem === 0 ? "#374151" : "#10b981"} fillOpacity={0.7} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#00f0ff]/70 inline-block"/>CPU %</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#10b981]/70 inline-block"/>Memory %</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-600 inline-block"/>Node down</span>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="p-5 border border-slate-800 rounded-lg bg-[#0a0f1c]/50">
        <div className="text-xs font-mono font-bold text-slate-300 tracking-widest uppercase mb-4 flex items-center gap-2">
          <Bell size={13} className="text-amber-400" /> Active Alerts
        </div>
        <div className="space-y-2">
          {ALERTS.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 px-3 py-2.5 rounded border text-xs font-sans
              ${a.severity === "critical" ? "bg-red-950/30 border-red-500/30 text-red-300" :
                a.severity === "warning" ? "bg-amber-950/30 border-amber-500/30 text-amber-300" :
                "bg-blue-950/30 border-blue-500/30 text-blue-300"}`}>
              {a.severity === "critical" ? <XCircle size={14} className="shrink-0 mt-0.5" /> :
               a.severity === "warning"  ? <AlertTriangle size={14} className="shrink-0 mt-0.5" /> :
               <CheckCircle2 size={14} className="shrink-0 mt-0.5" />}
              <span className="flex-1">{a.msg}</span>
              <span className="text-slate-500 text-[10px] font-mono shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-slate-800 bg-[#0a0f1c]/50 rounded-lg text-center">
        <HealthMetric label="CLUSTER STATUS" value="DEGRADED" color="text-amber-400" />
        <HealthMetric label="HEALTHY NODES"  value="3 / 4"    color="text-white" />
        <HealthMetric label="POD SUCCESS"    value="75%"      color="text-amber-400" />
        <HealthMetric label="UPTIME"         value="14d 2h"   color="text-[#00f0ff]" />
      </div>
    </div>
  );
}

// ─── PODS VIEW ─────────────────────────────────────────────────────────────────

function PodsView({ onSelect }: { onSelect: (p: typeof PODS[0]) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="PODS" sub={`${PODS.length} total · 6 Running · 1 Pending · 1 CrashLoopBackOff`} />
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="bg-[#0a0f1c] border-b border-slate-800">
            <tr>
              {["NAME","NAMESPACE","STATUS","RESTARTS","NODE","AGE","IMAGE"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest text-slate-500 uppercase font-bold">{h}</th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {PODS.map((pod, i) => (
              <tr
                key={i}
                onClick={() => onSelect(pod)}
                className="hover:bg-[#00f2fe]/5 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3 text-white font-semibold group-hover:text-[#00f2fe] transition-colors">
                  {pod.name}
                </td>
                <td className="px-4 py-3 text-slate-400">{pod.namespace}</td>
                <td className="px-4 py-3">
                  <PodStatusBadge status={pod.status} />
                </td>
                <td className={`px-4 py-3 ${pod.restarts > 3 ? "text-red-400 font-bold" : "text-slate-400"}`}>
                  {pod.restarts}
                </td>
                <td className="px-4 py-3 text-slate-400">{pod.node}</td>
                <td className="px-4 py-3 text-slate-500">{pod.age}</td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-[160px]">{pod.image}</td>
                <td className="px-4 py-3 text-slate-600 group-hover:text-[#00f2fe]">
                  <ChevronRight size={14} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── POD DETAIL VIEW ─────────────────────────────────────────────────────────

function PodDetailView({ pod, onBack }: { pod: typeof PODS[0]; onBack: () => void }) {
  const isHealthy = pod.status === "Running";
  const isCrash   = pod.status === "CrashLoop";
  const [remediated, setRemediated] = useState(false);

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white font-mono transition-colors">
        <ArrowLeft size={12} /> Back to Pods
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-orbitron text-xl font-bold text-[#00f0ff] tracking-wider">{pod.name}</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Namespace: {pod.namespace} · Node: {pod.node}</p>
        </div>
        <div className="flex items-center gap-3">
          <PodStatusBadge status={pod.status} />
          {isCrash && !remediated && (
            <button
              onClick={() => setRemediated(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00f2fe]/10 border border-[#00f2fe]/50 rounded text-[#00f2fe] text-xs font-mono font-bold hover:bg-[#00f2fe]/20 transition-all animate-pulse"
            >
              <Zap size={12} /> AI Auto-Repair
            </button>
          )}
          {remediated && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs font-mono">
              <CheckCircle2 size={12} /> Remediated
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="Image"    value={pod.image} />
        <InfoCard label="Age"      value={pod.age} />
        <InfoCard label="Restarts" value={pod.restarts.toString()} highlight={pod.restarts > 3} />
        <InfoCard label="Status"   value={pod.status} />
      </div>

      {/* Fake logs */}
      <div className="border border-slate-800 rounded-lg bg-[#030811] p-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-500 mb-3 pb-2 border-b border-slate-800">
          <Terminal size={12} className="text-[#00f2fe]" />
          <span className="text-[10px] tracking-widest uppercase">Pod Logs (last 10 lines)</span>
        </div>
        {isCrash && !remediated ? (
          <div className="space-y-1 text-[11px] leading-relaxed">
            <LogLine time="22:53:01" level="ERROR" msg={`panic: runtime error: invalid memory address`} />
            <LogLine time="22:53:01" level="ERROR" msg="goroutine 1 [running]:" />
            <LogLine time="22:53:02" level="ERROR" msg="main.main() /app/main.go:42 +0x78" />
            <LogLine time="22:53:02" level="INFO"  msg="Container will be restarted by kubelet..." />
            <LogLine time="22:53:12" level="INFO"  msg="[kuboptix-ai] CrashLoop detected — analyzing root cause..." />
            <LogLine time="22:53:12" level="WARN"  msg="[kuboptix-ai] Suspected: missing env var PAYMENT_API_KEY" />
          </div>
        ) : (
          <div className="space-y-1 text-[11px] leading-relaxed">
            <LogLine time="22:50:01" level="INFO"  msg="Service started successfully on :8080" />
            <LogLine time="22:50:02" level="INFO"  msg="Connected to postgres at 10.96.11.100:5432" />
            <LogLine time="22:52:10" level="INFO"  msg="Health check passed — /healthz 200 OK" />
            <LogLine time="22:53:00" level="INFO"  msg="Processed 142 requests in last 60s" />
            <LogLine time="22:53:45" level="INFO"  msg="Memory usage: 142MiB / 512MiB" />
          </div>
        )}
      </div>

      {/* Resource limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-800 rounded-lg p-4 bg-[#0a0f1c]/50 space-y-3">
          <div className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase">Resource Limits</div>
          <ResourceBar label="CPU Request"    value={45} max={500}  unit="m"   color="#00f0ff" />
          <ResourceBar label="CPU Limit"      value={200} max={500} unit="m"   color="#00f0ff" />
          <ResourceBar label="Mem Request"    value={128} max={512} unit="MiB" color="#10b981" />
          <ResourceBar label="Mem Limit"      value={512} max={512} unit="MiB" color="#10b981" />
        </div>
        <div className="border border-slate-800 rounded-lg p-4 bg-[#0a0f1c]/50 space-y-3">
          <div className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase">Labels & Annotations</div>
          {[
            ["app",        pod.name.split("-")[0]],
            ["version",   pod.image.split(":")[1] || "latest"],
            ["env",       pod.namespace],
            ["managed-by","kuboptix"],
          ].map(([k,v]) => (
            <div key={k} className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-1.5 py-0.5 bg-[#00f2fe]/10 border border-[#00f2fe]/20 rounded text-[#00f2fe]">{k}</span>
              <span className="text-slate-400">=</span>
              <span className="text-slate-300">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NODES VIEW ───────────────────────────────────────────────────────────────

function NodesView() {
  return (
    <div className="space-y-5">
      <SectionHeader title="CLUSTER NODES" sub="Physical & virtual host machines · 3 Ready · 1 NotReady" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {NODES.map((node, i) => {
          const isReady = node.status === "Ready";
          const color = isReady ? "#10b981" : "#ef4444";
          return (
            <div key={i} className="relative border border-slate-800 rounded-lg bg-[#0a0f1c]/60 p-5 flex flex-col gap-3 hover:border-slate-600 transition-all group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: color }} />
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-slate-200 font-mono truncate">{node.name}</div>
                  <div className="text-[10px] text-[#00f0ff] font-mono uppercase tracking-widest mt-0.5">{node.role}</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold" style={{ color }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: color }} />
                  {node.status}
                </div>
              </div>
              <div className="space-y-2">
                <MiniBar label="CPU" pct={node.cpuPct} color="#00f0ff" />
                <MiniBar label="MEM" pct={node.memPct} color="#10b981" />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/50">
                <span>CPU: <span className="text-slate-300">{node.cpu}</span></span>
                <span>MEM: <span className="text-slate-300">{node.memory}</span></span>
                <span>K8s: <span className="text-slate-300">{node.kubelet}</span></span>
                <span>Age: <span className="text-slate-300">{node.age}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DEPLOYMENTS VIEW ─────────────────────────────────────────────────────────

function DeploymentsView() {
  return (
    <div className="space-y-5">
      <SectionHeader title="DEPLOYMENTS" sub="6 deployments · 5 Healthy · 1 Degraded · 1 Scaling" />
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="bg-[#0a0f1c] border-b border-slate-800">
            <tr>
              {["NAME","NAMESPACE","DESIRED","READY","AVAILABLE","STATUS","AGE"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest text-slate-500 uppercase font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {DEPLOYMENTS.map((d, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white font-semibold flex items-center gap-2">
                  <Package size={13} className="text-[#00f2fe] shrink-0" />
                  {d.name}
                </td>
                <td className="px-4 py-3 text-slate-400">{d.namespace}</td>
                <td className="px-4 py-3 text-slate-300">{d.desired}</td>
                <td className={`px-4 py-3 font-bold ${d.ready < d.desired ? "text-red-400" : "text-[#10b981]"}`}>{d.ready}</td>
                <td className="px-4 py-3 text-slate-300">{d.available}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider
                    ${d.status === "Healthy"  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                      d.status === "Degraded" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                      "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}>
                    {d.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{d.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SERVICES VIEW ────────────────────────────────────────────────────────────

function ServicesView() {
  return (
    <div className="space-y-5">
      <SectionHeader title="SERVICES" sub="6 services · 2 LoadBalancers · 4 ClusterIP" />
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead className="bg-[#0a0f1c] border-b border-slate-800">
            <tr>
              {["NAME","NAMESPACE","TYPE","CLUSTER-IP","EXTERNAL-IP","PORTS","AGE"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest text-slate-500 uppercase font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {SERVICES.map((s, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-white font-semibold flex items-center gap-2">
                  <Share2 size={12} className="text-[#00f2fe] shrink-0" />
                  {s.name}
                </td>
                <td className="px-4 py-3 text-slate-400">{s.namespace}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold
                    ${s.type === "LoadBalancer" ? "bg-[#00f2fe]/10 border-[#00f2fe]/30 text-[#00f2fe]" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
                    {s.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{s.clusterIP}</td>
                <td className={`px-4 py-3 ${s.externalIP !== "—" ? "text-[#10b981]" : "text-slate-600"}`}>
                  {s.externalIP}
                  {s.externalIP !== "—" && <ExternalLink size={10} className="inline ml-1 opacity-60" />}
                </td>
                <td className="px-4 py-3 text-slate-400">{s.ports}</td>
                <td className="px-4 py-3 text-slate-500">{s.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h1 className="font-orbitron text-2xl font-bold text-[#00f0ff] tracking-wider drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
        {title}
      </h1>
      <p className="text-xs text-slate-400 font-sans mt-1">{sub}</p>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color, trend, bad }: any) {
  return (
    <div className="p-5 rounded-lg border border-slate-800 bg-[#0a0f1c]/80 relative overflow-hidden group hover:border-opacity-60 transition-all" style={{ borderColor: `${color}25` }}>
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase font-mono">{title}</h3>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="text-3xl font-orbitron font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400 font-sans">{sub}</div>
      <div className={`absolute bottom-2 right-3 text-[10px] font-mono ${bad ? "text-red-400" : "text-[#10b981]"}`}>{trend}</div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b" style={{ borderColor: color }} />
    </div>
  );
}

function ChartCard({ title, subtitle, icon, color, children }: any) {
  return (
    <div className="p-5 rounded-lg border border-slate-800 bg-[#0a0f1c]/50 h-72 flex flex-col relative">
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-slate-700" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-slate-700" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-slate-700" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-slate-700" />
      <div className="flex items-center gap-2 mb-0.5" style={{ color }}>
        {icon}
        <h3 className="font-orbitron tracking-wider text-sm font-bold">{title}</h3>
      </div>
      <p className="text-[10px] text-slate-500 font-mono mb-4">{subtitle}</p>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function HealthMetric({ label, value, color }: any) {
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">{label}</span>
      <span className={`font-orbitron font-bold text-xl ${color}`}>{value}</span>
    </div>
  );
}

function PodStatusBadge({ status }: { status: string }) {
  const cfg = {
    "Running":   { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    "Pending":   { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-400" },
    "CrashLoop": { bg: "bg-red-500/10",     border: "border-red-500/30",     text: "text-red-400" },
  }[status] ?? { bg: "bg-slate-800", border: "border-slate-700", text: "text-slate-400" };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${status === "Running" ? "animate-pulse" : ""}`}
        style={{ background: status === "Running" ? "#10b981" : status === "CrashLoop" ? "#ef4444" : "#f59e0b" }} />
      {status.toUpperCase()}
    </span>
  );
}

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="border border-slate-800 rounded-lg p-3 bg-[#0a0f1c]/50">
      <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mb-1">{label}</div>
      <div className={`text-xs font-mono font-bold ${highlight ? "text-red-400" : "text-slate-200"}`}>{value}</div>
    </div>
  );
}

function LogLine({ time, level, msg }: { time: string; level: string; msg: string }) {
  const lc = level === "ERROR" ? "text-red-400" : level === "WARN" ? "text-amber-400" : "text-[#10b981]";
  return (
    <div className="flex gap-2 text-[11px]">
      <span className="text-slate-600 shrink-0">{time}</span>
      <span className={`shrink-0 font-bold ${lc}`}>[{level}]</span>
      <span className="text-slate-300">{msg}</span>
    </div>
  );
}

function MiniBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-mono text-slate-500">
        <span>{label}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.8 }} />
      </div>
    </div>
  );
}

function ResourceBar({ label, value, max, unit, color }: any) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-slate-500">{label}</span>
        <span style={{ color }}>{value}{unit} / {max}{unit}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.75 }} />
      </div>
    </div>
  );
}

function StatusRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between text-[10px] font-mono">
      <span className="text-slate-400">{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}

function ChartTooltip({ active, payload, label, unit }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-[#020617] border border-slate-700 px-3 py-1.5 rounded shadow-lg text-[11px] font-mono">
        <span className="text-slate-400">{label}: </span>
        <span className="text-white font-bold">{payload[0].value}{unit}</span>
      </div>
    );
  }
  return null;
}
