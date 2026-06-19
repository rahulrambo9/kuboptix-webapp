"use client";

import { 
  Terminal, Cpu, Layers, Check, Minus, Zap, Sparkles, Bot, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function PricingPage() {
  return (
    <main className="w-full relative flex flex-col font-sans text-white bg-[#070d1a] min-h-screen">
      
      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <Navbar />

      {/* =========================================
          SECTION 1: HERO
      ========================================= */}
      <section className="pt-36 pb-16 relative z-10 w-full text-center px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1 rounded-md border border-[#00f2fe]/25 uppercase font-bold">
            PRICING PLANS // ENGINE CAPACITIES
          </span>
          <h1 className="font-orbitron font-extrabold leading-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Simple, Node-Scale <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.45)]">Pricing</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Scale your Kubernetes operations with absolute clarity. Choose the autonomous tier that fits your engineering team's complexity goals.
          </p>
        </div>
      </section>

      {/* =========================================
          SECTION 2: HORIZONTAL PRICING CARDS
      ========================================= */}
      <section className="pb-24 relative z-10 w-full px-6">
        <div className="max-w-[650px] mx-auto space-y-8 flex flex-col items-center">
          
          {/* TIER 1: Core Engine */}
          <div className="pricing-card-group group w-full flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-slate-800/80 bg-[#040810]/40 backdrop-blur-sm transition-all duration-300 hover:bg-[#070d1a]/80 hover:border-slate-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            {/* Left Section: Icon & Header info */}
            <div className="w-full md:w-[45%] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 group-hover:text-slate-350 transition-all icon-pulse-container shrink-0">
                  <Terminal size={18} />
                </div>
                <h3 className="font-orbitron text-xl font-bold text-white tracking-wide">
                  Core Engine
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Essential multi-cluster visibility and manual triage tools.
                </p>
              </div>
            </div>

            {/* Middle Section: Brief Features */}
            <div className="w-full md:w-[35%] flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6 space-y-2">
              <span className="text-[10px] font-mono text-[#00f2fe]/60 tracking-wider">FEATURES INCLUDED</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>3 Clusters Max</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>Live Topology Mapping</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>Manual Alert Triage</span>
                </li>
              </ul>
            </div>

            {/* Right Section: Price & Action */}
            <div className="w-full md:w-[20%] flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6 shrink-0 space-y-4">
              <div className="text-center md:text-right">
                <div className="font-orbitron text-3xl font-extrabold text-white">$0</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Free Forever</div>
              </div>
              <a 
                href="#waitlist"
                className="w-full text-center px-4 py-2.5 border border-slate-700 hover:border-white bg-slate-900/40 hover:bg-white/5 text-slate-300 hover:text-white rounded-lg font-orbitron text-[10px] font-bold tracking-widest transition-all uppercase"
              >
                Initialize Free Instance
              </a>
            </div>
          </div>

          {/* TIER 2: Cortex AI (Recommended Highlighted) */}
          <div className="pricing-card-group group w-full flex flex-col md:flex-row gap-6 p-6 rounded-2xl border-2 border-[#00f2fe]/60 bg-[#071324]/40 backdrop-blur-sm transition-all duration-300 hover:bg-[#0b1b30]/65 shadow-[0_0_24px_rgba(0,242,254,0.15)] relative">
            
            {/* Recommended Badge */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 bg-[#00f2fe] text-[#070d1a] font-orbitron font-extrabold text-[9px] tracking-widest rounded-full shadow-[0_0_12px_rgba(0,242,254,0.4)]">
              RECOMMENDED
            </div>

            {/* Left Section: Icon & Header info */}
            <div className="w-full md:w-[45%] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg border border-[#00f2fe]/40 bg-[#00f2fe]/10 flex items-center justify-center text-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.2)] icon-pulse-container shrink-0">
                  <Bot size={18} />
                </div>
                <h3 className="font-orbitron text-xl font-bold text-white tracking-wide flex items-center gap-2">
                  Cortex AI
                  <Sparkles size={14} className="text-[#00f2fe] animate-pulse" />
                </h3>
                <p className="text-slate-350 text-xs leading-relaxed">
                  Full autonomous self-healing loops, proactive drift correction, and slack alert routing.
                </p>
              </div>
            </div>

            {/* Middle Section: Brief Features */}
            <div className="w-full md:w-[35%] flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6 space-y-2">
              <span className="text-[10px] font-mono text-[#00f2fe] tracking-wider font-semibold">CORTEX AI FEATURES</span>
              <ul className="space-y-1.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>Unlimited Clusters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>1-Click AI Remediation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>Slack & Webhook Alerts</span>
                </li>
              </ul>
            </div>

            {/* Right Section: Price & Action */}
            <div className="w-full md:w-[20%] flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6 shrink-0 space-y-4">
              <div className="text-center md:text-right">
                <div className="font-orbitron text-3xl font-extrabold text-[#00f2fe] drop-shadow-[0_0_10px_rgba(0,242,254,0.4)]">$99</div>
                <div className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">/mo per cluster</div>
              </div>
              <a 
                href="#waitlist"
                className="w-full text-center px-4 py-2.5 bg-[#00f2fe] hover:bg-[#00f2fe]/90 text-[#070d1a] font-bold rounded-lg font-orbitron text-[10px] tracking-widest transition-all shadow-[0_0_12px_rgba(0,242,254,0.25)] hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] uppercase"
              >
                Activate Free Trial
              </a>
            </div>
          </div>

          {/* TIER 3: Quantum Grid */}
          <div className="pricing-card-group group w-full flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-slate-800/80 bg-[#040810]/40 backdrop-blur-sm transition-all duration-300 hover:bg-[#070d1a]/80 hover:border-slate-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            {/* Left Section: Icon & Header info */}
            <div className="w-full md:w-[45%] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 group-hover:text-slate-350 transition-all icon-pulse-container shrink-0">
                  <Layers size={18} />
                </div>
                <h3 className="font-orbitron text-xl font-bold text-white tracking-wide">
                  Quantum Grid
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Multi-tenant telemetry, advanced compliance guardrails, and custom playbooks across thousands of nodes.
                </p>
              </div>
            </div>

            {/* Middle Section: Brief Features */}
            <div className="w-full md:w-[35%] flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6 space-y-2">
              <span className="text-[10px] font-mono text-[#00f2fe]/60 tracking-wider">ENTERPRISE SCALE</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>Custom AI Playbooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>Multi-Tenant Telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={12} className="text-[#00f2fe] shrink-0" />
                  <span>24/7 Dedicated Support</span>
                </li>
              </ul>
            </div>

            {/* Right Section: Price & Action */}
            <div className="w-full md:w-[20%] flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6 shrink-0 space-y-4">
              <div className="text-center md:text-right">
                <div className="font-orbitron text-2xl font-extrabold text-white uppercase tracking-tight">Custom</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Enterprise</div>
              </div>
              <a 
                href="#waitlist"
                className="w-full text-center px-4 py-2.5 border border-slate-700 hover:border-[#00f2fe] bg-transparent hover:bg-[#00f2fe]/5 text-slate-300 hover:text-[#00f2fe] rounded-lg font-orbitron text-[10px] font-bold tracking-widest transition-all uppercase"
              >
                Request Control Plane Access
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          SECTION 3: COMPARISON MATRIX
      ========================================= */}
      <section className="py-20 relative z-10 w-full border-t border-slate-900 bg-[#040812]/20">
        <div className="max-w-5xl mx-auto px-8">
          
          <div className="text-center mb-16">
            <p className="text-xs font-mono tracking-[0.3em] text-[#00f2fe] uppercase mb-3">DEEP COMPARISON</p>
            <h2 className="font-orbitron text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Feature Matrix
            </h2>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-[#040810]/60 backdrop-blur-md">
            <table className="w-full border-collapse text-left text-sm font-sans min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 bg-[#070d1a]/80 font-orbitron text-xs tracking-wider text-[#00f2fe]">
                  <th className="p-5 font-bold">FEATURES</th>
                  <th className="p-5 text-center font-bold">CORE ENGINE</th>
                  <th className="p-5 text-center font-bold">CORTEX AI</th>
                  <th className="p-5 text-center font-bold">QUANTUM GRID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                
                {/* CATEGORY: MONITORING */}
                <tr className="bg-slate-900/40 font-orbitron text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                  <td colSpan={4} className="px-5 py-3">
                    Monitoring & Visibility
                  </td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Live multi-cluster topology mapping</td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Namespace dependency visualizer</td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Container metric ingestion limits</td>
                  <td className="p-5 text-center text-xs text-slate-400 font-mono">10 GB/day</td>
                  <td className="p-5 text-center text-xs text-[#00f2fe] font-mono font-bold">500 GB/day</td>
                  <td className="p-5 text-center text-xs text-slate-200 font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Custom dashboard layout slots</td>
                  <td className="p-5 text-center text-xs text-slate-400 font-mono">2 Layouts</td>
                  <td className="p-5 text-center text-xs text-[#00f2fe] font-mono font-bold">Unlimited</td>
                  <td className="p-5 text-center text-xs text-slate-200 font-mono">Unlimited + Multi-tenant</td>
                </tr>

                {/* CATEGORY: AI REMEDIATION */}
                <tr className="bg-slate-900/40 font-orbitron text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                  <td colSpan={4} className="px-5 py-3">
                    AI Remediation & Self-Healing
                  </td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Autonomous log diagnostic parser</td>
                  <td className="p-5 text-center text-xs text-slate-500 font-mono">Manual Trigger Only</td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">OOMKilled limits auto-tuning</td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Manifest patch synthesis engine</td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Custom playbook automation triggers</td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>

                {/* CATEGORY: SECURITY & COMPLIANCE */}
                <tr className="bg-slate-900/40 font-orbitron text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                  <td colSpan={4} className="px-5 py-3">
                    Security & Compliance Guardrails
                  </td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Image registry CVE vulnerability scans</td>
                  <td className="p-5 text-center text-xs text-slate-400 font-mono">Daily Scans</td>
                  <td className="p-5 text-center text-xs text-[#00f2fe] font-mono font-bold">Continuous</td>
                  <td className="p-5 text-center text-xs text-slate-200 font-mono">Continuous + Custom Policies</td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">NetworkPolicy isolation injection</td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Active runtime memory threat mitigation</td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-5 text-slate-300">Multi-tenant telemetry isolation</td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Minus size={16} className="text-slate-600 mx-auto" /></td>
                  <td className="p-5 text-center"><Check size={16} className="text-[#00f2fe] mx-auto" /></td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* =========================================
          SECTION 4: ACTIONABLE FOOTER
      ========================================= */}
      <section className="py-24 relative z-10 w-full border-t border-slate-900 bg-[#040812]/30">
        <div className="max-w-4xl mx-auto px-8 text-center relative">
          
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-[#00f2fe]/5 blur-[80px] pointer-events-none" />

          <p className="text-xs font-mono tracking-[0.3em] text-[#00f2fe] uppercase mb-4 font-bold">READY TO SCALE?</p>
          <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold text-white mb-6">
            CHOOSE THE CAPACITY <br />
            <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.55)]">THAT MATCHES YOUR FLEET</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
            Initialize our free light engine instantly or scale to Cortex AI for full self-healing operational automation.
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

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-[#020617]/80 backdrop-blur-sm px-8 py-10 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 Kuboptix Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
            <span className="text-[#00f2fe] font-bold">KUBOPTIX PLATFORM ENGINE v2.0</span>
          </div>
        </div>
      </footer>

      {/* KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes pulseNeon {
          0%, 100% { 
            box-shadow: 0 0 4px rgba(0, 242, 254, 0.25); 
            border-color: rgba(0, 242, 254, 0.4); 
          }
          50% { 
            box-shadow: 0 0 16px rgba(0, 242, 254, 0.7); 
            border-color: rgba(0, 242, 254, 0.95); 
          }
        }
        .pricing-card-group:hover .icon-pulse-container {
          animation: pulseNeon 1.5s infinite ease-in-out;
          color: #00f2fe;
          background-color: rgba(0, 242, 254, 0.08);
        }
      `}</style>

    </main>
  );
}
