"use client";

import { Check, Star, Hourglass, RefreshCw, GitFork } from "lucide-react";
import Navbar from "../components/Navbar";

interface Milestone {
  title: string;
  desc: string;
  status: "live" | "dev" | "planned";
  progress: number;
  tags: string[];
  timeline: string;
}

const MILESTONES: Milestone[] = [
  // COLUMN 1: LIVE
  {
    title: "Runtime Memory Tracing",
    desc: "Active threat scans trace vulnerable execution boundaries in container memory rather than relying purely on static registry package tags.",
    status: "live",
    progress: 100,
    tags: ["Security", "Shield"],
    timeline: "Live - v2.0.4"
  },
  {
    title: "OOMKilled Limits Scaling",
    desc: "Automatically diagnoses kernel Out of Memory events and dynamically scales memory/CPU limits inside workload manifests.",
    status: "live",
    progress: 100,
    tags: ["Remediation", "AI Engine"],
    timeline: "Live - v2.0.0"
  },
  // COLUMN 2: IN DEVELOPMENT
  {
    title: "Multi-Tenant Telemetry CNI",
    desc: "Provides cryptographically isolated telemetry lanes for separate container tenants sharing the same CNI overlay network.",
    status: "dev",
    progress: 75,
    tags: ["CNI", "Network"],
    timeline: "Target: Q3 2026"
  },
  {
    title: "Slack Diagnostics Payload",
    desc: "Rich diagnostic log dumps, topological graphs, and YAML patch approvals pushed directly into dedicated Slack channels.",
    status: "dev",
    progress: 90,
    tags: ["Integration", "Alerts"],
    timeline: "Target: Q3 2026"
  },
  // COLUMN 3: PLANNED
  {
    title: "Offline LLM Core",
    desc: "Run local, low-resource fine-tuned diagnostics models inside offline cluster topologies to operate without internet ingress paths.",
    status: "planned",
    progress: 0,
    tags: ["AI Core", "Air-Gapped"],
    timeline: "Target: Q4 2026"
  },
  {
    title: "eBPF Kernel Profiler",
    desc: "Lightweight kernel-space socket profiling to identify anomalous network payloads before they execute CNI ingress policies.",
    status: "planned",
    progress: 0,
    tags: ["Kernel", "Observability"],
    timeline: "Target: Q1 2027"
  }
];

export default function ReleasesPage() {
  return (
    <main className="w-full relative flex flex-col font-sans text-white bg-[#070d1a] min-h-screen">
      
      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-36 pb-12 relative z-10 w-full text-center px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1 rounded-md border border-[#00f2fe]/25 uppercase font-bold">
            ROADMAP ENGINE // MILESTONE COMPILER
          </span>
          <h1 className="font-orbitron font-extrabold leading-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}>
            Releases & <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.45)]">Roadmap</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Track active developer sprints, planned telemetry capabilities, CNI security isolations, and AI remediation core releases.
          </p>
        </div>
      </section>

      {/* BOARD SECTION */}
      <section className="pb-24 relative z-10 w-full px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: LIVE RELEASE */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Check size={14} />
              </div>
              <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase">
                PRODUCTION STABLE (v2.0.x)
              </h3>
            </div>
            <div className="space-y-4">
              {MILESTONES.filter(m => m.status === "live").map((m, i) => (
                <MilestoneCard key={i} milestone={m} />
              ))}
            </div>
          </div>

          {/* COLUMN 2: ACTIVE DEVELOPMENT */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-6 h-6 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe]">
                <RefreshCw size={12} className="animate-spin" />
              </div>
              <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase">
                ACTIVE DEVELOPMENT (v2.1.0)
              </h3>
            </div>
            <div className="space-y-4">
              {MILESTONES.filter(m => m.status === "dev").map((m, i) => (
                <MilestoneCard key={i} milestone={m} />
              ))}
            </div>
          </div>

          {/* COLUMN 3: PLANNED ROADMAP */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Hourglass size={13} />
              </div>
              <h3 className="font-orbitron font-bold text-sm tracking-widest uppercase">
                FUTURE PLANS (v2.2+)
              </h3>
            </div>
            <div className="space-y-4">
              {MILESTONES.filter(m => m.status === "planned").map((m, i) => (
                <MilestoneCard key={i} milestone={m} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-[#020617]/80 backdrop-blur-sm px-8 py-10 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Kuboptix Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
            <span className="text-[#00f2fe] font-bold">KUBOPTIX PLATFORM ENGINE v2.0</span>
          </div>
        </div>
      </footer>

    </main>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <div className="group rounded-2xl border border-slate-800/80 bg-[#040810]/40 backdrop-blur-sm p-5 hover:border-slate-700/50 hover:bg-[#071324]/10 transition-all duration-300 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-orbitron font-bold text-base text-white group-hover:text-[#00f2fe] transition-colors leading-tight">
          {milestone.title}
        </h4>
        <span className="text-[10px] font-mono text-slate-500 shrink-0">
          {milestone.timeline}
        </span>
      </div>
      
      <p className="text-slate-400 text-xs leading-relaxed">
        {milestone.desc}
      </p>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Sprint Progress</span>
          <span className="font-bold text-slate-350">{milestone.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              milestone.status === "live" ? "bg-emerald-500" : "bg-[#00f2fe]"
            }`}
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        {milestone.tags.map((tag, idx) => (
          <span key={idx} className="text-[9px] font-mono tracking-wider font-bold px-2 py-0.5 border border-slate-800 bg-slate-900/40 text-slate-400 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
