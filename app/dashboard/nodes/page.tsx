"use client";

import { useEffect, useState } from "react";
import { Server, RefreshCw, AlertCircle, HardDrive, Cpu } from "lucide-react";

interface Node {
  name: string;
  status: string;
  role: string;
  version: string;
  cpu: string;
  memory: string;
  age: string;
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/nodes");
      if (!response.ok) throw new Error("Failed to reach Kuboptix Backend");
      
      const data = await response.json();
      setNodes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="font-orbitron text-3xl font-bold text-[#00f0ff] tracking-wider drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-3">
          <Server className="w-8 h-8" /> CLUSTER NODES
          {!loading && (
            <span className="text-sm bg-[#00f0ff]/10 border border-[#00f0ff]/50 px-2 py-0.5 rounded text-[#00f0ff] font-mono animate-pulse">
              {nodes.length}
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-400 font-sans mt-1 ml-11">
          PHYSICAL & VIRTUAL HOST MACHINES
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
      {loading && nodes.length === 0 && (
        <div className="text-[#00f0ff] font-mono animate-pulse">
          INITIALIZING CONNECTION TO CONTROL PLANE HOSTS...
        </div>
      )}

      {/* NODES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {nodes.map((node: Node, i: number) => (
          <NodeCard key={i} data={node} />
        ))}
      </div>
    </div>
  );
}

function NodeCard({ data }: { data: Node }) {
  const isReady = data.status === "Ready";
  const color = isReady ? "#10b981" : "#ef4444";

  return (
    <div className="p-5 bg-[#0a0f1c]/60 border border-slate-800 rounded relative group hover:border-slate-600 transition-all flex flex-col justify-between h-56">
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: color }} />

      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-sans text-[15px] font-semibold text-slate-200 truncate pr-4" title={data.name}>
            {data.name}
          </h3>
          <div className={`w-2 h-2 rounded-full ${isReady ? "animate-pulse" : ""}`} style={{ backgroundColor: color }} />
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-[#00f0ff] mb-4">{data.role}</p>
        
        <div className="space-y-1.5 text-sm font-sans text-slate-500">
          <div className="flex justify-between">
            <span className="flex items-center gap-1"><Cpu size={14} /> Allocatable CPU</span>
            <span className="text-slate-300 font-medium">{data.cpu}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1"><HardDrive size={14} /> Allocatable Mem</span>
            <span className="text-slate-300 font-medium">{data.memory}</span>
          </div>
          <div className="flex justify-between">
            <span>Kubelet Version</span>
            <span className="text-slate-300 font-mono text-xs">{data.version}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
        <span className="text-xs font-mono tracking-widest uppercase" style={{ color }}>
          {data.status}
        </span>
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw size={14} />
          <span className="text-xs font-mono">{data.age}</span>
        </div>
      </div>
    </div>
  );
}
