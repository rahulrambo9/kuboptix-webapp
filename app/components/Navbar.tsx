"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Terminal, ChevronDown, BookOpen, FileText,
  Megaphone, Tag, GitBranch, LifeBuoy,
  Cloud, Server, Database, HardDrive,
  Bot, ShieldCheck, LayoutDashboard,
  Zap, Building2, Rocket, Code2,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Products",
    dropdown: {
      heading: "Platform capabilities built for production Kubernetes.",
      columns: [
        {
          title: "CORE MODULES",
          links: [
            { icon: <LayoutDashboard size={18} />, label: "Cluster Dashboard",   desc: "Real-time pod & node visualization" },
            { icon: <Bot size={18} />,             label: "Jarvis AI Engine",    desc: "Autonomous incident remediation"   },
            { icon: <ShieldCheck size={18} />,     label: "Security Guardrails", desc: "DevSecOps shift-left scanning"     },
          ],
        },
        {
          title: "INTEGRATIONS",
          links: [
            { icon: <Cloud size={18} />,     label: "AWS EKS",     desc: "Elastic Kubernetes Service" },
            { icon: <Database size={18} />,  label: "Azure AKS",   desc: "Azure Kubernetes Service"   },
            { icon: <Server size={18} />,    label: "GCP GKE",     desc: "Google Kubernetes Engine"   },
            { icon: <HardDrive size={18} />, label: "On-Premises", desc: "Bare metal / private cloud"  },
          ],
        },
      ],
    },
  },
  {
    label: "Use Cases",
    dropdown: {
      heading: "How teams use Kuboptix to run safer, faster clusters.",
      columns: [
        {
          title: "BY TEAM",
          links: [
            { icon: <Code2 size={18} />,       label: "Platform Engineering", desc: "Cluster lifecycle automation"  },
            { icon: <ShieldCheck size={18} />, label: "DevSecOps",            desc: "Runtime security & compliance" },
            { icon: <Rocket size={18} />,      label: "SRE & Ops",            desc: "Incident triage & runbooks"    },
          ],
        },
        {
          title: "BY SCALE",
          links: [
            { icon: <Building2 size={18} />,       label: "Enterprise", desc: "Multi-tenant observability" },
            { icon: <LayoutDashboard size={18} />, label: "Startup",    desc: "Single-cluster quick start" },
          ],
        },
      ],
    },
  },
  { label: "Pricing", href: "#waitlist" },
  { label: "Blog",    href: "#waitlist" },
  {
    label: "Resources",
    dropdown: {
      heading: "Everything you need to stay up-to-date and get help.",
      columns: [
        {
          title: "LEARN",
          links: [
            { icon: <BookOpen size={18} />,  label: "Documentation", desc: "Guides, API refs & tutorials" },
            { icon: <FileText size={18} />,  label: "Changelog",     desc: "What's new in each release"   },
            { icon: <GitBranch size={18} />, label: "Releases",      desc: "Version history & roadmap"    },
          ],
        },
        {
          title: "CONNECT",
          links: [
            { icon: <LifeBuoy size={18} />,  label: "Support",   desc: "Contact the Kuboptix team"  },
            { icon: <Megaphone size={18} />, label: "Press",     desc: "Media kit & brand assets"   },
            { icon: <Tag size={18} />,       label: "Community", desc: "Forum & GitHub discussions"  },
          ],
        },
      ],
    },
  },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (label: string) =>
    setOpenMenu((prev) => (prev === label ? null : label));

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#020617]/95 backdrop-blur-lg border-b border-slate-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-[#020617]/80 backdrop-blur-sm border-b border-slate-800/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-[68px] flex items-center justify-between">

        {/* Logo */}
        <Link 
          href="/" 
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-9 h-9 border-2 border-[#00f0ff]/70 rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(0,240,255,0.35)]">
            <Terminal size={17} className="text-[#00f0ff]" />
          </div>
          <span className="font-orbitron font-bold text-lg tracking-widest text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">
            KUBOPTIX
          </span>
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isOpen = openMenu === item.label;
            if (item.href) {
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="flex items-center px-5 py-2 text-[15px] font-sans font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                </li>
              );
            }
            return (
              <li key={item.label} className="relative">
                <button
                  onClick={() => toggle(item.label)}
                  className={`flex items-center gap-1.5 px-5 py-2 text-[15px] font-sans font-medium rounded-lg transition-all ${
                    isOpen
                      ? "text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#00f0ff]" : "text-slate-500"}`}
                  />
                </button>

                {isOpen && item.dropdown && (
                  <DropdownPanel
                    heading={item.dropdown.heading}
                    columns={item.dropdown.columns}
                    onClose={() => setOpenMenu(null)}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-2 px-6 py-2.5 border-2 border-[#00f0ff]/60 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded-lg font-orbitron text-sm font-bold tracking-widest transition-all shadow-[0_0_14px_rgba(0,240,255,0.2)] hover:shadow-[0_0_24px_rgba(0,240,255,0.45)]"
        >
          <Zap size={14} />
          LAUNCH APP
        </Link>
      </div>
    </nav>
  );
}

// ─── Dropdown panel ───────────────────────────────────────────────────────────

type DropdownColumn = {
  title: string;
  links: { icon: React.ReactNode; label: string; desc: string }[];
};

function DropdownPanel({
  heading,
  columns,
  onClose,
}: {
  heading: string;
  columns: DropdownColumn[];
  onClose: () => void;
}) {
  return (
    <div className="absolute top-[calc(100%+10px)] left-0 w-[580px] animate-[ddFadeIn_0.18s_ease-out]">
      <div className="rounded-2xl border border-slate-700/80 bg-[#070d1a] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,240,255,0.08)]">

        {/* Cyan top accent */}
        <div className="h-[2px] w-full rounded-t-2xl bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-60" />

        <div className="p-6">
          {/* Heading */}
          <p className="text-sm font-sans text-slate-400 mb-6 leading-relaxed">
            {heading}
          </p>

          {/* Columns */}
          <div className={`grid gap-8 ${columns.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {columns.map((col) => (
              <div key={col.title}>
                {/* Column label */}
                <p className="text-xs font-orbitron font-bold text-[#00f0ff] tracking-[0.25em] uppercase mb-4 opacity-90">
                  {col.title}
                </p>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={onClose}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#00f0ff]/8 group transition-all text-left"
                      >
                        {/* Icon box */}
                        <div className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-800/60 flex items-center justify-center shrink-0 text-slate-400 group-hover:border-[#00f0ff]/50 group-hover:bg-[#00f0ff]/10 group-hover:text-[#00f0ff] transition-all">
                          {link.icon}
                        </div>
                        {/* Text */}
                        <div>
                          <span className="block text-[15px] font-sans font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight">
                            {link.label}
                          </span>
                          <span className="block text-[13px] font-sans text-slate-500 group-hover:text-slate-400 transition-colors mt-0.5 leading-snug">
                            {link.desc}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div className="border-t border-slate-800 px-6 py-3.5 flex items-center justify-between rounded-b-2xl bg-[#040810]/60">
          <span className="text-[11px] font-orbitron text-slate-600 tracking-widest uppercase">
            Kuboptix Platform Engine
          </span>
          <span className="text-[11px] font-orbitron text-[#00f0ff]/50 tracking-widest">
            v2.0 ENTERPRISE
          </span>
        </div>
      </div>

      <style>{`
        @keyframes ddFadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
