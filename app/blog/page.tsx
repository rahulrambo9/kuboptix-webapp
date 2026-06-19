"use client";

import { useState } from "react";
import { Search, Clock, ArrowUpRight, Send, Check } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";

interface Article {
  id: number;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  author: string;
  tagColor: string;
}

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Beyond Liveness Probes: Automating Pod CrashLoops using Contextual AI",
    category: "Engineering",
    readTime: "5 min read",
    date: "Jun 18, 2026",
    summary: "Ditch repetitive alert cycles. Learn how contextual AI diagnostic agents inspect container stderr, synthesize configuration patches, and recover failing pods autonomously.",
    author: "Elena Rostova (Principal Site Reliability Engineer)",
    tagColor: "text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/8"
  },
  {
    id: 2,
    title: "The Shift-Left Mirage: Implementing Continuous Runtime Security Guardrails",
    category: "Security",
    readTime: "7 min read",
    date: "Jun 12, 2026",
    summary: "Registry vulnerability scans are only the first step. Inspect runtime memory execution, trace package usage, and deploy dynamic zero-trust NetworkPolicies automatically.",
    author: "Marcus Vance (Director of DevSecOps)",
    tagColor: "text-purple-400 border-purple-500/30 bg-purple-500/8"
  },
  {
    id: 3,
    title: "Taming Multi-Tenant Topology: Visualizing Code vs Live Cluster State",
    category: "Architecture",
    readTime: "4 min read",
    date: "May 28, 2026",
    summary: "Static architecture diagrams drift instantly. Discover how to build real-time interactive namespace visualizers that stream ingress flows and represent live workloads dynamically.",
    author: "Sanjay Patel (Chief Infrastructure Architect)",
    tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/8"
  }
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail("");
    }
  };

  const filteredArticles = ARTICLES.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full relative flex flex-col font-sans text-white bg-[#070d1a] min-h-screen">
      
      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <Navbar />

      {/* =========================================
          SECTION 1: HERO & SEARCH BAR
      ========================================= */}
      <section className="pt-36 pb-12 relative z-10 w-full text-center px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1 rounded-md border border-[#00f2fe]/25 uppercase font-bold">
            KUBOPTIX PROTOCOLS // READ & INGEST
          </span>
          <h1 className="font-orbitron font-extrabold leading-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}>
            The Kuboptix <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.45)]">Knowledge Base</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Deep technical resources, architecture deep-dives, and guides detailing cloud-native operational autonomy.
          </p>

          {/* Centered High-Tech Search Bar */}
          <div className="max-w-xl mx-auto pt-6 relative">
            <div className="relative rounded-xl border border-slate-800 bg-[#040810]/70 backdrop-blur-md transition-all duration-300 focus-within:border-[#00f2fe]/60 focus-within:shadow-[0_0_18px_rgba(0,242,254,0.15)] flex items-center px-4 py-3.5">
              <Search className="text-slate-500 mr-3 shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search the Kuboptix Knowledge Base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm font-sans placeholder-slate-550 text-white font-medium focus:ring-0"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-mono text-slate-500 hover:text-white px-2 cursor-pointer transition-colors"
                >
                  CLEAR
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-[10px] font-mono text-[#00f2fe]/80 text-left mt-2 pl-2">
                Filtering by query. Found {filteredArticles.length} matching logs...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: ARTICLE GRID
      ========================================= */}
      <section className="py-12 relative z-10 w-full px-8">
        <div className="max-w-7xl mx-auto">
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 border border-slate-900 bg-[#040810]/30 rounded-2xl max-w-xl mx-auto">
              <p className="font-mono text-xs text-slate-500">NO MATCHING KNOWLEDGE PROTOCOLS FOUND</p>
              <p className="text-slate-400 text-sm mt-2">Try searching by category (e.g. "Security") or keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id}
                  className="blog-card group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800/80 bg-[#040810]/40 backdrop-blur-sm transition-all duration-350 hover:bg-[#071324]/50 hover:scale-[1.03] shadow-[0_4px_30px_rgba(0,0,0,0.45)] cursor-pointer"
                >
                  {/* Decorative Border line top */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f2fe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Header metadata */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-mono tracking-[0.2em] font-bold px-2.5 py-1 rounded-md border uppercase ${article.tagColor}`}>
                        {article.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {article.date}
                      </span>
                    </div>

                    <h3 className="font-orbitron text-lg font-bold text-white leading-snug group-hover:text-[#00f2fe] transition-colors duration-300">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans line-clamp-4">
                      {article.summary}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="border-t border-slate-850/60 mt-6 pt-4 flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-400 transition-colors">
                      <Clock size={12} />
                      <span>{article.readTime}</span>
                    </div>
                    <span className="text-slate-500 group-hover:text-[#00f2fe] flex items-center gap-1 transition-colors">
                      READ PROTOCOL 
                      <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* Author tooltip (visible in card footer) */}
                  <div className="mt-3 text-[10px] text-slate-500 italic truncate border-t border-slate-900/40 pt-2 pl-0.5">
                    By {article.author.split(" (")[0]}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =========================================
          SECTION 3: FOOTER NEWSLETTER INTEGRATION
      ========================================= */}
      <section className="py-20 relative z-10 w-full px-8">
        <div className="max-w-[650px] mx-auto">
          
          <div className="relative rounded-2xl border border-slate-800 bg-[#040810]/75 backdrop-blur-md p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden text-center group">
            {/* Neon Border Glow Accent */}
            <div className="absolute -inset-px rounded-2xl bg-[#00f2fe]/4 group-hover:bg-[#00f2fe]/10 blur-[2px] transition-colors duration-500 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#00f2fe] bg-[#00f2fe]/15 px-3 py-1 rounded-full uppercase font-bold">
                WEEKLY K8S TELEMETRY DIGEST
              </span>
              <h2 className="font-orbitron text-xl md:text-2xl font-extrabold text-white tracking-wide">
                Subscribe to the Patch Protocol
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                Join 15,000+ cloud infrastructure experts receiving weekly AI remediation scripts, telemetry architectures, and incident write-ups.
              </p>

              {/* Form Input */}
              <form onSubmit={handleSubscribe} className="pt-4 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <div className="relative w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your DevOps email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribed}
                    className="w-full bg-[#030712]/90 border border-slate-800 rounded-lg px-4 py-3 text-xs font-sans placeholder-slate-550 text-white font-medium outline-none focus:border-[#00f2fe]/50 focus:shadow-[0_0_12px_rgba(0,242,254,0.1)] disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribed}
                  className="px-6 py-3 bg-[#00f2fe] hover:bg-[#00f2fe]/90 disabled:bg-emerald-500 disabled:text-[#070d1a] text-[#070d1a] font-bold rounded-lg font-orbitron text-xs tracking-wider transition-all shadow-[0_0_12px_rgba(0,242,254,0.25)] hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] uppercase flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:cursor-default"
                >
                  {subscribed ? (
                    <>
                      <Check size={14} />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      Subscribe
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Corner Decorative Bracket decoration */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-slate-800/80 transition-colors group-hover:border-[#00f2fe]/30" />
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-slate-800/80 transition-colors group-hover:border-[#00f2fe]/30" />
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

      {/* KEYFRAME ANIMATIONS & GLOW PULSE */}
      <style>{`
        @keyframes blogGlowPulse {
          0%, 100% { 
            border-color: rgba(0, 242, 254, 0.25); 
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.45), 0 0 5px rgba(0, 242, 254, 0.1); 
          }
          50% { 
            border-color: rgba(0, 242, 254, 0.65); 
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.45), 0 0 16px rgba(0, 242, 254, 0.35); 
          }
        }
        .blog-card:hover {
          animation: blogGlowPulse 1.6s infinite ease-in-out;
        }
      `}</style>

    </main>
  );
}
