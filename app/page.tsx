"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Terminal, Cloud, Server, Database, HardDrive,
  Wind, Coffee, Braces, Code2, FileCode, Gem,
  Bot, ShieldCheck, LayoutDashboard, ChevronRight,
  Zap, Mail, Sparkles, CheckCircle
} from "lucide-react";

import Navbar from "./components/Navbar";
import InteractiveSphere from "./components/InteractiveSphere";
import VisualProofWidget from "./components/VisualProofWidget";

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
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <Navbar />

      {/* =========================================
          SECTION 1: HERO
      ========================================= */}
      <section className="min-h-screen w-full flex items-center relative z-10 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full max-w-7xl mx-auto px-8">

          {/* Left Column: Heading + Subtitle + CTAs + Visual Proof Widget */}
          <div className="flex flex-col items-start text-left space-y-8">

            {/* Futuristic typography with exact Copywriting Headline */}
            <h1 className="leading-[1.1] tracking-tight">
              <span className="block font-sans font-extrabold text-white"
                style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
                Beautiful Kubernetes Monitoring.
              </span>
              <span
                className="block font-orbitron font-bold text-[#00f2fe] drop-shadow-[0_0_30px_rgba(0,242,254,0.45)]"
                style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
                Effortless AI Remediation.
              </span>
            </h1>

            {/* Subheadline matching copy structure */}
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-[550px] font-sans">
              Give your engineering and security teams absolute clarity over cluster health. Instantly visualize every resource, catch configuration risks automatically, and use built-in AI scanning to fix failing pods and security threats with one click.
            </p>

            {/* CTA Button Hierarchy resolving decision paralysis */}
            <div className="flex flex-row items-center gap-4 flex-wrap">
              <a
                href="#waitlist"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#00f2fe] hover:bg-[#00f2fe]/95 text-[#020617] font-bold rounded-lg font-orbitron text-xs tracking-[0.15em] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_24px_rgba(0,242,254,0.4)] hover:shadow-[0_0_36px_rgba(0,242,254,0.6)] uppercase"
              >
                Book a Demo
              </a>
              <Link
                href="/demo"
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-700 hover:border-[#00f2fe] bg-transparent text-slate-300 hover:text-white rounded-lg font-orbitron text-xs tracking-[0.15em] transition-all hover:bg-[#00f2fe]/5 uppercase"
              >
                <LayoutDashboard size={13} className="text-[#00f2fe]" />
                View Sample Dashboard
              </Link>
            </div>

            {/* Visual Proof Before & After Widget */}
            <div className="w-full pt-4 border-t border-slate-900/60">
              <p className="text-[10px] font-mono text-slate-500 tracking-[0.25em] uppercase mb-3 flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#00f2fe]" /> See it in action: AI remediation demo
              </p>
              <VisualProofWidget />
            </div>

          </div>

          {/* Right Column: Interactive 3D Sphere */}
          <div className="flex flex-col justify-center items-center relative">
            <InteractiveSphere />
          </div>

        </div>
      </section>

      {/* =========================================
          SECTION 1.5: FEATURES SECTION
      ========================================= */}
      <section className="py-24 w-full relative z-10 border-y border-slate-900 bg-[#040812]/50 backdrop-blur-sm">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#00f2fe]/2 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-8 w-full">
          {/* Header */}
          <div className="text-center md:text-left mb-16 max-w-3xl">
            <p className="text-xs font-mono tracking-[0.3em] text-[#00f2fe] uppercase mb-3">AUTONOMOUS ADVANTAGE</p>
            <h2 className="font-orbitron text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              PRODUCT <span className="text-[#00f2fe] drop-shadow-[0_0_15px_rgba(0,242,254,0.3)]">CAPABILITIES</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Designed to eliminate developer toil and solve alert fatigue. Kuboptix handles security incidents, 
              deployment drift, and resource inefficiencies automatically so you can focus on shipping code.
            </p>
          </div>

          {/* 3 Expanded Copywriting Hooks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Bot className="text-[#00f2fe]" size={24} />}
              title="From Alert to Repaired in a Single Click"
              description="No more digging through endless log lines. When a pod fails or an active security threat is detected, our AI scans the root cause and provides a validated, one-click remediation script."
              detailText="Drastically cuts MTTR and eliminates manual log parsing."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="text-emerald-400" size={24} />}
              title="Security & Operations, Perfectly Visualized"
              description="Give your customers a stunning, intuitive dashboard that translates chaotic Kubernetes YAML files into an elegant, interactive map of their actual cloud health."
              detailText="Instantly visualizes complex namespace dependencies."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-purple-400" size={24} />}
              title="Auto-Remediation You Can Trust"
              description="Set your guardrails. Let Kuboptix fix known configuration drifts and minor runtime incidents autonomously, or prompt your team for quick approval before executing critical updates."
              detailText="Balance automated scaling with safe DevOps guardrails."
            />
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: CLOUD PROVIDERS
      ========================================= */}
      <section className="py-24 flex flex-col items-center justify-center relative z-10 px-8">
        <div className="text-center mb-4">
          <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-3">MULTI-CLOUD COMPATIBILITY</p>
          <h2 className="font-orbitron text-3xl md:text-5xl text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] uppercase">
            Choose Your <span className="text-[#00f2fe]">Provider</span>
          </h2>
        </div>
        <p className="text-slate-500 text-sm font-mono tracking-wider mb-16 text-center">
          Native integration with all major managed Kubernetes services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          <Link href="/login" className="w-full">
            <ProviderCard title="AWS EKS" color="#FF9900" icon={<Cloud size={36} />} desc="Elastic Kubernetes Service" />
          </Link>
          <Link href="/login" className="w-full">
            <ProviderCard title="AZURE AKS" color="#007FFF" icon={<Database size={36} />} desc="Azure Kubernetes Service" />
          </Link>
          <Link href="/login" className="w-full">
            <ProviderCard title="GCP GKE" color="#4285F4" icon={<Server size={36} />} desc="Google Kubernetes Engine" />
          </Link>
          <Link href="/login" className="w-full">
            <ProviderCard title="ON-PREM" color="#10b981" icon={<HardDrive size={36} />} desc="Bare Metal / Private Cloud" />
          </Link>
        </div>
      </section>

      {/* =========================================
          SECTION 3: INTEGRATIONS
      ========================================= */}
      <section className="py-24 flex flex-col items-center justify-center relative z-10 px-8 bg-[#040812]/20 border-t border-slate-900">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-3">TELEMETRY & OBSERVABILITY</p>
          <h2 className="font-orbitron text-3xl md:text-5xl font-bold mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(0,242,254,0.25)]">
            SYSTEM <span className="text-[#00f2fe]">INTEGRATIONS</span>
          </h2>
          <p className="text-base text-slate-400 border-l-2 border-[#00f2fe]/50 pl-4 max-w-3xl leading-relaxed">
            Initialize connection with 780+ supported modules.
            Enable real-time telemetry for application logs and infrastructure metrics.
          </p>

          <button className="mt-8 px-8 py-3.5 border border-[#00f2fe] bg-[#00f2fe]/5 hover:bg-[#00f2fe]/10 text-[#00f2fe] rounded font-orbitron tracking-widest text-xs transition-all shadow-[0_0_10px_rgba(0,242,254,0.1)] hover:shadow-[0_0_20px_rgba(0,242,254,0.25)] mb-16">
            VIEW ALL MODULES
          </button>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
            {integrationsData.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => setActiveIntegration(item.id)}
                className={`flex flex-col items-center justify-center h-28 rounded-lg border backdrop-blur-md transition-all duration-300
                  ${activeIntegration === item.id
                    ? "bg-[#00f2fe]/15 border-[#00f2fe] text-white scale-105 shadow-[0_0_15px_rgba(0,242,254,0.2)] z-10"
                    : "bg-[#070d1a]/40 border-slate-800 text-slate-400 hover:border-[#00f2fe]/50 hover:text-white"
                  }`}
              >
                <div
                  className="mb-2 transition-colors"
                  style={{ color: activeIntegration === item.id ? item.color : undefined }}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] font-orbitron tracking-widest font-bold">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Description Box */}
          <div className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-xl border border-[#00f2fe]/20 bg-[#070d1a]/80 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(0,242,254,0.1)]">
            <div className="p-4 bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] rounded-lg shadow-[0_0_15px_rgba(0,242,254,0.15)] shrink-0">
              {integrationsData.find((i) => i.id === activeIntegration)?.icon}
            </div>
            <div>
              <h3 className="font-orbitron text-xl font-bold mb-1 text-white tracking-tight">
                {integrationsData.find((i) => i.id === activeIntegration)?.label}{" "}
                <span className="text-[#00f2fe] text-xs align-middle tracking-widest ml-2">module_active</span>
              </h3>
              <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
                Analyzing request latency and throughput. Optimize your{" "}
                <span className="text-[#00f2fe] font-bold">
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
      <section className="relative z-10 px-8 py-24 border-t border-slate-900">
        <div className="w-full max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="mb-16">
            <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-3">PRODUCT ROADMAP</p>
            <h2 className="font-orbitron text-3xl md:text-5xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(0,242,254,0.2)] mb-4">
              COMING SOON TO{" "}
              <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.5)]">
                PLATFORM ENGINE
              </span>
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl border-l-2 border-[#00f2fe]/40 pl-4 leading-relaxed">
              Next-generation capabilities currently in active development.
              Enterprise-grade features engineered for production-scale clusters.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: AI Remediation */}
            <RoadmapCard
              icon={<Bot size={24} />}
              tag="CO-PILOT ENGINE"
              title="AI-Driven Incident Remediation"
              subtitle="Kuboptix Jarvis Core"
              description="Auto-pilot troubleshooting loops that detect pod crash loops, analyze logs via integrated LLMs, and safely apply automated manifest adjustments — all without human intervention."
              accentColor="#00f2fe"
              status="IN DEVELOPMENT"
            />

            {/* Card 2: DevSecOps */}
            <RoadmapCard
              icon={<ShieldCheck size={24} />}
              tag="SECURITY MODULE"
              title="Advanced DevSecOps Security Guardrails"
              subtitle="Shift-Left Security Engine"
              description="Real-time shifting-left image scanning, runtime vulnerability broker tracing, and automated network policy isolation at the cluster perimeter. Zero-trust by default."
              accentColor="#3b82f6"
              status="BETA Q3 2026"
            />

            {/* Card 3: Multi-Tenant */}
            <RoadmapCard
              icon={<LayoutDashboard size={24} />}
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
      <section id="waitlist" className="relative z-10 px-8 py-24 border-t border-slate-900 bg-[#040812]/30">
        {/* Glow backdrop */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#00f2fe]/5 blur-[80px]" />
        </div>

        <div className="w-full max-w-4xl mx-auto relative">
          {/* Border panel — mirrors the login card geometry */}
          <div className="relative rounded-xl border border-[#00f2fe]/25 bg-[#070d1a]/85 backdrop-blur-md p-10 md:p-12 shadow-[0_0_60px_-15px_rgba(0,242,254,0.2)]">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-[#00f2fe] rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-[#00f2fe] rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-[#00f2fe] rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-[#00f2fe] rounded-tr-xl" />

            <div className="text-center mb-10">
              <p className="text-xs font-mono tracking-[0.3em] text-slate-500 uppercase mb-4">EARLY ACCESS PROGRAM</p>
              <h2 className="font-orbitron text-2xl md:text-4xl font-bold tracking-tighter text-white mb-4">
                READY FOR AUTONOMOUS<br />
                <span className="text-[#00f2fe] drop-shadow-[0_0_25px_rgba(0,242,254,0.6)]">
                  KUBERNETES OPERATIONS?
                </span>
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                Join our exclusive pre-launch beta waitlist. Secure early developer access 
                and priority infrastructure credits.
              </p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-12 h-12 rounded-full border border-[#10b981] bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle size={22} />
                </div>
                <p className="font-orbitron text-[#10b981] tracking-widest text-sm drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] uppercase font-bold">
                  Access Request Received
                </p>
                <p className="text-slate-500 text-xs font-mono">We&apos;ll be in touch at {email}</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f2fe]/60">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your corporate email..."
                    className="w-full bg-[#030712] border border-slate-800 rounded text-slate-300 pl-10 pr-4 py-3 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] focus:shadow-[0_0_12px_rgba(0,242,254,0.2)] transition-all font-mono text-sm placeholder-slate-600"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3 border border-[#00f2fe] bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] rounded font-orbitron text-xs font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(0,242,254,0.2)] hover:shadow-[0_0_28px_rgba(0,242,254,0.45)] whitespace-nowrap uppercase"
                >
                  Join Beta Waitlist
                </button>
              </form>
            )}

            <p className="text-center text-slate-600 text-[10px] font-mono mt-8 tracking-wider">
              No credit card required · Enterprise SLA available · SOC 2 Type II in progress
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 6: FOOTER
      ========================================= */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#020617]/90 backdrop-blur-sm px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#00f2fe]/50 rounded flex items-center justify-center shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                <Terminal size={15} className="text-[#00f2fe]" />
              </div>
              <div>
                <p className="font-orbitron text-sm font-bold text-[#00f2fe] tracking-widest drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]">
                  KUBOPTIX
                </p>
                <p className="text-[9px] text-slate-600 font-mono tracking-[0.25em] uppercase">
                  Autonomous Kubernetes Platform
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex items-center gap-6 text-xs font-mono text-slate-500 tracking-widest">
              <Link href="/login" className="hover:text-[#00f2fe] transition-colors uppercase">Dashboard</Link>
              <a href="#waitlist" className="hover:text-[#00f2fe] transition-colors uppercase">Early Access</a>
              <a href="mailto:admin@kuboptix.com" className="hover:text-[#00f2fe] transition-colors uppercase">Support</a>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
              <Mail size={12} className="text-[#00f2fe]/50" />
              <a href="mailto:admin@kuboptix.com" className="hover:text-[#00f2fe] transition-colors">
                admin@kuboptix.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-2">
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
      className="group relative h-56 rounded-xl bg-[#070d1a]/60 border border-slate-800/80 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full backdrop-blur-sm hover:border-slate-700"
      style={
        { "--shadow-color": color } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />
      <div style={{ color: color }} className="transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="font-orbitron text-lg font-bold text-white tracking-tighter">{title}</h3>
      <p className="text-slate-500 text-[10px] tracking-widest uppercase font-mono">{desc}</p>
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
      className="relative flex flex-col rounded-xl bg-[#070d1a]/70 border backdrop-blur-sm p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
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
      <p className="text-[9px] font-mono tracking-[0.25em] mb-4 uppercase" style={{ color: accentColor }}>
        {tag}
      </p>

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg border flex items-center justify-center mb-4 shadow-lg"
        style={{
          borderColor: `${accentColor}40`,
          backgroundColor: `${accentColor}10`,
          color: accentColor,
          boxShadow: `0 0 15px -4px ${accentColor}30`,
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
          className="text-[9px] font-mono tracking-[0.2em] uppercase"
          style={{ color: accentColor }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  detailText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  detailText?: string;
}) {
  return (
    <div className="group relative rounded-xl border border-slate-800/60 bg-[#070d1a]/50 backdrop-blur-md p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#00f2fe]/40 hover:bg-[#070d1a]/85 shadow-[0_4px_25px_rgba(0,0,0,0.45)] flex flex-col justify-between min-h-[340px]">
      <div>
        {/* Glow border background */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f2fe]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Icon Circle */}
        <div className="w-12 h-12 rounded-lg border border-slate-800/80 bg-slate-900/60 flex items-center justify-center mb-6 shrink-0 group-hover:border-[#00f2fe]/30 group-hover:bg-[#00f2fe]/5 transition-all duration-300">
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-orbitron text-lg font-bold text-white tracking-tight mb-3 group-hover:text-[#00f2fe] transition-colors duration-300 leading-snug">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {detailText && (
        <div className="mt-6 pt-4 border-t border-slate-800/40 text-xs font-mono text-slate-500 group-hover:text-[#00f2fe]/80 transition-colors flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-[#00f2fe]/60 group-hover:bg-[#00f2fe]" />
          {detailText}
        </div>
      )}

      {/* Decorative Corner Bracket */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-slate-800/60 group-hover:border-[#00f2fe]/30 transition-colors" />
    </div>
  );
}

// ==========================================
// DATA
// ==========================================
const integrationsData = [
  { id: "apache",  label: "APACHE",  icon: <Wind size={24} />,     color: "#D22128" },
  { id: "java",    label: "JAVA",    icon: <Coffee size={24} />,   color: "#f89820" },
  { id: "mysql",   label: "MYSQL",   icon: <Database size={24} />, color: "#4479A1" },
  { id: "dotnet",  label: ".NET",    icon: <Braces size={24} />,   color: "#7B4FBF" },
  { id: "nodejs",  label: "NODE.JS", icon: <Code2 size={24} />,    color: "#339933" },
  { id: "php",     label: "PHP",     icon: <FileCode size={24} />, color: "#777BB4" },
  { id: "python",  label: "PYTHON",  icon: <Terminal size={24} />, color: "#3776AB" },
  { id: "ruby",    label: "RUBY",    icon: <Gem size={24} />,      color: "#CC342D" },
];
