"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Terminal, Cloud, Server, Database, HardDrive,
  Code, Feather, Box, Globe, Cpu, Layers,
  Bot, ShieldCheck, LayoutDashboard, ChevronRight,
  Zap, Mail,
} from "lucide-react";

export default function HomePage() {
  const [activeIntegration, setActiveIntegration] = useState("nodejs");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <main className="w-full relative flex flex-col font-sans text-white bg-transparent">

      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />


      {/* =========================================
          SECTION 1: HERO
      ========================================= */}
      <section className="min-h-screen flex flex-col relative z-10">
        <header className="absolute top-0 right-0 p-6">
          <Link
            href="/login"
            className="group flex items-center gap-2 px-6 py-2 border border-[#00f0ff]/50 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded font-orbitron text-sm tracking-widest transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <Terminal size={16} />
            <span>LOGIN / REGISTER</span>
          </Link>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 text-[#00f0ff] text-xs font-mono tracking-widest mb-8 shadow-[0_0_12px_rgba(0,240,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            AUTONOMOUS KUBERNETES PLATFORM · v2.0 ENTERPRISE
          </div>

          <h1 className="font-orbitron text-4xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-[0_0_24px_rgba(0,240,255,0.55)] mb-2">
            WELCOME TO
          </h1>
          <h1 className="font-orbitron text-5xl md:text-8xl font-bold tracking-tighter text-[#00f0ff] drop-shadow-[0_0_30px_rgba(0,240,255,0.75)] mb-8">
            KUBOPTIX
          </h1>

          <p className="max-w-2xl text-slate-400 text-base md:text-lg leading-relaxed tracking-wide mb-10 border-l-2 border-[#00f0ff] pl-6 text-left bg-black/30 p-5 rounded-r-lg backdrop-blur-sm">
            Advanced cluster visualization and autonomous management interface.
            Monitor pod health, optimize resource allocation, and detect anomalies
            in real-time across distributed containerized fleets.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-3 border border-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded font-orbitron text-sm tracking-widest transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_28px_rgba(0,240,255,0.5)]"
            >
              <Zap size={16} />
              LAUNCH DASHBOARD
            </Link>
            <a
              href="#waitlist"
              className="flex items-center gap-2 px-8 py-3 border border-slate-700 bg-slate-900/50 hover:border-slate-500 text-slate-300 hover:text-white rounded font-orbitron text-sm tracking-widest transition-all"
            >
              REQUEST EARLY ACCESS
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="animate-bounce text-slate-500 text-xs tracking-widest font-mono">
            SCROLL TO EXPLORE ↓
          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 2: CLOUD PROVIDERS
      ========================================= */}
      <section className="min-h-screen flex flex-col items-center justify-center relative z-10 p-10">
        <div className="text-center mb-4">
          <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-3">MULTI-CLOUD COMPATIBILITY</p>
          <h2 className="font-orbitron text-3xl md:text-5xl text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            CHOOSE YOUR <span className="text-[#00f0ff]">PROVIDER</span>
          </h2>
        </div>
        <p className="text-slate-500 text-sm font-mono tracking-wider mb-16 text-center">
          Native integration with all major managed Kubernetes services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          <Link href="/login" className="w-full">
            <ProviderCard title="AWS EKS" color="#FF9900" icon={<Cloud size={40} />} desc="Elastic Kubernetes Service" />
          </Link>
          <Link href="/login" className="w-full">
            <ProviderCard title="AZURE AKS" color="#007FFF" icon={<Database size={40} />} desc="Azure Kubernetes Service" />
          </Link>
          <Link href="/login" className="w-full">
            <ProviderCard title="GCP GKE" color="#4285F4" icon={<Server size={40} />} desc="Google Kubernetes Engine" />
          </Link>
          <Link href="/login" className="w-full">
            <ProviderCard title="ON-PREM" color="#10b981" icon={<HardDrive size={40} />} desc="Bare Metal / Private Cloud" />
          </Link>
        </div>
      </section>


      {/* =========================================
          SECTION 3: INTEGRATIONS
      ========================================= */}
      <section className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 py-20">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-3">TELEMETRY & OBSERVABILITY</p>
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            SYSTEM <span className="text-[#00f0ff]">INTEGRATIONS</span>
          </h2>
          <p className="text-base md:text-lg mb-10 max-w-3xl text-slate-400 border-l-2 border-[#00f0ff]/50 pl-4">
            Initialize connection with 780+ supported modules.
            Enable real-time telemetry for application logs and infrastructure metrics.
          </p>

          <button className="px-8 py-3 border border-[#00f0ff] bg-[#00f0ff]/5 hover:bg-[#00f0ff]/10 text-[#00f0ff] rounded font-orbitron tracking-widest text-sm transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-20">
            VIEW ALL MODULES
          </button>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-16">
            {integrationsData.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => setActiveIntegration(item.id)}
                className={`flex flex-col items-center justify-center h-32 rounded-lg border backdrop-blur-md transition-all duration-300
                  ${activeIntegration === item.id
                    ? "bg-[#00f0ff]/20 border-[#00f0ff] text-white scale-110 shadow-[0_0_20px_rgba(0,240,255,0.3)] z-10"
                    : "bg-[#0a0f1c]/40 border-slate-700 text-slate-400 hover:border-[#00f0ff]/50 hover:text-white"
                  }`}
              >
                <div className={`mb-2 transition-colors ${activeIntegration === item.id ? "text-[#00f0ff]" : ""}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-orbitron tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Description Box */}
          <div className="flex flex-col md:flex-row items-start gap-8 min-h-[150px] p-8 rounded-xl border border-[#00f0ff]/20 bg-[#0a0f1c]/60 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(0,240,255,0.1)]">
            <div className="p-4 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              {integrationsData.find((i) => i.id === activeIntegration)?.icon}
            </div>
            <div>
              <h3 className="font-orbitron text-2xl font-bold mb-2 text-white tracking-tight">
                {integrationsData.find((i) => i.id === activeIntegration)?.label}{" "}
                <span className="text-[#00f0ff] text-sm align-middle tracking-widest ml-2">module_active</span>
              </h3>
              <p className="text-base text-slate-300 max-w-4xl leading-relaxed">
                Analyzing request latency and throughput. Optimize your{" "}
                <span className="text-[#00f0ff] font-bold">
                  {integrationsData.find((i) => i.id === activeIntegration)?.label}
                </span>{" "}
                runtime performance with real-time metric correlation and anomaly flagging.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 4: ENTERPRISE ROADMAP
      ========================================= */}
      <section className="relative z-10 px-6 py-28">
        <div className="w-full max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="mb-16">
            <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-3">PRODUCT ROADMAP</p>
            <h2 className="font-orbitron text-4xl md:text-6xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(0,240,255,0.25)] mb-4">
              COMING SOON TO{" "}
              <span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
                PLATFORM ENGINE
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl border-l-2 border-[#00f0ff]/40 pl-4">
              Next-generation capabilities currently in active development.
              Enterprise-grade features engineered for production-scale clusters.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: AI Remediation */}
            <RoadmapCard
              icon={<Bot size={28} />}
              tag="JARVIS CORE ENGINE"
              title="AI-Driven Incident Remediation"
              subtitle="Kuboptix Jarvis Core"
              description="Auto-pilot troubleshooting loops that detect pod crash loops, analyze logs via integrated LLMs, and safely apply automated manifest adjustments — all without human intervention."
              accentColor="#00f0ff"
              status="IN DEVELOPMENT"
            />

            {/* Card 2: DevSecOps */}
            <RoadmapCard
              icon={<ShieldCheck size={28} />}
              tag="SECURITY MODULE"
              title="Advanced DevSecOps Security Guardrails"
              subtitle="Shift-Left Security Engine"
              description="Real-time shifting-left image scanning, runtime vulnerability broker tracing, and automated network policy isolation at the cluster perimeter. Zero-trust by default."
              accentColor="#3b82f6"
              status="BETA Q3 2026"
            />

            {/* Card 3: Multi-Tenant */}
            <RoadmapCard
              icon={<LayoutDashboard size={28} />}
              tag="OBSERVABILITY LAYER"
              title="Multi-Tenant Observability Engine"
              subtitle="Unified Telemetry Platform"
              description="Snyk, Sysdig, and Contrast Security telemetry integration mapped onto a single, aggregated multi-cluster dashboard with unified alerting metrics and RBAC-scoped views."
              accentColor="#10b981"
              status="ROADMAP 2026"
            />

          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 5: LEAD CAPTURE / WAITLIST
      ========================================= */}
      <section id="waitlist" className="relative z-10 px-6 py-28">
        {/* Glow backdrop */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#00f0ff]/5 blur-[80px]" />
        </div>

        <div className="w-full max-w-4xl mx-auto relative">
          {/* Border panel — mirrors the login card geometry */}
          <div className="relative rounded-xl border border-[#00f0ff]/25 bg-[#0a0f1c]/70 backdrop-blur-md p-12 shadow-[0_0_60px_-15px_rgba(0,240,255,0.2)]">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-[#00f0ff] rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-[#00f0ff] rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-[#00f0ff] rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-[#00f0ff] rounded-br-xl" />

            <div className="text-center mb-10">
              <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-4">EARLY ACCESS PROGRAM</p>
              <h2 className="font-orbitron text-3xl md:text-5xl font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] mb-4">
                Ready for Autonomous<br />
                <span className="text-[#00f0ff] drop-shadow-[0_0_25px_rgba(0,240,255,0.7)]">
                  Kubernetes Operations?
                </span>
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                Join our exclusive pre-launch beta waitlist. Secure early developer access
                and priority infrastructure credits.
              </p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-12 h-12 rounded-full border border-[#10b981] bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="font-orbitron text-[#10b981] tracking-widest text-sm drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                  ACCESS REQUEST RECEIVED
                </p>
                <p className="text-slate-500 text-xs font-mono">We&apos;ll be in touch at {email}</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff]/60">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your corporate email..."
                    className="w-full bg-[#050b14] border border-slate-700 rounded text-slate-300 pl-10 pr-4 py-3 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] focus:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all font-mono text-sm placeholder-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3 border border-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded font-orbitron text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_28px_rgba(0,240,255,0.5)] whitespace-nowrap"
                >
                  <Zap size={14} />
                  JOIN BETA WAITLIST
                </button>
              </form>
            )}

            <p className="text-center text-slate-600 text-xs font-mono mt-6 tracking-wider">
              No credit card required · Enterprise SLA available · SOC 2 Type II in progress
            </p>
          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 6: FOOTER
      ========================================= */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#020617]/80 backdrop-blur-sm px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#00f0ff]/50 rounded flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                <Terminal size={16} className="text-[#00f0ff]" />
              </div>
              <div>
                <p className="font-orbitron text-sm font-bold text-[#00f0ff] tracking-widest drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                  KUBOPTIX
                </p>
                <p className="text-[9px] text-slate-600 font-mono tracking-[0.25em] uppercase">
                  Autonomous Kubernetes Platform
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex items-center gap-6 text-xs font-mono text-slate-500 tracking-widest">
              <Link href="/login" className="hover:text-[#00f0ff] transition-colors uppercase">Dashboard</Link>
              <a href="#waitlist" className="hover:text-[#00f0ff] transition-colors uppercase">Early Access</a>
              <a href="mailto:admin@kuboptix.com" className="hover:text-[#00f0ff] transition-colors uppercase">Support</a>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
              <Mail size={12} className="text-[#00f0ff]/50" />
              <a href="mailto:admin@kuboptix.com" className="hover:text-[#00f0ff] transition-colors">
                admin@kuboptix.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-slate-600 text-xs font-mono tracking-wider">
              © 2026 Kuboptix Inc. All rights reserved.
            </p>
            <p className="text-slate-700 text-[10px] font-mono tracking-widest">
              BUILT FOR ENTERPRISE KUBERNETES OPERATIONS
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}


// ==========================================
// SUB-COMPONENTS
// ==========================================

function ProviderCard({
  title,
  color,
  icon,
  desc,
}: {
  title: string;
  color: string;
  icon: React.ReactNode;
  desc: string;
}) {
  return (
    <button
      className="group relative h-64 rounded-xl bg-[#0a0f1c]/80 border border-slate-800 p-6 flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-2 overflow-hidden w-full backdrop-blur-sm"
      style={
        { "--shadow-color": color } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />
      <div style={{ color: color }}>{icon}</div>
      <h3 className="font-orbitron text-xl font-bold text-white tracking-tighter">{title}</h3>
      <p className="text-slate-500 text-xs tracking-widest uppercase font-mono">{desc}</p>
    </button>
  );
}

function RoadmapCard({
  icon,
  tag,
  title,
  subtitle,
  description,
  accentColor,
  status,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  status: string;
}) {
  return (
    <div
      className="relative flex flex-col rounded-xl bg-[#0a0f1c]/80 border backdrop-blur-sm p-7 overflow-hidden transition-all hover:-translate-y-1 group"
      style={{ borderColor: `${accentColor}25` }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{ backgroundColor: accentColor }}
      />
      {/* Corner bracket bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2"
        style={{ borderColor: accentColor }}
      />

      {/* Tag */}
      <p className="text-[9px] font-mono tracking-[0.3em] mb-4 uppercase" style={{ color: accentColor }}>
        {tag}
      </p>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-lg border flex items-center justify-center mb-5 shadow-lg"
        style={{
          borderColor: `${accentColor}40`,
          backgroundColor: `${accentColor}10`,
          color: accentColor,
          boxShadow: `0 0 18px -4px ${accentColor}40`,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-orbitron text-base font-bold text-white tracking-tight leading-snug mb-1">
        {title}
      </h3>
      <p className="text-xs font-mono mb-4" style={{ color: accentColor }}>
        {subtitle}
      </p>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed flex-1 font-sans">
        {description}
      </p>

      {/* Status badge */}
      <div className="mt-6 flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="text-[9px] font-mono tracking-[0.25em] uppercase"
          style={{ color: accentColor }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// DATA
// ==========================================
const integrationsData = [
  { id: "apache", label: "APACHE", icon: <Feather size={28} /> },
  { id: "java", label: "JAVA", icon: <Box size={28} /> },
  { id: "mysql", label: "MYSQL", icon: <Database size={28} /> },
  { id: "dotnet", label: ".NET", icon: <Layers size={28} /> },
  { id: "nodejs", label: "NODE.JS", icon: <Code size={28} /> },
  { id: "php", label: "PHP", icon: <Globe size={28} /> },
  { id: "python", label: "PYTHON", icon: <Terminal size={28} /> },
  { id: "ruby", label: "RUBY", icon: <Cpu size={28} /> },
];
