import { Layers, Activity, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DeploymentsPage() {
  const deployments = [
    { name: "frontend", ns: "default", ready: 2, total: 3, strategy: "RollingUpdate", age: "78d", status: "scaling" },
    { name: "backend-api", ns: "production", ready: 1, total: 2, strategy: "RollingUpdate", age: "97d", status: "scaling" },
    { name: "auth-service", ns: "default", ready: 1, total: 2, strategy: "RollingUpdate", age: "79d", status: "warning" },
    { name: "payment-service", ns: "staging", ready: 3, total: 3, strategy: "RollingUpdate", age: "84d", status: "healthy" },
    { name: "notification-service", ns: "staging", ready: 2, total: 3, strategy: "RollingUpdate", age: "102d", status: "scaling" },
    { name: "user-service", ns: "default", ready: 4, total: 4, strategy: "RollingUpdate", age: "112d", status: "healthy" },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="font-orbitron text-3xl font-bold text-[#00f0ff] tracking-wider drop-shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-3">
          <Layers className="w-8 h-8" /> DEPLOYMENTS
        </h1>
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1 ml-11">
          {deployments.length} ACTIVE DEPLOYMENTS
        </p>
      </div>

      {/* DEPLOYMENTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {deployments.map((dep, i) => (
          <DeploymentCard key={i} data={dep} />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: DEPLOYMENT CARD
// ==========================================
function DeploymentCard({ data }: any) {
  // Determine colors based on status
  const isHealthy = data.ready === data.total;
  const accentColor = isHealthy ? "#10b981" : "#eab308"; // Green vs Yellow
  const percentage = (data.ready / data.total) * 100;

  return (
    <div className="relative p-6 bg-[#0a0f1c]/60 border border-slate-800 rounded group hover:border-slate-600 transition-all">
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-slate-600 group-hover:border-[#00f0ff]" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-slate-600 group-hover:border-[#00f0ff]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-slate-600 group-hover:border-[#00f0ff]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-slate-600 group-hover:border-[#00f0ff]" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-orbitron text-xl text-[#00f0ff] tracking-wide mb-1">{data.name}</h3>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">NAMESPACE: {data.ns}</p>
        </div>
        <Activity className="w-5 h-5 text-slate-600 group-hover:text-[#00f0ff] transition-colors" />
      </div>

      {/* Replicas & Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono mb-2">
          <span className="text-slate-400">REPLICAS</span>
          <span className="text-white font-bold" style={{ color: accentColor }}>
            {data.ready} / {data.total}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%`, backgroundColor: accentColor }} 
          />
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-4 border-t border-slate-800/50 pt-4 mb-4">
        <div>
          <div className="text-[10px] text-slate-500 font-mono uppercase">AVAILABLE</div>
          <div className="text-sm font-bold text-white" style={{ color: accentColor }}>{data.ready}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-mono uppercase">STRATEGY</div>
          <div className="text-sm text-slate-300">{data.strategy}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-mono uppercase">AGE</div>
          <div className="text-sm text-slate-300">{data.age}</div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
        <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-[#10b981] animate-pulse' : 'bg-[#eab308] animate-pulse'}`} />
        <span style={{ color: accentColor }}>
          {isHealthy ? "FULLY OPERATIONAL" : "SCALING IN PROGRESS"}
        </span>
      </div>

    </div>
  );
}