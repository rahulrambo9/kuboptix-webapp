"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Terminal, ShieldCheck, Rocket, ArrowRight, Sparkles, 
  GitBranch, CheckCircle2, AlertTriangle, RefreshCw, Cpu, 
  Layers, HardDrive, ShieldAlert, LayoutDashboard, Cloud, Server, Database
} from "lucide-react";
import Navbar from "../components/Navbar";

type UseCaseKey = "platform" | "security" | "sre";

interface Metric {
  value: string;
  label: string;
}

interface TechnicalCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface UseCaseData {
  tag: string;
  headline: string;
  subtext: string;
  metrics: Metric[];
  cards: {
    problem: TechnicalCard;
    automation: TechnicalCard;
    guardrails: TechnicalCard;
  };
}

const USE_CASE_DATA: Record<UseCaseKey, UseCaseData> = {
  platform: {
    tag: "USE CASE // PLATFORM OPERATIONS",
    headline: "Automate Cluster Lifecycles, Eliminate Day-2 Toil",
    subtext: "Empower platform engineering teams to declare workloads cleanly, automate namespace configuration, and eliminate repetitive cluster operational tasks through GitOps.",
    metrics: [
      { value: "70%", label: "Reduction in Day-2 Manual Tasks" },
      { value: "0%", label: "Configuration Manifest Drift" },
      { value: "10x", label: "Faster Cluster Provisioning" }
    ],
    cards: {
      problem: {
        title: "The Operational Problem",
        description: "Platform engineers are buried under manual ticket backlogs, setting up custom namespace boundaries, modifying YAML definitions, and manually syncing resource limits across developers.",
        icon: <Terminal size={20} />
      },
      automation: {
        title: "The Kuboptix Automation",
        description: "Our GitOps reconciliation controller continuously monitors repository states, auto-provisions clusters, dynamically scales limits, and maintains declarative sync.",
        icon: <GitBranch size={20} />
      },
      guardrails: {
        title: "The Guardrails & Control",
        description: "Set hard namespace boundaries and strict compliance thresholds. Any drift from base definitions triggers instant reconciliation logs, Snyk audits, and developer notification sweeps.",
        icon: <Layers size={20} />
      }
    }
  },
  security: {
    tag: "USE CASE // RUNTIME SECURITY",
    headline: "Continuous Threat Prevention, Automated Guardrails",
    subtext: "Shift cluster security fully left. Continuously audit container registries, trace runtime CVEs, and deploy immediate isolation policies without breaking developer pipelines.",
    metrics: [
      { value: "100%", label: "Vulnerability Ingress Audited" },
      { value: "0m", label: "Perimeter Threat Exposure Window" },
      { value: "Zero", label: "False Positives in Production" }
    ],
    cards: {
      problem: {
        title: "The Operational Problem",
        description: "Traditional container scanning generates a deluge of alerts. Security teams lack runtime context to know which CVEs are actively exploitable, leading to massive alert fatigue.",
        icon: <ShieldAlert size={20} />
      },
      automation: {
        title: "The Kuboptix Automation",
        description: "Our active tracer maps active execution paths. When an exploitable threat is identified, it auto-synthesizes container patches and dynamic zero-trust NetworkPolicies.",
        icon: <Cpu size={20} />
      },
      guardrails: {
        title: "The Guardrails & Control",
        description: "Isolate flagged pods autonomously at the cluster perimeter, while notifying developers with a pre-validated, one-click patch recommendation for instant verification.",
        icon: <ShieldCheck size={20} />
      }
    }
  },
  sre: {
    tag: "USE CASE // INCIDENT TRIAGE",
    headline: "From Alert to Healed, Autonomously Executed",
    subtext: "Eradicate late-night pager duty. Kuboptix autonomously captures crashing pods, parses stderr logs, and injects runtime configuration repairs to restore SLAs.",
    metrics: [
      { value: "92%", label: "Incident Remediation Rate" },
      { value: "< 1s", label: "System-Wide Self-Healing MTTR" },
      { value: "99.99%", label: "Workload Availability Guaranteed" }
    ],
    cards: {
      problem: {
        title: "The Operational Problem",
        description: "Incidents happen at 2 AM. SRE teams waste valuable downtime logging into clusters, downloading log fragments, and guessing configuration errors under high pressure.",
        icon: <AlertTriangle size={20} />
      },
      automation: {
        title: "The Kuboptix Automation",
        description: "Built-in AI scanners analyze crash loop logs, resolve port conflicts or memory allocation drops, and execute rolling deployments dynamically to heal the cluster.",
        icon: <RefreshCw size={20} />
      },
      guardrails: {
        title: "The Guardrails & Control",
        description: "Establish custom auto-pilot boundaries. Resolve minor incidents automatically while locking down cluster-critical services to manual single-button approval states.",
        icon: <CheckCircle2 size={20} />
      }
    }
  }
};

export default function UseCasesPage() {
  const [activeCase, setActiveCase] = useState<UseCaseKey>("platform");

  // Synchronize active tab with URL query parameter
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "platform" || tab === "security" || tab === "sre") {
        setActiveCase(tab as UseCaseKey);
      }
    }
  }, []);

  const currentData = USE_CASE_DATA[activeCase];

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
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-md border border-[#10b981]/25 uppercase font-bold">
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

            {/* Use Case Selectors */}
            <div className="flex flex-wrap gap-2.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm mt-4 w-full sm:w-auto">
              <button
                onClick={() => setActiveCase("platform")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all duration-300 ${
                  activeCase === "platform"
                    ? "bg-[#10b981] text-[#070d1a] shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Terminal size={14} />
                PLATFORM ENG
              </button>
              <button
                onClick={() => setActiveCase("security")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all duration-300 ${
                  activeCase === "security"
                    ? "bg-[#10b981] text-[#070d1a] shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldCheck size={14} />
                DEVSECOPS
              </button>
              <button
                onClick={() => setActiveCase("sre")}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all duration-300 ${
                  activeCase === "sre"
                    ? "bg-[#10b981] text-[#070d1a] shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Rocket size={14} />
                SRE & OPS
              </button>
            </div>

          </div>

          {/* Right Column (40% width -> col-span-2) */}
          <div className="col-span-2 w-full flex justify-center">
            
            {/* Visual Workflow Panel Mockup */}
            <div className="w-full max-w-[380px] rounded-xl border border-slate-800 bg-[#040810]/75 backdrop-blur-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative group">
              
              {/* Pulsing Green Glow indicator */}
              <div className="absolute -inset-px rounded-xl bg-[#10b981]/5 group-hover:bg-[#10b981]/15 blur-[2px] transition-colors duration-500 pointer-events-none" />

              {/* Wireframe Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#030712]/90 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <span className="text-[9px] font-mono text-slate-500 tracking-wider ml-2">
                    {activeCase.toUpperCase()} // FLOW_ENGINE
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
              </div>

              {/* Wireframe Body Content */}
              <div className="p-5 flex flex-col gap-4 text-xs font-mono">
                
                {activeCase === "platform" && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md">
                      <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                        <span>GIT REPO sync</span>
                        <span className="text-emerald-400">READY</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">commit: deploy/manifests-v4</p>
                    </div>

                    <div className="flex justify-center text-slate-600">
                      <ArrowRight size={16} className="rotate-90" />
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-full w-[2px] bg-emerald-500 animate-pulse" />
                      <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                        <span>OPERATIONAL ENGINE</span>
                        <span className="text-[#10b981] animate-pulse">SYNCING</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">namespace: app-billing-prod</p>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-850">
                        <div className="bg-[#10b981] h-full w-3/4 animate-[syncProgress_2.5s_infinite]" />
                      </div>
                    </div>

                    <div className="flex justify-center text-slate-600">
                      <ArrowRight size={16} className="rotate-90" />
                    </div>

                    <div className="p-3 bg-[#10b981]/5 border border-[#10b981]/20 rounded-md">
                      <div className="flex justify-between text-[#10b981] text-[9px] mb-1">
                        <span>RECONCILIATION</span>
                        <span>100% COMPLETE</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">Cluster state declared successfully.</p>
                    </div>
                  </div>
                )}

                {activeCase === "security" && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md">
                      <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                        <span>VULNERABILITY SCAN</span>
                        <span className="text-red-400">ALERT</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">auth-server: CVE-2026-0810</p>
                    </div>

                    <div className="flex justify-center text-slate-600 animate-pulse">
                      <ArrowRight size={16} className="rotate-90 text-red-500" />
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-red-500/20 rounded-md">
                      <div className="flex justify-between text-red-400 text-[9px] mb-1">
                        <span>PERIMETER THREAT ENGINE</span>
                        <span className="animate-pulse">ISOLATING</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">Deploying NetworkPolicy isolation...</p>
                      <p className="text-[10px] text-slate-500 mt-1">status: inbound traffic blocked</p>
                    </div>

                    <div className="flex justify-center text-slate-600">
                      <ArrowRight size={16} className="rotate-90 text-[#10b981]" />
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-md">
                      <div className="flex justify-between text-emerald-400 text-[9px] mb-1">
                        <span>AUTO-REMEDIATION</span>
                        <span>RESOLVED</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">Base container updated. Locked.</p>
                    </div>
                  </div>
                )}

                {activeCase === "sre" && (
                  <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md">
                      <div className="flex justify-between text-slate-500 text-[9px] mb-1">
                        <span>RUNTIME TELEMETRY</span>
                        <span className="text-red-400">OOMKilled</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">pod/db-cache-srv-0 crashed</p>
                    </div>

                    <div className="flex justify-center text-slate-600">
                      <ArrowRight size={16} className="rotate-90" />
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-full w-[2px] bg-amber-500" />
                      <div className="flex justify-between text-amber-400 text-[9px] mb-1">
                        <span>AI INCIDENT RUNBOOK</span>
                        <span>RE-SIZING</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">Patching limits: 256Mi -&gt; 512Mi</p>
                      <p className="text-[9px] text-slate-500 mt-1">Deploying patched replica set...</p>
                    </div>

                    <div className="flex justify-center text-slate-600">
                      <ArrowRight size={16} className="rotate-90 text-[#10b981]" />
                    </div>

                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-md">
                      <div className="flex justify-between text-emerald-400 text-[9px] mb-1">
                        <span>SLA MONITOR</span>
                        <span>HEALTHY</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-bold">Pod running. Response: 14ms.</p>
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
                <span className="font-orbitron font-extrabold text-4xl lg:text-5xl text-[#10b981] drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]">
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
            <p className="text-xs font-mono tracking-[0.3em] text-[#10b981] uppercase mb-3 font-bold">TECHNICAL BREAKDOWN</p>
            <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              HOW KUBOPTIX <span className="text-[#10b981] drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">AUTOMATES</span> IT
            </h2>
            <p className="text-slate-400 text-sm">
              We translate complexity into clean orchestration boundaries, backing operations with strict policy limits.
            </p>
          </div>

          {/* 3 Breakdown Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Problem */}
            <BreakdownCard 
              icon={currentData.cards.problem.icon}
              title={currentData.cards.problem.title}
              description={currentData.cards.problem.description}
            />

            {/* Card 2: Automation */}
            <BreakdownCard 
              icon={currentData.cards.automation.icon}
              title={currentData.cards.automation.title}
              description={currentData.cards.automation.description}
            />

            {/* Card 3: Guardrails */}
            <BreakdownCard 
              icon={currentData.cards.guardrails.icon}
              title={currentData.cards.guardrails.title}
              description={currentData.cards.guardrails.description}
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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-[#10b981]/5 blur-[80px] pointer-events-none" />

          <p className="text-xs font-mono tracking-[0.3em] text-[#10b981] uppercase mb-4 font-bold">READY TO DEPLOY?</p>
          <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold text-white mb-6">
            TRANSFORM YOUR CLUSTER <br />
            <span className="text-[#10b981] drop-shadow-[0_0_20px_rgba(16,185,129,0.55)]">OPERATIONAL EFFICIENCY</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
            Eliminate alert fatigue, minimize downtime, and scale security parameters autonomously with confidence.
          </p>

          <div className="flex flex-row items-center justify-center gap-4 flex-wrap relative z-10">
            <a
              href="#waitlist"
              className="flex items-center justify-center px-8 py-4 bg-[#10b981] hover:bg-[#10b981]/95 text-[#070d1a] font-bold rounded-lg font-orbitron text-xs tracking-[0.15em] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_32px_rgba(16,185,129,0.55)] uppercase"
            >
              Book a Team Demo
            </a>
            <Link
              href="/login"
              className="flex items-center justify-center px-8 py-4 border-2 border-slate-700 hover:border-[#10b981] bg-transparent text-slate-300 hover:text-white rounded-lg font-orbitron text-xs tracking-[0.15em] transition-all hover:bg-[#10b981]/5 uppercase"
            >
              Explore Startup Sandbox
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER ACCENTS */}
      <footer className="border-t border-slate-900 bg-[#020617]/80 backdrop-blur-sm px-8 py-10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Kuboptix Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#10b981] font-bold">USE CASE ORCHESTRATION LAYER v2.0</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes syncProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(30%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes neonPulseGreen {
          0%, 100% { box-shadow: 0 0 3px rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.25); }
          50% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); border-color: rgba(16, 185, 129, 0.7); }
        }
        .green-pulse-card:hover {
          animation: neonPulseGreen 1.4s infinite;
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
    <div className="group relative rounded-xl border border-slate-800/60 bg-[#070d1a]/50 backdrop-blur-md p-8 overflow-hidden transition-all duration-350 hover:-translate-y-1 hover:bg-[#070d1a]/85 shadow-[0_4px_25px_rgba(0,0,0,0.45)] flex flex-col min-h-[300px] green-pulse-card">
      
      {/* Glow border line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon frame */}
      <div className="w-11 h-11 rounded-lg border border-slate-800/80 bg-slate-900/60 flex items-center justify-center mb-6 shrink-0 text-slate-400 group-hover:text-[#10b981] group-hover:border-[#10b981]/35 group-hover:bg-[#10b981]/5 transition-all duration-300 icon-container">
        {icon}
      </div>

      {/* Title & description */}
      <h3 className="font-orbitron text-base font-bold text-white tracking-tight mb-3 group-hover:text-[#10b981] transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed font-sans">
        {description}
      </p>

      {/* Corner Bracket decoration */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-slate-800/60 group-hover:border-[#10b981]/30 transition-colors" />
    </div>
  );
}
