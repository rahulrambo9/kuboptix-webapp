"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Clock, Check, Send } from "lucide-react";
import Navbar from "../components/Navbar";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.subject && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          category: "general",
          subject: "",
          message: ""
        });
      }, 4000);
    }
  };

  return (
    <main className="w-full relative flex flex-col font-sans text-white bg-[#070d1a] min-h-screen">
      
      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <Navbar />

      <section className="pt-32 pb-20 relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* LEFT COLUMN: Ticket Form (60% width -> col-span-3) */}
        <div className="lg:col-span-3 border border-slate-800 bg-[#040810]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 relative">
          
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[#00f2fe]/3 blur-[50px] pointer-events-none" />

          {submitted ? (
            <div className="text-center py-16 space-y-4 animate-[successFadeIn_0.35s_ease-out]">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <Check size={22} />
              </div>
              <h3 className="font-orbitron font-bold text-xl text-white">
                TICKET SUBMITTED SUCCESSFULY
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Thank you. Your diagnostic ticket has been compiled and routed to the Kuboptix Core engineering team. We will review it shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="border-b border-slate-850 pb-4 mb-6">
                <h2 className="font-orbitron font-bold text-xl md:text-2xl text-white">
                  Open Support Ticket
                </h2>
                <p className="text-slate-400 text-xs md:text-sm mt-1">
                  Report a bug, request custom enterprise playbooks, or query licensing parameters.
                </p>
              </div>

              {/* Grid Name/Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#030712]/90 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-550 outline-none focus:border-[#00f2fe]/50 focus:shadow-[0_0_12px_rgba(0,242,254,0.1)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full bg-[#030712]/90 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-550 outline-none focus:border-[#00f2fe]/50 focus:shadow-[0_0_12px_rgba(0,242,254,0.1)]"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#030712]/90 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-550 outline-none focus:border-[#00f2fe]/50 focus:shadow-[0_0_12px_rgba(0,242,254,0.1)]"
                >
                  <option value="general">General Support</option>
                  <option value="oom">OOMKilled limits / AI Engine issues</option>
                  <option value="cve">Security scans & CNI Coves</option>
                  <option value="agent">Helm cluster installation bugs</option>
                  <option value="billing">Billing & enterprise pricing</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Summarize the incident"
                  className="w-full bg-[#030712]/90 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-550 outline-none focus:border-[#00f2fe]/50 focus:shadow-[0_0_12px_rgba(0,242,254,0.1)]"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Details</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide logs, config parameters, or descriptions of the error"
                  className="w-full bg-[#030712]/90 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-550 outline-none focus:border-[#00f2fe]/50 focus:shadow-[0_0_12px_rgba(0,242,254,0.1)] resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-[#00f2fe] hover:bg-[#00f2fe]/90 text-[#070d1a] font-bold rounded-lg font-orbitron text-xs tracking-wider transition-all shadow-[0_0_12px_rgba(0,242,254,0.25)] hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] uppercase cursor-pointer"
              >
                <Send size={13} />
                Send Support Ticket
              </button>

            </form>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar Stats (40% width -> col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Status */}
          <div className="rounded-2xl border border-slate-800 bg-[#040810]/40 backdrop-blur-sm p-6 space-y-3">
            <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase block">Operational Status</span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-orbitron tracking-widest text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              100% OPERATIONAL
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              All telemetry ingestion targets and self-healing endpoints are running stably across all zones.
            </p>
          </div>

          {/* Card 2: SLA Response Time */}
          <div className="rounded-2xl border border-slate-800 bg-[#040810]/40 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/20 flex items-center justify-center text-[#00f2fe]">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Expected SLA</span>
                <span className="font-orbitron font-bold text-white text-base">Under 15 Minutes</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enterprise license agreements receive prioritary queues directly to our operations engineers.
            </p>
          </div>

          {/* Card 3: Contact Channels */}
          <div className="rounded-2xl border border-slate-800 bg-[#040810]/40 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Mail size={16} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Email Channels</span>
                <span className="font-orbitron font-bold text-white text-base">admin@kuboptix.com</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              For security vulnerability disclosures, please coordinate direct encrypted key distributions.
            </p>
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

      <style>{`
        @keyframes successFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

    </main>
  );
}
