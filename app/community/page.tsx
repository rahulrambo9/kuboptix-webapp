"use client";

import { Github, MessageSquare, MapPin, Users, GitMerge, Compass } from "lucide-react";
import Navbar from "../components/Navbar";

interface CommunityHub {
  title: string;
  desc: string;
  icon: React.ReactNode;
  btnText: string;
  href: string;
  accent: string;
  glow: string;
}

const HUBS: CommunityHub[] = [
  {
    title: "GitHub Discussions",
    desc: "Share autonomous YAML manifests, file issues, collaborate on agent code, and review core PRs.",
    icon: <Github size={20} />,
    btnText: "Open Discussions",
    href: "https://github.com/rahulrambo9/kuboptix-webapp",
    accent: "text-white hover:border-slate-400 hover:bg-white/5",
    glow: "group-hover:border-slate-500/50"
  },
  {
    title: "Discord Server",
    desc: "Join real-time chat lanes to coordinate OOM repairs, discuss Cilium CNI security profiles, and talk ops.",
    icon: <MessageSquare size={20} />,
    btnText: "Join Discord Chat",
    href: "https://discord.gg/kuboptix",
    accent: "text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/5 hover:bg-[#00f2fe]/10",
    glow: "group-hover:border-[#00f2fe]/60 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]"
  },
  {
    title: "Kuboptix Meetups",
    desc: "Explore regional infrastructure events, view tech briefings, and network with SREs/DevSecOps experts.",
    icon: <MapPin size={20} />,
    btnText: "Browse Meetups",
    href: "#waitlist",
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
    glow: "group-hover:border-emerald-500/60 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
  }
];

export default function CommunityPage() {
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
            COMMUNITY HUB // TELEMETRY NETWORK
          </span>
          <h1 className="font-orbitron font-extrabold leading-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}>
            Connect with the <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.45)]">Community</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Join thousands of infrastructure architects, SRE managers, and DevSecOps practitioners configuring cloud-native self-healing.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-6 relative z-10 w-full border-y border-slate-900 bg-[#040812]/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="font-orbitron font-extrabold text-2xl md:text-3xl text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.25)] flex items-center gap-1.5 justify-center">
              <Users size={16} /> 15k+
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Global Members</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-orbitron font-extrabold text-2xl md:text-3xl text-white flex items-center gap-1.5 justify-center">
              <GitMerge size={16} className="text-purple-400" /> 3.4k+
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Agent Contributes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-orbitron font-extrabold text-2xl md:text-3xl text-white flex items-center gap-1.5 justify-center">
              <Compass size={16} className="text-emerald-400" /> 12
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Planned Events</span>
          </div>
        </div>
      </section>

      {/* GRID HUBS */}
      <section className="py-20 relative z-10 w-full px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {HUBS.map((hub, idx) => (
            <div 
              key={idx}
              className={`group flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-[#040810]/40 backdrop-blur-sm transition-all duration-350 hover:-translate-y-1 ${hub.glow}`}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg border border-slate-850 bg-slate-900/60 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-white transition-colors">
                  {hub.icon}
                </div>
                
                <h3 className="font-orbitron font-bold text-base text-white">
                  {hub.title}
                </h3>
                
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  {hub.desc}
                </p>
              </div>

              <div className="pt-6">
                <a
                  href={hub.href}
                  className={`flex items-center justify-center gap-1.5 w-full py-3 rounded-lg border border-slate-700 font-orbitron text-[10px] font-bold tracking-widest transition-all uppercase cursor-pointer ${hub.accent}`}
                >
                  {hub.btnText}
                </a>
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
