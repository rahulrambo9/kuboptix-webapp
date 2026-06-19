"use client";

import { useEffect, useState } from "react";
import { Box, RefreshCw, Terminal, AlertCircle } from "lucide-react";
import { useNamespace } from "../components/NamespaceContext";

interface Pod {
  name: string;
  status: string;
  ip: string;
  node: string;
  restarts: number;
  age: string;
}

export default function PodsPage() {
  const { selectedNamespace } = useNamespace();
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/pods?namespace=${selectedNamespace}`);
        if (!response.ok) throw new Error("Failed to reach Kuboptix Backend");
        
        const data = await response.json();
        setPods(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchPods();
    
    const interval = setInterval(fetchPods, 10000);
    return () => clearInterval(interval);
  }, [selectedNamespace]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="font-orbitron text-3xl font-bold text-[#00f0ff] tracking-wider drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-3">
          <Box className="w-8 h-8" /> WORKLOAD PODS
          {/* NEW: The Pod Counter Badge */}
          {!loading && (
          <span className="text-sm bg-[#00f0ff]/10 border border-[#00f0ff]/50 px-2 py-0.5 rounded text-[#00f0ff] font-mono animate-pulse">
          {pods.length}
      </span>
    )}
        </h1>
        <p className="text-sm text-slate-400 font-sans mt-1 ml-11">
          SYSTEM WORKLOADS & CONTAINERS
        </p>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded text-red-400 font-sans text-sm">
          <AlertCircle size={18} />
          SYSTEM ERROR: {error} (Check CORS/Backend)
        </div>
      )}

      {/* LOADING STATE */}
      {loading && pods.length === 0 && (
        <div className="text-[#00f0ff] font-mono animate-pulse">
          INITIALIZING NEURAL LINK TO CLUSTER...
        </div>
      )}

      {/* PODS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pods.map((pod: Pod, i: number) => ( // Change 'any' to 'Pod'
          <PodCard key={i} data={pod} />
        ))}
      </div>
    </div>
  );
}

// ... Keep your PodCard component exactly as it is below ...
// ==========================================
// COMPONENT: POD CARD
// ==========================================
function PodCard({ data }: { data: Pod }) {
  // Logic for Status Colors
  let color = "#10b981"; // Green (Running)
  if (data.status === "Pending") color = "#eab308"; // Yellow
  if (data.status === "CrashLoopBackOff" || data.status === "Error") color = "#ef4444"; // Red

  return (
    <div className="p-5 bg-[#0a0f1c]/60 border border-slate-800 rounded relative group hover:border-slate-600 transition-all flex flex-col justify-between h-48">
       {/* Top Status Bar */}
       <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: color }} />

       <div>
         <div className="flex justify-between items-start mb-2">
            <h3 className="font-sans text-[15px] font-semibold text-slate-200 truncate pr-4" title={data.name}>{data.name}</h3>
            <div className={`w-2 h-2 rounded-full ${data.status === 'Running' ? 'animate-pulse' : ''}`} style={{ backgroundColor: color }} />
         </div>
         <p className="text-sm font-sans font-semibold mb-4" style={{ color: color }}>{data.status}</p>
         
         <div className="space-y-1.5">
           <div className="flex justify-between text-sm font-sans text-slate-500">
             <span>IP Address</span>
             <span className="text-slate-300 font-medium">{data.ip}</span>
           </div>
           <div className="flex justify-between text-sm font-sans text-slate-500">
             <span>Node</span>
             <span className="text-slate-300 font-medium">{data.node}</span>
           </div>
         </div>
       </div>

       <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-2 text-slate-500">
            <RefreshCw size={14} />
            <span className="text-xs font-mono">{data.restarts}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Terminal size={14} />
            <span className="text-xs font-mono">{data.age}</span>
          </div>
       </div>
    </div>
  );
}