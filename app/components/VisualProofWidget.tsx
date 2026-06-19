"use client";

import { useState, useEffect } from "react";
import { Terminal, ShieldAlert, CheckCircle2, Cpu, RotateCcw, Sparkles, ArrowRight } from "lucide-react";

type DemoState = "idle" | "scanning" | "remediating" | "deploying" | "success";

interface LogLine {
  text: string;
  type: "info" | "error" | "warn" | "success" | "ai";
}

export default function VisualProofWidget() {
  const [currentState, setCurrentState] = useState<DemoState>("idle");
  const [logs, setLogs] = useState<LogLine[]>([
    { text: "Initializing pod/auth-broker-7bc94...", type: "info" },
    { text: "Port 8080 binding failed: address already in use.", type: "error" },
    { text: "Error: CrashLoopBackOff. Pod exited with code 1.", type: "error" },
    { text: "System event: Back-off restarting failed container.", type: "warn" },
  ]);

  // Handle auto remediation sequence
  useEffect(() => {
    if (currentState === "idle") {
      setLogs([
        { text: "Initializing pod/auth-broker-7bc94...", type: "info" },
        { text: "Port 8080 binding failed: address already in use.", type: "error" },
        { text: "Error: CrashLoopBackOff. Pod exited with code 1.", type: "error" },
        { text: "System event: Back-off restarting failed container.", type: "warn" },
      ]);
      return;
    }

    let timer: NodeJS.Timeout;

    if (currentState === "scanning") {
      timer = setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          { text: "🔍 [AI Copilot] Hooking runtime debug logs...", type: "ai" },
          { text: "🔍 Analyzing deployment manifests & configurations...", type: "ai" },
        ]);
        setCurrentState("remediating");
      }, 1000);
    } else if (currentState === "remediating") {
      timer = setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          { text: "💡 [AI Copilot] Root Cause Identified: Port conflict on host network (port 8080).", type: "ai" },
          { text: "💡 Proposed Fix: Patch container port binding to 8084 (available).", type: "ai" },
          { text: "🛠️ Applying Kubernetes manifest patch dynamically...", type: "info" },
        ]);
        setCurrentState("deploying");
      }, 1500);
    } else if (currentState === "deploying") {
      timer = setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          { text: "♻️ Recreating container auth-broker-v2...", type: "info" },
          { text: "♻️ Spawning new Pod instance in namespace 'security-perimeter'...", type: "info" },
        ]);
        
        // Wait a bit more for rollout success
        setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            { text: "✅ Container auth-broker-v2 listening on port 8084.", type: "success" },
            { text: "✅ Readiness & Liveness probes passed.", type: "success" },
            { text: "🎉 Incident resolved autonomously. SLA impact: 0m.", type: "success" },
          ]);
          setCurrentState("success");
        }, 1200);

      }, 1200);
    }

    return () => clearTimeout(timer);
  }, [currentState]);

  const handleStartRemediation = () => {
    if (currentState === "idle") {
      setCurrentState("scanning");
    }
  };

  const handleReset = () => {
    setCurrentState("idle");
  };

  return (
    <div className="w-full max-w-[480px] rounded-xl border border-slate-800/80 bg-[#070d1a]/85 backdrop-blur-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group relative">
      
      {/* Glow highlight */}
      <div 
        className={`absolute -inset-px rounded-xl transition-all duration-1000 pointer-events-none opacity-20 group-hover:opacity-40
          ${currentState === "success" 
            ? "bg-gradient-to-r from-emerald-500 via-[#00f2fe] to-emerald-500 blur-[2px]" 
            : "bg-gradient-to-r from-red-500 via-[#00f2fe] to-red-500 blur-[2px]"
          }`} 
      />

      {/* Header Accent line */}
      <div 
        className={`h-[2px] w-full transition-all duration-700
          ${currentState === "success" ? "bg-emerald-500" : "bg-[#ff3b30]"}
          ${currentState === "scanning" || currentState === "remediating" || currentState === "deploying" ? "bg-amber-500 animate-pulse" : ""}
        `}
      />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#030712]/90 border-b border-slate-800/60 relative z-10">
        <div className="flex items-center gap-2">
          {/* OS Window Dots */}
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-1.5">
            <Terminal size={10} /> Copilot-Remediation-Sandbox
          </span>
        </div>
        <div>
          {currentState === "success" && (
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              REMEDIATED
            </span>
          )}
          {currentState === "idle" && (
            <span className="text-[10px] font-mono font-bold text-[#ff3b30] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              CRITICAL ERROR
            </span>
          )}
          {(currentState === "scanning" || currentState === "remediating" || currentState === "deploying") && (
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
              SELF-HEALING...
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex flex-col gap-4 relative z-10">
        
        {/* Pod Status Row */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#030712]/60 border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className={`absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75
                ${currentState === "success" ? "animate-ping bg-emerald-400" : "bg-red-400"}
                ${currentState === "idle" ? "animate-ping bg-red-400" : ""}
                ${currentState === "scanning" || currentState === "remediating" || currentState === "deploying" ? "animate-ping bg-amber-400" : ""}
              `} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 
                ${currentState === "success" ? "bg-emerald-500" : "bg-[#ff3b30]"}
                ${currentState === "scanning" || currentState === "remediating" || currentState === "deploying" ? "bg-amber-500" : ""}
              `} />
            </div>
            <div>
              <p className="text-xs font-mono font-semibold text-slate-300">pod/auth-broker-7bc94</p>
              <p className="text-[10px] font-mono text-slate-500">Namespace: core-infra · Restarts: 4</p>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xs font-mono font-bold tracking-tight
              ${currentState === "success" ? "text-emerald-400" : "text-[#ff3b30]"}
              ${currentState === "scanning" || currentState === "remediating" || currentState === "deploying" ? "text-amber-400" : ""}
            `}>
              {currentState === "success" && "Running"}
              {currentState === "idle" && "CrashLoopBackOff"}
              {currentState === "scanning" && "Scanning Logs..."}
              {currentState === "remediating" && "Injecting Fix..."}
              {currentState === "deploying" && "Re-deploying..."}
            </span>
          </div>
        </div>

        {/* Mock Logs Console */}
        <div className="relative h-44 rounded-lg bg-[#02050c] p-3 border border-slate-900 overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-thin">
          
          {/* Scanline Animation Effect during Remediation */}
          {(currentState === "scanning" || currentState === "remediating" || currentState === "deploying") && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f2fe]/4 to-transparent pointer-events-none z-10 animate-[scanline_2s_infinite]" />
          )}

          <div className="space-y-1.5">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`animate-[fadeIn_0.3s_ease-out_forwards]
                  ${log.type === "error" ? "text-red-400/90" : ""}
                  ${log.type === "warn" ? "text-amber-400/90" : ""}
                  ${log.type === "success" ? "text-emerald-400 font-semibold" : ""}
                  ${log.type === "ai" ? "text-[#00f2fe] font-semibold flex items-center gap-1" : ""}
                  ${log.type === "info" ? "text-slate-500" : ""}
                `}
              >
                {log.type === "ai" && <Cpu size={10} className="shrink-0" />}
                {log.text}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-between gap-3 mt-1 pt-1 border-t border-slate-800/40">
          <p className="text-[10px] font-mono text-slate-500">
            {currentState === "idle" && "Click AI Remediate to test self-healing loop"}
            {currentState === "scanning" && "Analyzing system telemetry..."}
            {currentState === "remediating" && "Synthesizing cluster patch..."}
            {currentState === "deploying" && "Rolling out v2 deployment..."}
            {currentState === "success" && "Node healed successfully."}
          </p>

          <div>
            {currentState === "idle" ? (
              <button
                onClick={handleStartRemediation}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#00f2fe]/40 bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] hover:text-white rounded-md font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(0,242,254,0.15)] hover:shadow-[0_0_20px_rgba(0,242,254,0.35)]"
              >
                <Sparkles size={12} className="animate-pulse" />
                AI Remediate
              </button>
            ) : currentState === "success" ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-md font-mono text-xs transition-all"
              >
                <RotateCcw size={12} />
                Reset Demo
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-slate-500 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Processing
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
