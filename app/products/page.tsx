"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Terminal, ShieldCheck, Rocket, ArrowRight, Sparkles, 
  GitBranch, CheckCircle2, AlertTriangle, RefreshCw, Cpu, 
  Layers, HardDrive, ShieldAlert, LayoutDashboard, Cloud, Server, Database, Eye, Bot
} from "lucide-react";
import Navbar from "../components/Navbar";

type ProductKey = "dashboard" | "ai-engine" | "security";

interface Metric {
  value: string;
  label: string;
}

interface TechnicalCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProductData {
  tag: string;
  headline: string;
  subtext: string;
  metrics: Metric[];
  cards: {
    ingest: TechnicalCard;
    processing: TechnicalCard;
    state: TechnicalCard;
  };
}

const PRODUCT_DATA: Record<ProductKey, ProductData> = {
  dashboard: {
    tag: "PRODUCT // MONITORING & OBSERVE",
    headline: "Real-Time Cluster Topology, Instant Resource Clarity",
    subtext: "Live topology mapping, cross-namespace ingress checks, and real-time pod/node health visualizers to keep operations fully synchronized.",
    metrics: [
      { value: "99.9%", label: "Telemetry Ingestion Reliability" },
      { value: "< 10ms", label: "Node Sync Latency" },
      { value: "100%", label: "Namespace Coverage" }
    ],
    cards: {
      ingest: {
        title: "The Telemetry Ingest",
        description: "Collects rich cluster state data, container configurations, log buffers, and ingress latency parameters through lightweight node agents with near-zero resource impact.",
        icon: <Terminal size={20} />
      },
      processing: {
        title: "The Processing Engine",
        description: "Processes live telemetry streams and instantly compiles a visual, interactive topological graph of pods, replica sets, namespaces, and network traffic lanes.",
        icon: <Layers size={20} />
      },
      state: {
        title: "The Declarative State",
        description: "Constantly maps active cluster state metrics against baseline configuration manifests, instantly highlighting anomalies, log spikes, and alert patterns.",
        icon: <CheckCircle2 size={20} />
      }
    }
  },
  "ai-engine": {
    tag: "PRODUCT // AUTOMATED REMEDIATION",
    headline: "Autonomous Crash Diagnoses, One-Click Manifest Repair",
    subtext: "Autonomous crash incident log parsing, OOMKilled container limit resizing engines, and dynamic manifest patch synthesis to maintain strict SLAs.",
    metrics: [
      { value: "92%", label: "Automatic Detection Rate" },
      { value: "< 1s", label: "Mean Time to Repair (MTTR)" },
      { value: "85%", label: "Reduction in Escalated Incidents" }
    ],
    cards: {
      ingest: {
        title: "The Telemetry Ingest",
        description: "Ingests console stderr log streams, kernel OOM container notifications, port binding conflicts, and dynamic liveness/readiness probe fail statuses.",
        icon: <AlertTriangle size={20} />
      },
      processing: {
        title: "The Processing Engine",
        description: "Built-in AI scanning runbooks parse the logs, trace root-cause faults (like misconfigured ports or memory limits), and synthesize validated YAML updates.",
        icon: <RefreshCw size={20} />
      },
      state: {
        title: "The Declarative State",
        description: "Deploys a secure rolling patch manifest directly into the cluster, scaling limit configurations automatically to resolve the incident and secure SLAs.",
        icon: <Cpu size={20} />
      }
    }
  },
  security: {
    tag: "PRODUCT // SHIFT-LEFT DEFENSE",
    headline: "Continuous Vulnerability Tracing, Zero-Trust Isolation",
    subtext: "Registry scan compliance, active runtime CVE tracers, and zero-trust NetworkPolicy isolations to protect container bounds continuously.",
    metrics: [
      { value: "100%", label: "Container Registry Compliance" },
      { value: "0m", label: "Active Threat Mitigation Window" },
      { value: "Zero", label: "Permissive Network Violations" }
    ],
    cards: {
      ingest: {
        title: "The Telemetry Ingest",
        description: "Continuously scans container images in registries, maps package versions to global CVE vulnerability databases, and audits cluster role bindings.",
        icon: <ShieldAlert size={20} />
      },
      processing: {
        title: "The Processing Engine",
        description: "Active memory tracer checks if CVE-susceptible libraries are actively executed in runtime memory, prioritizing real risks and filtering alert noise.",
        icon: <Cpu size={20} />
      },
      state: {
        title: "The Declarative State",
        description: "Autonomously injects secure NetworkPolicy manifests to isolate compromised pods, blocking unauthorized ingress paths while alerting DevSecOps.",
        icon: <ShieldCheck size={20} />
      }
    }
  }
};

export default function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState<ProductKey>("dashboard");

  // Synchronize active tab with URL query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "dashboard" || tab === "ai-engine" || tab === "security") {
        setActiveProduct(tab as ProductKey);
      }
    }
  }, []);

  const currentData = PRODUCT_DATA[activeProduct];

  return (
    <main className="w-full relative flex flex-col font-sans text-white bg-[#070d1a] min-h-screen">
      
      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <Navbar />

      {/* =========================================
          SECTION 1: HERO (Split Asymmetrical)
      ========================================= */}
      <section className="pt-32 pb-16 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (60% width -> col-span-3) */}
          <div className="col-span-3 flex flex-col items-start space-y-6">
            
            {/* Tag */}
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1 rounded-md border border-[#00f2fe]/25 uppercase font-bold">
              {currentData.tag}
            </span>

            {/* Headline */}
            <h1 className="font-orbitron font-extrabold leading-tight text-white"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
              {currentData.headline}
            </h1>

            {/* Subtext */}
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-[580px]">
              {currentData.subtext}
            </p>

            {/* Product Selectors */}
            <div className="flex flex-wrap gap-2.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm mt-4 w-full sm:w-auto">
              <button
                onClick={() => setActiveProduct("dashboard")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all duration-300 ${
                  activeProduct === "dashboard"
                    ? "bg-[#00f2fe] text-[#070d1a] shadow-[0_0_15px_rgba(0,242,254,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LayoutDashboard size={14} />
                CLUSTER DASHBOARD
              </button>
              <button
                onClick={() => setActiveProduct("ai-engine")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all duration-300 ${
                  activeProduct === "ai-engine"
                    ? "bg-[#00f2fe] text-[#070d1a] shadow-[0_0_15px_rgba(0,242,254,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bot size={14} />
                AI ENGINE
              </button>
              <button
                onClick={() => setActiveProduct("security")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all duration-300 ${
                  activeProduct === "security"
                    ? "bg-[#00f2fe] text-[#070d1a] shadow-[0_0_15px_rgba(0,242,254,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldCheck size={14} />
                SECURITY GUARDRAILS
              </button>
            </div>

          </div>

          {/* Right Column (40% width -> col-span-2) */}
          <div className="col-span-2 w-full flex justify-center">
            
            {/* Visual Workflow Panel Mockup */}
            <div className="w-full max-w-[380px] rounded-xl border border-slate-800 bg-[#040810]/75 backdrop-blur-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative group">
              
              {/* Pulsing Cyan Glow indicator */}
              <div className="absolute -inset-px rounded-xl bg-[#00f2fe]/5 group-hover:bg-[#00f2fe]/15 blur-[2px] transition-colors duration-500 pointer-events-none" />

              {/* Wireframe Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#030712]/90 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="text-[9px] font-mono text-slate-500 tracking-wider ml-2">
                    {activeProduct.toUpperCase()} // DIAGNOSTIC_VIEW
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-ping" />
              </div>

              {/* Wireframe Body Content */}
              <div className="p-5 flex flex-col gap-4 text-xs font-mono">
                
                {activeProduct === "dashboard" && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease-out] relative">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md">
                      <p className="text-slate-500 text-[9px] mb-1">TOPOLOGY OVERVIEW</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-350">
                        <span className="text-emerald-400 font-bold">ingress-gateway</span>
                        <span className="text-slate-500 font-bold">lat: 4ms</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-350 mt-1 pl-3 border-l border-slate-800">
                        <span>└─ auth-service-v2</span>
                        <span className="text-[#00f2fe] font-bold">lat: 7ms</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-350 mt-1 pl-3 border-l border-slate-800">
                        <span>└─ database-cache</span>
                        <span className="text-slate-500">lat: 2ms</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-md">
                      <p className="text-slate-500 text-[9px] mb-1">REAL-TIME TRAFFIC ROUTING</p>
                      <div className="h-10 flex items-center justify-between border-t border-slate-850 pt-2">
                        <span className="text-[10px] text-slate-300">Total Ingress Load:</span>
                        <span className="text-[#00f2fe] font-bold">345 req/sec</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeProduct === "ai-engine" && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md">
                      <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                        <span>CONTAINER FAILURE</span>
                        <span className="text-red-400">CRITICAL</span>
                      </div>
                      <p className="text-slate-300 text-[10px] font-bold">pod/payment-srv OOMKilled</p>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-full w-[2px] bg-[#00f2fe]" />
                      <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                        <span>AI REMEDIATE CO-PILOT</span>
                        <span className="text-[#00f2fe] animate-pulse">SOLVED</span>
                      </div>
                      <p className="text-slate-300 text-[10px] font-bold">Re-sizing Limit: 256Mi -&gt; 512Mi</p>
                      <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mt-2">
                        <div className="bg-[#00f2fe] h-full w-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {activeProduct === "security" && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md">
                      <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                        <span>CVE REGISTRY COMPLIANCE</span>
                        <span className="text-[#00f2fe] font-bold">100% SECURE</span>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-300">
                        <p>✓ core-namespaces: audited</p>
                        <p>✓ dynamic scan: complete</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-red-500/20 rounded-md">
                      <div className="flex justify-between text-red-400 text-[9px] mb-1">
                        <span>ISOLATION POLICY</span>
                        <span className="animate-pulse">ACTIVE</span>
                      </div>
                      <p className="text-slate-300 text-[10px] font-bold">Isolated container: malicious-srv-pod</p>
                      <p className="text-[9px] text-slate-500 mt-1">Network traffic isolated via dynamic CNI.</p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================
          SECTION 2: KPI METRIC BANNER (3 Column)
      ========================================= */}
      <section className="py-12 relative z-10 w-full border-y border-slate-900 bg-[#040812]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-850">
            {currentData.metrics.map((metric, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4">
                <span className="font-orbitron font-extrabold text-4xl lg:text-5xl text-[#00f2fe] drop-shadow-[0_0_12px_rgba(0,242,254,0.35)]">
                  {metric.value}
                </span>
                <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase mt-2">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: TECHNICAL BREAKDOWN CARDS
      ========================================= */}
      <section className="py-24 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Section Header */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <p className="text-xs font-mono tracking-[0.3em] text-[#00f2fe] uppercase mb-3 font-bold">TECHNICAL BREAKDOWN</p>
            <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              INSIDE THE <span className="text-[#00f2fe] drop-shadow-[0_0_12px_rgba(0,242,254,0.3)]">ARCHITECTURE</span>
            </h2>
            <p className="text-slate-400 text-sm">
              We translate complexity into clean orchestration boundaries, backing operations with strict policy limits.
            </p>
          </div>

          {/* 3 Breakdown Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Ingest */}
            <BreakdownCard 
              icon={currentData.cards.ingest.icon}
              title={currentData.cards.ingest.title}
              description={currentData.cards.ingest.description}
            />

            {/* Card 2: Processing */}
            <BreakdownCard 
              icon={currentData.cards.processing.icon}
              title={currentData.cards.processing.title}
              description={currentData.cards.processing.description}
            />

            {/* Card 3: State */}
            <BreakdownCard 
              icon={currentData.cards.state.icon}
              title={currentData.cards.state.title}
              description={currentData.cards.state.description}
            />

          </div>

        </div>
      </section>

      {/* =========================================
          SECTION 4: ACTIONABLE FOOTER
      ========================================= */}
      <section className="py-24 relative z-10 w-full border-t border-slate-900 bg-[#040812]/30">
        <div className="max-w-4xl mx-auto px-8 text-center relative">
          
          {/* Subtle background glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-[#00f2fe]/5 blur-[80px] pointer-events-none" />

          <p className="text-xs font-mono tracking-[0.3em] text-[#00f2fe] uppercase mb-4 font-bold">READY TO DEPLOY?</p>
          <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold text-white mb-6">
            TRANSFORM YOUR CLUSTER <br />
            <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.55)]">OPERATIONAL EFFICIENCY</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
            Eliminate alert fatigue, minimize downtime, and scale security parameters autonomously with confidence.
          </p>

          <div className="flex flex-row items-center justify-center gap-4 flex-wrap relative z-10">
            <a
              href="#waitlist"
              className="flex items-center justify-center px-8 py-4 bg-[#00f2fe] hover:bg-[#00f2fe]/95 text-[#070d1a] font-bold rounded-lg font-orbitron text-xs tracking-[0.15em] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_32px_rgba(0,242,254,0.55)] uppercase"
            >
              Book a Product Demo
            </a>
            <Link
              href="/login"
              className="flex items-center justify-center px-8 py-4 border-2 border-slate-700 hover:border-[#00f2fe] bg-transparent text-slate-300 hover:text-white rounded-lg font-orbitron text-xs tracking-[0.15em] transition-all hover:bg-[#00f2fe]/5 uppercase"
            >
              Launch Sandbox Dashboard
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER ACCENTS */}
      <footer className="border-t border-slate-900 bg-[#020617]/80 backdrop-blur-sm px-8 py-10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Kuboptix Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
            <span className="text-[#00f2fe] font-bold">KUBOPTIX PRODUCT ENGINE v2.0</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes neonPulseCyan {
          0%, 100% { box-shadow: 0 0 3px rgba(0, 242, 254, 0.15); border-color: rgba(0, 242, 254, 0.25); }
          50% { box-shadow: 0 0 12px rgba(0, 242, 254, 0.5); border-color: rgba(0, 242, 254, 0.7); }
        }
        .cyan-pulse-card:hover {
          animation: neonPulseCyan 1.4s infinite;
        }
      `}</style>

    </main>
  );
}

// Sub-Component for detailed technical breakdown cards
function BreakdownCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-xl border border-slate-800/60 bg-[#070d1a]/50 backdrop-blur-md p-8 overflow-hidden transition-all duration-350 hover:-translate-y-1 hover:bg-[#070d1a]/85 shadow-[0_4px_25px_rgba(0,0,0,0.45)] flex flex-col min-h-[300px] cyan-pulse-card">
      
      {/* Glow border line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f2fe]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon frame */}
      <div className="w-11 h-11 rounded-lg border border-slate-800/80 bg-slate-900/60 flex items-center justify-center mb-6 shrink-0 text-slate-400 group-hover:text-[#00f2fe] group-hover:border-[#00f2fe]/35 group-hover:bg-[#00f2fe]/5 transition-all duration-300 icon-container">
        {icon}
      </div>

      {/* Title & description */}
      <h3 className="font-orbitron text-base font-bold text-white tracking-tight mb-3 group-hover:text-[#00f2fe] transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed font-sans">
        {description}
      </p>

      {/* Corner Bracket decoration */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-slate-800/60 group-hover:border-[#00f2fe]/30 transition-colors" />
    </div>
  );
}
