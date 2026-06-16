"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export default function SystemStatus() {
  // 1. STATE: Default to "Checking..."
  const [status, setStatus] = useState("checking");
  const [clusterName, setClusterName] = useState("...");

  // 2. EFFECT: Run once on mount
  useEffect(() => {
    checkConnection();
    
    // Optional: Check again every 30 seconds (Polling)
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = () => {
    fetch("http://localhost:8000/api/health")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status); // "online" or "offline"
        setClusterName(data.cluster);
      })
      .catch(() => {
        setStatus("offline");
        setClusterName("Server Error");
      });
  };

  // 3. RENDER: Handle the 3 states (Checking, Online, Offline)
  
  if (status === "offline") {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/50">
        <WifiOff className="w-3 h-3 text-red-500" />
        <div className="flex flex-col text-right">
             <span className="text-[10px] font-bold text-red-500 tracking-widest leading-none">DISCONNECTED</span>
             <span className="text-[12px] text-red-400/70 font-mono leading-none mt-1">{clusterName}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* The pulsing green dot */}
      <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-[#10b981] animate-pulse' : 'bg-yellow-500'}`} />
      
      <div className="flex flex-col text-right">
        <span className="text-[10px] font-mono text-slate-400 tracking-widest leading-none">
            {status === 'checking' ? 'CONNECTING...' : 'SYSTEM ONLINE'}
        </span>
        {/* Display the Cluster Name we fetched */}
        <span className="text-[9px] text-[#00f0f0] font-bold font-mono leading-none mt-1">
            {clusterName}
        </span>
      </div>
    </div>
  );
}