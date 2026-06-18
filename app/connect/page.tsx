"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Upload,
  Key,
  Cloud,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

type ConnectionMethod = "local" | "upload" | "manual" | "cloud";

export default function ConnectionHub() {
  const router = useRouter();

  // State Management
  const [method, setMethod] = useState<ConnectionMethod>("local");
  const [localContexts, setLocalContexts] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [token, setToken] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Status logs
  const [loading, setLoading] = useState(false);
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load local contexts on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/connect/contexts")
      .then((res) => res.json())
      .then((data) => {
        setLocalContexts(data);
        if (data.length > 0) {
          setSelectedContext(data[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load local contexts:", err);
      });
  }, []);

  const addLog = (msg: string) => {
    setStatusLogs((prev) => [...prev, `[SYSTEM] ${msg}`]);
  };

  const handleLocalConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContext) return;

    setLoading(true);
    setError(null);
    setStatusLogs([]);
    addLog(`INITIATING CLIENT HANDSHAKE FOR CONTEXT: ${selectedContext.toUpperCase()}`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      addLog("READING LOCAL KUBECONFIG FILE...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      addLog("TESTING API SERVER HANDSHAKE (Discovery API)...");

      const res = await fetch("http://localhost:8000/api/connect/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: selectedContext })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to establish connection");
      }

      addLog("CONNECTION SECURED! ROUTING TO CLUSTER TELEMETRY...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard/overview");
    } catch (err: any) {
      setError(err.message);
      addLog("ERROR: CONNECTION ESTABLISHMENT FAILED.");
      setLoading(false);
    }
  };

  const handleManualConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverUrl || !token) return;

    setLoading(true);
    setError(null);
    setStatusLogs([]);
    addLog(`DIAGNOSING APISERVER AT ${serverUrl}...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      addLog("CONFIGURING SECURE BEARER TOKEN SCHEME...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      addLog("ESTABLISHING TCP / HTTPS HANDSHAKE...");

      const res = await fetch("http://localhost:8000/api/connect/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server: serverUrl, token: token })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to reach Kubernetes API server");
      }

      addLog("CREDENTIALS ACCEPTED. REDIRECTING...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard/overview");
    } catch (err: any) {
      setError(err.message);
      addLog("ERROR: API HANDSHAKE FAILED. MACHINE REFUSED CONNECTION.");
      setLoading(false);
    }
  };

  const handleUploadConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setStatusLogs([]);
    addLog("PARSING UPLOADED FILE BYTE-STREAM...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      addLog("EXTRACTING CERTIFICATES & KUBE CONTEXTS...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      addLog("TESTING APISERVER ROUTE & AUTHDATA...");

      const formData = new FormData();
      formData.append("config", file);

      const res = await fetch("http://localhost:8000/api/connect/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to configure cluster using uploaded Kubeconfig");
      }

      addLog("HANDSHAKE VALIDATED. LAUNCHING WORKSPACE...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard/overview");
    } catch (err: any) {
      setError(err.message);
      addLog("ERROR: INVALID CONFIG OR APISERVER UNREACHABLE.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 pointer-events-none z-0" />

      <div className="w-full max-w-4xl relative z-10 my-10">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-[#00f0ff] mb-3">
            <Terminal className="w-7 h-7" />
            <span className="font-orbitron font-bold text-2xl tracking-wider">CLUSTER CONNECTION GATEWAY</span>
          </div>
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
            Identify authentication credentials to hook up cluster telemetry
          </p>
        </div>

        {/* CONNECTION METHODS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {/* Card A: Local Config */}
          <button
            onClick={() => !loading && setMethod("local")}
            disabled={loading}
            className={`p-6 rounded-lg border text-left flex flex-col justify-between h-48 transition-all relative overflow-hidden group
              ${method === "local"
                ? "bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                : "bg-[#0a0f1c]/80 border-slate-800 hover:border-slate-600"
              }`}
          >
            {method === "local" && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff]" />
            )}
            <Terminal className={`w-8 h-8 ${method === 'local' ? 'text-[#00f0ff]' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
            <div>
              <h3 className="font-orbitron font-bold text-sm text-white mb-1">LOCAL CONTEXT</h3>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                Scan your environment Kubeconfig contexts automatically.
              </p>
            </div>
          </button>

          {/* Card B: Upload Config */}
          <button
            onClick={() => !loading && setMethod("upload")}
            disabled={loading}
            className={`p-6 rounded-lg border text-left flex flex-col justify-between h-48 transition-all relative overflow-hidden group
              ${method === "upload"
                ? "bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                : "bg-[#0a0f1c]/80 border-slate-800 hover:border-slate-600"
              }`}
          >
            {method === "upload" && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff]" />
            )}
            <Upload className={`w-8 h-8 ${method === 'upload' ? 'text-[#00f0ff]' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
            <div>
              <h3 className="font-orbitron font-bold text-sm text-white mb-1">UPLOAD FILE</h3>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                Drag-and-drop a custom Kubernetes config YAML file.
              </p>
            </div>
          </button>

          {/* Card C: Direct SA Token */}
          <button
            onClick={() => !loading && setMethod("manual")}
            disabled={loading}
            className={`p-6 rounded-lg border text-left flex flex-col justify-between h-48 transition-all relative overflow-hidden group
              ${method === "manual"
                ? "bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                : "bg-[#0a0f1c]/80 border-slate-800 hover:border-slate-600"
              }`}
          >
            {method === "manual" && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff]" />
            )}
            <Key className={`w-8 h-8 ${method === 'manual' ? 'text-[#00f0ff]' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
            <div>
              <h3 className="font-orbitron font-bold text-sm text-white mb-1">DIRECT TOKEN</h3>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                Provide API server endpoints and ServiceAccount tokens.
              </p>
            </div>
          </button>

          {/* Card D: Cloud Provider */}
          <button
            onClick={() => !loading && setMethod("cloud")}
            disabled={loading}
            className={`p-6 rounded-lg border text-left flex flex-col justify-between h-48 transition-all relative overflow-hidden group
              ${method === "cloud"
                ? "bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                : "bg-[#0a0f1c]/80 border-slate-800 hover:border-slate-600"
              }`}
          >
            {method === "cloud" && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff]" />
            )}
            <Cloud className={`w-8 h-8 ${method === 'cloud' ? 'text-[#00f0ff]' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
            <div>
              <h3 className="font-orbitron font-bold text-sm text-white mb-1">CLOUD IAM</h3>
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                SSO authorization into AWS EKS, GCP GKE, and Azure AKS.
              </p>
            </div>
          </button>
        </div>

        {/* DETAILED SETUP FORM */}
        <div className="relative rounded-lg border border-slate-800 bg-[#0a0f1c]/80 p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)] mb-6 min-h-[200px]">
          {/* Neon Corner brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#00f0ff]/40" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#00f0ff]/40" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#00f0ff]/20" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#00f0ff]/20" />

          {/* METHOD 1: LOCAL CONTEXT */}
          {method === "local" && (
            <form onSubmit={handleLocalConnect} className="space-y-6">
              <h3 className="font-orbitron font-bold text-lg text-[#00f0ff] mb-2 uppercase">Local Context Authorization</h3>
              <p className="text-xs font-sans text-slate-400 mb-6 leading-relaxed">
                Scan all contexts currently registered under your machine&apos;s home folder config (`~/.kube/config`). Choose your target cluster profile to activate link.
              </p>

              {localContexts.length === 0 ? (
                <div className="p-4 bg-yellow-900/10 border border-yellow-500/30 rounded text-yellow-500 font-mono text-xs leading-relaxed">
                  [WARNING] No local Kubeconfig file detected or server has empty contexts. If you are running locally, make sure you have active contexts configured under your home directory.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">Target Kubernetes Context</label>
                    <select
                      value={selectedContext}
                      onChange={(e) => setSelectedContext(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#050b14] border border-slate-800 rounded text-slate-300 font-mono px-4 py-3 focus:outline-none focus:border-[#00f0ff] transition-all uppercase text-sm"
                    >
                      {localContexts.map((ns) => (
                        <option key={ns} value={ns}>{ns}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/25 border border-[#00f0ff] text-[#00f0ff] font-orbitron font-bold tracking-widest py-3.5 rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50"
                  >
                    {loading ? "LINKING CONTROL PLANE..." : "ESTABLISH LINK"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </form>
          )}

          {/* METHOD 2: UPLOAD FILE */}
          {method === "upload" && (
            <form onSubmit={handleUploadConnect} className="space-y-6">
              <h3 className="font-orbitron font-bold text-lg text-[#00f0ff] mb-2 uppercase">Kubeconfig File Upload</h3>
              <p className="text-xs font-sans text-slate-400 mb-6 leading-relaxed">
                Connect using a custom YAML Kubeconfig file. The file is parsed in memory and will establish cluster API connections immediately.
              </p>

              <div className="space-y-4">
                <div className="border border-dashed border-slate-800 bg-[#050b14] hover:border-[#00f0ff]/50 rounded-lg p-8 text-center transition-all cursor-pointer relative">
                  <input
                    type="file"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <span className="block font-mono text-sm text-slate-300 mb-1">
                    {file ? file.name.toUpperCase() : "DRAG & DROP CONFIG FILE"}
                  </span>
                  <span className="block font-mono text-[10px] text-slate-600">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "OR CLICK TO CHOOSE YAML FILE"}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full flex items-center justify-center gap-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/25 border border-[#00f0ff] text-[#00f0ff] font-orbitron font-bold tracking-widest py-3.5 rounded transition-all disabled:opacity-50"
                >
                  {loading ? "PARSING CERTIFICATE AUTHORITIES..." : "VALIDATE & DEPLOY CONFIG"}
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* METHOD 3: DIRECT ACCESS TOKEN */}
          {method === "manual" && (
            <form onSubmit={handleManualConnect} className="space-y-6">
              <h3 className="font-orbitron font-bold text-lg text-[#00f0ff] mb-2 uppercase">ServiceAccount Direct Token</h3>
              <p className="text-xs font-sans text-slate-400 mb-6 leading-relaxed">
                Input direct API control-plane URL endpoints along with token keys generated for a ServiceAccount inside the cluster. Bypasses standard config parsing.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">API Server Address</label>
                  <input
                    type="url"
                    required
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    disabled={loading}
                    placeholder="https://127.0.0.1:6443"
                    className="w-full bg-[#050b14] border border-slate-800 rounded text-slate-300 font-mono px-4 py-3 focus:outline-none focus:border-[#00f0ff] transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">Bearer Token Value</label>
                  <textarea
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={loading}
                    placeholder="eyJhbGciOiJSUzI1NiIsImtpZCI..."
                    className="w-full h-24 bg-[#050b14] border border-slate-800 rounded text-slate-300 font-mono px-4 py-3 focus:outline-none focus:border-[#00f0ff] transition-all text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/25 border border-[#00f0ff] text-[#00f0ff] font-orbitron font-bold tracking-widest py-3.5 rounded transition-all disabled:opacity-50"
                >
                  {loading ? "INITIALIZING SECURE PROTOCOL..." : "SECURE CLIENT SESSION"}
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* METHOD 4: CLOUD PROVIDER */}
          {method === "cloud" && (
            <div className="space-y-6">
              <h3 className="font-orbitron font-bold text-lg text-[#00f0ff] mb-2 uppercase">Cloud IAM SSO Integration</h3>
              
              <div className="p-8 border border-dashed border-slate-800 bg-[#050b14] rounded-lg text-center">
                <Cloud className="w-12 h-12 text-slate-700 mx-auto mb-4 animate-pulse" />
                <h4 className="font-orbitron font-bold text-white text-sm tracking-wide mb-2">ENTERPRISE CONNECTIONS ONLY</h4>
                <p className="text-xs text-slate-500 font-mono max-w-md mx-auto leading-relaxed mb-6">
                  SSO integration with cloud platforms (AWS EKS, Google GKE, Azure AKS) is restricted to enterprise accounts.
                </p>
                <a
                  href="mailto:admin@kuboptix.com"
                  className="px-6 py-2.5 bg-slate-900/50 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded font-orbitron text-xs tracking-widest transition-all"
                >
                  CONTACT ENTERPRISE SUPPORT
                </a>
              </div>
            </div>
          )}

        </div>

        {/* FEEDBACK STATUS CONSOLE */}
        {(loading || statusLogs.length > 0 || error) && (
          <div className="p-6 rounded-lg border border-slate-800 bg-black/50 font-mono text-xs leading-relaxed space-y-2">
            <div className="flex justify-between items-center text-slate-500 border-b border-slate-800 pb-2 mb-3">
              <span>CONNECTION LOGS</span>
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00f0ff]" />}
            </div>

            <div className="space-y-1 text-slate-400">
              {statusLogs.map((log, index) => (
                <div key={index} className={log.includes("ERROR") ? "text-red-500" : log.includes("SUCCESS") ? "text-[#10b981]" : ""}>
                  {log}
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-500 bg-red-900/10 border border-red-500/30 p-3 rounded mt-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">CONNECTION REJECTED:</span> {error}
                </div>
              </div>
            )}
          </div>
        )}

        {/* footer return */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-xs text-slate-500 hover:text-[#00f0ff] transition-colors font-mono tracking-widest">
            ← RETURN TO ACCESS TERMINAL
          </Link>
        </div>

      </div>
    </main>
  );
}
