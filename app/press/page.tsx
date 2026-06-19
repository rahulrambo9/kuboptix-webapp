"use client";

import { Download, Terminal, Image, Mail, ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";

interface BrandAsset {
  title: string;
  type: string;
  size: string;
  desc: string;
  icon: React.ReactNode;
}

const ASSETS: BrandAsset[] = [
  {
    title: "Kuboptix Primary Logo (SVG)",
    type: "Vector Graphic",
    size: "12 KB",
    desc: "Primary neon cyan logo with vector paths, suitable for light or dark backgrounds.",
    icon: <Terminal className="text-[#00f2fe]" size={20} />
  },
  {
    title: "Kuboptix Logo Mark (PNG)",
    type: "Raster Image (Transparent)",
    size: "45 KB",
    desc: "Isolated high-resolution terminal square logo icon for custom social previews.",
    icon: <Image className="text-purple-400" size={20} />
  },
  {
    title: "Full Brand Presentation Kit",
    type: "Compressed PDF",
    size: "4.8 MB",
    desc: "Details system guides, usage margins, editorial parameters, and product screenshots.",
    icon: <Image className="text-emerald-400" size={20} />
  }
];

export default function PressPage() {
  const triggerDownload = (title: string) => {
    alert(`Initializing secure package compilation download for asset: ${title}`);
  };

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
            MEDIA ASSETS // GUIDELINES & PRESS
          </span>
          <h1 className="font-orbitron font-extrabold leading-tight text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)" }}>
            Media Kit & <span className="text-[#00f2fe] drop-shadow-[0_0_20px_rgba(0,242,254,0.45)]">Press Resources</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Download certified Kuboptix brand assets, review color guidelines, and check recent product highlights.
          </p>
        </div>
      </section>

      {/* BRAND ASSETS SECTION */}
      <section className="pb-24 relative z-10 w-full px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Downloads (col-span-2) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-orbitron font-bold text-sm tracking-widest text-[#00f2fe] uppercase border-b border-slate-850 pb-3">
              Brand Asset Downloads
            </h3>
            
            <div className="space-y-4">
              {ASSETS.map((asset, index) => (
                <div 
                  key={index}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-[#040810]/40 backdrop-blur-sm hover:border-slate-700/50 hover:bg-[#071324]/10 transition-all duration-300"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-lg border border-slate-850 bg-slate-900/60 flex items-center justify-center shrink-0">
                      {asset.icon}
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-[#00f2fe] transition-colors leading-none">
                        {asset.title}
                      </h4>
                      <p className="text-slate-450 text-[11px] font-mono mt-1.5">
                        {asset.type} • {asset.size}
                      </p>
                      <p className="text-slate-400 text-xs mt-2 font-sans max-w-md">
                        {asset.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerDownload(asset.title)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-700 hover:border-[#00f2fe] bg-slate-950/40 hover:bg-[#00f2fe]/5 text-slate-300 hover:text-[#00f2fe] rounded-lg font-orbitron text-[10px] font-bold tracking-wider transition-all uppercase cursor-pointer shrink-0"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Color codes & Contact */}
          <div className="space-y-8">
            
            {/* Color Scheme Card */}
            <div className="border border-slate-800 bg-[#040810]/40 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <h3 className="font-orbitron font-bold text-sm tracking-widest text-[#00f2fe] uppercase border-b border-slate-850 pb-2">
                Brand Colors
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-850 bg-slate-900/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-[#00f2fe] shadow-[0_0_8px_rgba(0,242,254,0.4)]" />
                    <span className="text-xs font-mono font-bold text-white">Kuboptix Cyan</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase">#00f2fe</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-850 bg-slate-900/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-[#070d1a] border border-slate-800" />
                    <span className="text-xs font-mono font-bold text-white">Dark Canvas</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase">#070d1a</span>
                </div>
              </div>
            </div>

            {/* Media Contact Card */}
            <div className="border border-slate-800 bg-[#040810]/40 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <h3 className="font-orbitron font-bold text-sm tracking-widest text-[#00f2fe] uppercase border-b border-slate-850 pb-2">
                Press Contact
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Media Inquiries</span>
                  <span className="text-xs font-mono font-bold text-white">press@kuboptix.com</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect directly for interview scheduling, quote requests, or dynamic platform capability briefings.
              </p>
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
