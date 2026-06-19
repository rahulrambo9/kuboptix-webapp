"use client";

import { CheckCircle2, ShieldCheck, GitBranch, Cpu, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  highlights: string[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    version: "v2.0.4",
    date: "Jun 18, 2026",
    title: "Runtime Memory Threat Isolation",
    badge: "SECURITY FEATURE",
    badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/8",
    icon: <ShieldCheck size={16} />,
    highlights: [
      "Continuous image registry checks mapping package versions to active vulnerability CVE databases.",
      "Active memory tracers trace dynamic CVE executions inside execution threads, filtering static alert noise.",
      "Autonomously injects zero-trust CNI NetworkPolicies, isolating contaminated containers dynamically while keeping the logging pipeline active."
    ]
  },
  {
    version: "v2.0.0",
    date: "Jun 02, 2026",
    title: "Cortex AI Remediation Engine",
    badge: "MAJOR RELEASE",
    badgeColor: "text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/8",
    icon: <Cpu size={16} />,
    highlights: [
      "Autonomous Log Diagnostics Engine: parses stdout/stderr lines on node restart (CrashLoops, configuration conflicts, or liveness timeouts).",
      "One-Click Manifest Repair Panel: Synthesizes certified, verified YAML update solutions directly inside the visual proof terminal.",
      "Integrates Slack alerts and webhook target payloads, sending diagnostics reports directly to your active incident channels."
    ]
  },
  {
    version: "v1.8.0",
    date: "May 20, 2026",
    title: "Live multi-cluster topology graph",
    badge: "PERFORMANCE CORE",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
    icon: <GitBranch size={16} />,
    highlights: [
      "High-speed SVG/Canvas-paired node mapping that displays namespace topology without lagging, maintaining steady 60fps frame rates.",
      "Dynamic connection lines color-coded by traffic load and liveness response speeds.",
      "Adds hover overlays highlighting namespace limits, replicas, and pod configuration baseline mismatches."
    ]
  }
];

export default function ChangelogPage() {
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
            RELEASE LOGS // COMPILATION TIMELINE
          </span>
          <h1 className="font-orbitron font-extrabold leading-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}>
            The Kuboptix <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.45)]">Changelog</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Stay up-to-date with releases, feature enhancements, CNI patches, and AI remediation model upgrades.
          </p>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="pb-24 relative z-10 w-full px-6">
        <div className="max-w-3xl mx-auto relative pl-8 border-l-2 border-slate-800/80 space-y-12">
          
          {ENTRIES.map((entry, index) => (
            <div key={index} className="relative group">
              
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border border-slate-850 bg-[#070d1a] flex items-center justify-center text-slate-400 group-hover:border-[#00f2fe]/50 group-hover:text-[#00f2fe] group-hover:shadow-[0_0_8px_rgba(0,242,254,0.35)] transition-all z-20">
                {entry.icon}
              </div>

              {/* Version & Date Label */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 mb-2">
                <span className="text-base font-orbitron font-bold text-white group-hover:text-[#00f2fe] transition-colors">
                  {entry.version}
                </span>
                <span>•</span>
                <span>Released on {entry.date}</span>
                <span>•</span>
                <span className={`text-[9px] font-mono tracking-widest font-bold px-2 py-0.5 rounded border uppercase ${entry.badgeColor}`}>
                  {entry.badge}
                </span>
              </div>

              {/* Card Container */}
              <div className="rounded-2xl border border-slate-800/85 bg-[#040810]/40 backdrop-blur-sm p-6 group-hover:border-slate-700/50 hover:bg-[#071324]/20 transition-all duration-300 space-y-4">
                
                <h3 className="font-orbitron font-bold text-lg text-white">
                  {entry.title}
                </h3>
                
                <ul className="space-y-3">
                  {entry.highlights.map((item, hiIndex) => (
                    <li key={hiIndex} className="flex gap-3 text-xs md:text-sm text-slate-350 leading-relaxed align-top">
                      <CheckCircle2 size={15} className="text-[#00f2fe] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

              </div>

            </div>
          ))}

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
