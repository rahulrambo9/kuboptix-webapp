"use client";

import { useEffect, useState } from "react";
import { Share2, RefreshCw, AlertCircle, Shield } from "lucide-react";
import { useNamespace } from "../components/NamespaceContext";

interface Service {
  name: string;
  namespace: string;
  type: string;
  clusterIP: string;
  externalIP: string;
  age: string;
}

export default function ServicesPage() {
  const { selectedNamespace } = useNamespace();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/services?namespace=${selectedNamespace}`);
      if (!response.ok) throw new Error("Failed to reach Kuboptix Backend");
      
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchServices();
    const interval = setInterval(fetchServices, 15000);
    return () => clearInterval(interval);
  }, [selectedNamespace]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="font-orbitron text-3xl font-bold text-[#00f0ff] tracking-wider drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-3">
          <Share2 className="w-8 h-8" /> SERVICES
          {!loading && (
            <span className="text-sm bg-[#00f0ff]/10 border border-[#00f0ff]/50 px-2 py-0.5 rounded text-[#00f0ff] font-mono animate-pulse">
              {services.length}
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-400 font-sans mt-1 ml-11">
          NETWORK INGRESS & LOAD BALANCERS
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
      {loading && services.length === 0 && (
        <div className="text-[#00f0ff] font-mono animate-pulse">
          TUNING PROTOCOL HOOKS TO CLUSTER SERVICES...
        </div>
      )}

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((svc: Service, i: number) => (
          <ServiceCard key={i} data={svc} />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ data }: { data: Service }) {
  const isLoadBalancer = data.type === "LoadBalancer";

  return (
    <div className="p-5 bg-[#0a0f1c]/60 border border-slate-800 rounded relative group hover:border-slate-600 transition-all flex flex-col justify-between h-48">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff]/50" />

      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-sans text-[15px] font-semibold text-slate-200 truncate pr-4" title={data.name}>
            {data.name}
          </h3>
          <Shield className={`w-4 h-4 ${isLoadBalancer ? "text-[#10b981]" : "text-slate-600"}`} />
        </div>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">NAMESPACE: {data.namespace}</p>
        
        <div className="space-y-1.5 mt-4 text-sm font-sans text-slate-500">
          <div className="flex justify-between">
            <span>Type</span>
            <span className="text-slate-300 font-semibold">{data.type}</span>
          </div>
          <div className="flex justify-between">
            <span>Cluster IP</span>
            <span className="text-slate-300 font-mono text-xs">{data.clusterIP}</span>
          </div>
          {isLoadBalancer && (
            <div className="flex justify-between">
              <span>External IP</span>
              <span className="text-[#10b981] font-mono text-xs">{data.externalIP}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-800/50 text-slate-500">
        <RefreshCw size={14} className="mr-2" />
        <span className="text-xs font-mono">{data.age}</span>
      </div>
    </div>
  );
}
