"use client";

import React from "react";
import Link from "next/link";
import { Activity, Box, Layers, Server, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";

// Ensure these imports match your filenames exactly!
import SystemStatus from "./components/SystemStatus"; 
import NamespaceSelector from "./components/NamespaceSelector";
import { NamespaceProvider } from "./components/NamespaceContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <NamespaceProvider>
      <div className="flex min-h-screen bg-[#020617] font-sans text-white">
      
      {/* =======================
          SIDEBAR NAVIGATION
      ======================== */}
      <aside className="w-64 border-r border-slate-800 flex flex-col fixed h-full z-20 bg-[#020617] overflow-y-auto">
        

        {/* LOGO (Clickable — returns to landing page) */}
        <Link href="/" className="flex items-center gap-3 p-6 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 border-2 border-[#00f0ff]/70 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)] shrink-0">
            <Activity className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div>
            <div className="font-orbitron font-bold text-base tracking-widest text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              KUBOPTIX
            </div>
            <div className="text-[9px] text-slate-500 tracking-[0.25em] uppercase font-mono">
              Cluster Monitor
            </div>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard/overview" className="w-full block">
             <NavItem icon={<Activity size={18} />} label="OVERVIEW" active={pathname === "/dashboard/overview"} />
          </Link>
  
          <Link href="/dashboard/pods" className="w-full block">
            <NavItem icon={<Box size={18} />} label="PODS" active={pathname === "/dashboard/pods"} />
          </Link>

         <Link href="/dashboard/deployments" className="w-full block">
            <NavItem icon={<Layers size={18} />} label="DEPLOYMENTS" active={pathname === "/dashboard/deployments"} />
         </Link>
         
          <Link href="/dashboard/services" className="w-full block">
             <NavItem icon={<Share2 size={18} />} label="SERVICES" active={pathname === "/dashboard/services"} />
          </Link>

          <Link href="/dashboard/nodes" className="w-full block">
             <NavItem icon={<Server size={18} />} label="NODES" active={pathname === "/dashboard/nodes"} />
          </Link>
        </nav>

        {/* SIDEBAR STATUS WIDGET */}
        <div className="p-4 mt-auto">
          <div className="border border-[#00f0ff]/30 rounded p-4 bg-[#0a0f1c]">
            <div className="flex justify-between items-center mb-4 relative">
               <h4 className="text-[#00f0ff] text-xs font-bold tracking-widest">SYSTEM STATUS</h4>
               <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-[#00f0ff]" />
            </div>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Latency</span>
                <span className="text-[#10b981]">12ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Uptime</span>
                <span className="text-[#00f0ff]">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =======================
          MAIN CONTENT AREA
      ======================== */}
      <div className="flex-1 ml-64 flex flex-col relative z-10">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-sm">
           
           {/* Left Spacer */}
           <div className="flex-1" /> 

           {/* Right Side Controls */}
           <div className="flex items-center">
             <NamespaceSelector />
             <SystemStatus />
           </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>

    </div>
    </NamespaceProvider>
  );
}

// Helper Component for Sidebar Links
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest transition-all rounded hover:bg-[#00f0ff]/10
      ${active 
        ? "text-[#00f0ff] border-l-2 border-[#00f0ff] bg-[#00f0ff]/5 shadow-[0_0_15px_-5px_rgba(0,240,255,0.3)]" 
        : "text-slate-500 hover:text-[#00f0ff] border-l-2 border-transparent"
      }
    `}>
      {icon}
      <span>{label}</span>
    </button>
  );
}