"use client";

import { useState } from "react";
import { Terminal, Shield, Cpu, BookOpen, Layers, Network, Copy, Check } from "lucide-react";
import Navbar from "../components/Navbar";

type DocKey = "intro" | "agent" | "architecture" | "ingress" | "self-healing" | "zero-trust";

interface DocContent {
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  body: React.ReactNode;
}

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = useState<DocKey>("intro");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const DOC_CONTENTS: Record<DocKey, DocContent> = {
    intro: {
      title: "Welcome to the Kuboptix Engine",
      category: "GETTING STARTED",
      description: "Learn how Kuboptix bridges the gap between active multi-cluster telemetry observation and automated, click-to-remediate AI runtime security operation.",
      icon: <BookOpen size={18} />,
      body: (
        <div className="space-y-6 text-slate-305 text-sm leading-relaxed">
          <p>
            Kuboptix is a next-generation Kubernetes operations platform designed to solve alert fatigue, eliminate manual log inspection toil, and secure running container bounds dynamically.
          </p>
          <div className="p-5 rounded-xl border border-slate-800 bg-[#040810]/50 backdrop-blur-sm">
            <h4 className="font-orbitron font-bold text-white text-xs tracking-wider mb-2 uppercase">Core Principles</h4>
            <ul className="space-y-2.5 list-disc list-inside text-slate-400">
              <li><strong className="text-[#00f2fe]">Declarative Telemetry:</strong> Lightweight node agents stream live cluster state without kernel injection or frame-rate lags.</li>
              <li><strong className="text-[#00f2fe]">Contextual Self-Healing:</strong> Diagnoses container restarts (like OOMKilled or CrashLoops) and synthesizes manifest corrections.</li>
              <li><strong className="text-[#00f2fe]">Shift-Left CNI Shield:</strong> Runtime scans pacify packages and continuously reinforce zero-trust network states.</li>
            </ul>
          </div>
          <p>
            Navigate through the categories in the sidebar to initialize your first cluster agent, configure self-healing parameters, or configure zero-trust network policies.
          </p>
        </div>
      )
    },
    agent: {
      title: "Cluster Agent Installation",
      category: "GETTING STARTED",
      description: "Deploys the lightweight telemetry daemonset into your cluster using Helm package manager instructions.",
      icon: <Terminal size={18} />,
      body: (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            The Kuboptix Agent collects pod states, replica configurations, node usage ratios, and stdout/stderr failure logs. Install it inside your cluster using Helm:
          </p>
          
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs overflow-x-auto text-[#00f2fe]">
            <button
              onClick={() => handleCopy("helm repo add kuboptix https://charts.kuboptix.com\nhelm install kuboptix-agent kuboptix/kuboptix-agent \\\n  --set apiKey=\"kb_live_83fa9902bc\" \\\n  --set clusterName=\"production-us-east\"", "helm")}
              className="absolute top-4 right-4 p-1.5 rounded-md border border-slate-800 hover:border-slate-600 bg-slate-900/60 transition-colors text-slate-400 hover:text-white"
              title="Copy code"
            >
              {copiedKey === "helm" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
            <p className="text-slate-500"># Add Kuboptix Helm repository</p>
            <p>helm repo add kuboptix https://charts.kuboptix.com</p>
            <p className="text-slate-500 mt-3"># Deploy agent with your license configuration</p>
            <p>helm install kuboptix-agent kuboptix/kuboptix-agent \</p>
            <p>  --set apiKey="kb_live_83fa9902bc" \</p>
            <p>  --set clusterName="production-us-east"</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-850 bg-slate-900/20 text-slate-400 text-xs">
            <span className="font-bold text-white block mb-1">Prerequisites:</span>
            - Kubernetes v1.22+ cluster context <br />
            - Helm v3 packages installed <br />
            - Ingress traffic access to api.kuboptix.com (Port 443)
          </div>
        </div>
      )
    },
    architecture: {
      title: "System Architecture & Telemetry Flow",
      category: "GETTING STARTED",
      description: "Visualizes the lightweight data flows, dynamic polling frequencies, and control plane boundaries.",
      icon: <Layers size={18} />,
      body: (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            Kuboptix follows a hub-and-spoke agent telemetry schema. The agent runs as a daemonset on each node, capturing runtime metrics and forwarding them to the Kuboptix Go Backend:
          </p>
          <div className="p-5 border border-slate-800 rounded-xl bg-slate-950/60 font-mono text-[11px] text-slate-400 space-y-2">
            <div className="text-[#00f2fe] font-bold"> telemetry-daemonset (Node Space) </div>
            <div className="pl-4">├── collects namespace states via apiserver watch</div>
            <div className="pl-4">├── buffers stdout stderr log chunks locally</div>
            <div className="pl-4">└── streams state changes to secure GRPC endpoint (Port 8000)</div>
            
            <div className="text-[#00f2fe] font-bold mt-4"> control-plane-engine (Kuboptix SaaS) </div>
            <div className="pl-4">├── maps live topological graphs inside UI canvas</div>
            <div className="pl-4">├── diagnostic runtime OOM alert evaluator triggers</div>
            <div className="pl-4">└── pushes signed NetworkPolicy network patches back to cluster</div>
          </div>
          <p>
            Telemetry streams are buffered and compacted on-node to ensure zero frame-rate drops or significant network traffic overheads.
          </p>
        </div>
      )
    },
    ingress: {
      title: "Ingress Observability Mapping",
      category: "TELEMETRY CONFIG",
      description: "Provides full multi-cluster namespace boundary tracking and live endpoint health visualization.",
      icon: <Network size={18} />,
      body: (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            By auditing network policies, services, endpoints, and active traffic lanes, the Ingress Observability Engine builds an interactive real-time representation of your workload dependencies.
          </p>
          <p>
            To configure custom endpoint labels, define the following annotations inside your Kubernetes services:
          </p>
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs overflow-x-auto text-[#00f2fe]">
            <button
              onClick={() => handleCopy("metadata:\n  name: billing-api\n  annotations:\n    kuboptix.com/ingress-observability: \"true\"\n    kuboptix.com/dependency-depth: \"3\"", "annotations")}
              className="absolute top-4 right-4 p-1.5 rounded-md border border-slate-800 hover:border-slate-600 bg-slate-900/60 transition-colors text-slate-400 hover:text-white"
            >
              {copiedKey === "annotations" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
            <p className="text-slate-500"># Sample Service annotations for depth mapping</p>
            <p>metadata:</p>
            <p>  name: billing-api</p>
            <p>  annotations:</p>
            <p>    kuboptix.com/ingress-observability: "true"</p>
            <p>    kuboptix.com/dependency-depth: "3"</p>
          </div>
        </div>
      )
    },
    "self-healing": {
      title: "Self-Healing Configuration",
      category: "AUTO-REMEDIATION",
      description: "Instructs the AI remediation loops on how to deploy dynamic limits and OOM crash updates.",
      icon: <Cpu size={18} />,
      body: (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            Configure your cluster self-healing boundaries using the declarative custom resource definition. The agent dynamically parses OOM errors and applies rolling changes:
          </p>

          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs overflow-x-auto text-[#00f2fe]">
            <button
              onClick={() => handleCopy("apiVersion: kuboptix.com/v2\nkind: RemediationPolicy\nmetadata:\n  name: billing-auto-repair\nspec:\n  targetNamespace: billing-prod\n  actions:\n    - match: OutOfMemory\n      strategy: ScaleUpLimit\n      maxCpuRatio: 1.5\n      maxMemoryRatio: 2.0", "crd")}
              className="absolute top-4 right-4 p-1.5 rounded-md border border-slate-800 hover:border-slate-600 bg-slate-900/60 transition-colors text-slate-400 hover:text-white"
            >
              {copiedKey === "crd" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
            <p>apiVersion: kuboptix.com/v2</p>
            <p>kind: RemediationPolicy</p>
            <p>metadata:</p>
            <p>  name: billing-auto-repair</p>
            <p>spec:</p>
            <p>  targetNamespace: billing-prod</p>
            <p>  actions:</p>
            <p>    - match: OutOfMemory</p>
            <p>      strategy: ScaleUpLimit</p>
            <p>      maxCpuRatio: 1.5</p>
            <p>      maxMemoryRatio: 2.0</p>
          </div>
        </div>
      )
    },
    "zero-trust": {
      title: "Zero-Trust CNI Network Shield",
      category: "AUTO-REMEDIATION",
      description: "Dynamically restricts permissive network paths around CVE compromised containers.",
      icon: <Shield size={18} />,
      body: (
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            The Shift-Left engine generates fine-grained isolation rules at the CNI layer. When an active memory threat is detected, Kuboptix isolates the container:
          </p>
          <p>
            It injects a custom NetworkPolicy restricting all ingress traffic while keeping the log pipeline open to security analysts. This prevents lateral movements inside the cluster boundaries.
          </p>
          <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/5 text-slate-350 text-xs">
            <strong className="text-red-400 font-bold block mb-1">CNI Compatibility:</strong>
            - Compatible with Cilium, Calico, and Flannel network layers. <br />
            - Configured via daemonset agent namespaces.
          </div>
        </div>
      )
    }
  };

  const currentDoc = DOC_CONTENTS[activeDoc];

  // Group side nav items by category
  const navCategories = Array.from(new Set(Object.values(DOC_CONTENTS).map(d => d.category)));

  return (
    <main className="w-full relative flex flex-col font-sans text-white bg-[#070d1a] min-h-screen">
      
      {/* GLOBAL BACKGROUND GRID */}
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 pointer-events-none z-0" />

      {/* STICKY NAVBAR */}
      <Navbar />

      <section className="pt-28 pb-20 relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        
        {/* LEFT COLUMN: Sidebar Categories */}
        <aside className="md:col-span-1 border border-slate-800 bg-[#040810]/70 backdrop-blur-md rounded-2xl p-5 space-y-6">
          {navCategories.map((category) => (
            <div key={category} className="space-y-2">
              <span className="text-[10px] font-orbitron font-bold text-[#00f2fe]/80 tracking-[0.2em] block pl-3 mb-2">
                {category}
              </span>
              <ul className="space-y-1">
                {Object.entries(DOC_CONTENTS)
                  .filter(([_, doc]) => doc.category === category)
                  .map(([key, doc]) => (
                    <li key={key}>
                      <button
                        onClick={() => setActiveDoc(key as DocKey)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono rounded-lg transition-all text-left ${
                          activeDoc === key
                            ? "bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-white font-bold shadow-[0_0_12px_rgba(0,242,254,0.15)]"
                            : "border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className={`${activeDoc === key ? "text-[#00f2fe]" : "text-slate-500"}`}>
                          {doc.icon}
                        </span>
                        {doc.title.split(" & ")[0].split(" // ")[0]}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* RIGHT COLUMN: Documentation Body Panel */}
        <div className="md:col-span-3 border border-slate-800 bg-[#040810]/60 backdrop-blur-md rounded-2xl p-8 relative min-h-[500px]">
          
          {/* Subtle cyan glow inside panel */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[#00f2fe]/3 blur-[50px] pointer-events-none" />

          {/* Heading */}
          <div className="border-b border-slate-850 pb-5 mb-6 space-y-2">
            <span className="text-[9px] font-mono text-[#00f2fe]/70 uppercase tracking-widest block font-bold">
              {currentDoc.category} // {activeDoc.toUpperCase()}
            </span>
            <h2 className="font-orbitron font-bold text-2xl md:text-3xl text-white tracking-wide">
              {currentDoc.title}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              {currentDoc.description}
            </p>
          </div>

          {/* Documentation Content */}
          <div className="relative z-10 animate-[docFadeIn_0.35s_ease-out]">
            {currentDoc.body}
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
        @keyframes docFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

    </main>
  );
}
