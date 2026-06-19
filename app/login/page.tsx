"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Activity, AlertTriangle, X } from "lucide-react";
import Link from "next/link";

// ─── Default credentials ──────────────────────────────────────────────────────
const VALID_EMAIL    = "admin@kuboptix.com";
const VALID_PASSWORD = "Kuboptix@2026";
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(false);
  const [shaking, setShaking]   = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      router.push("/connect");
      return;
    }

    // Wrong credentials — trigger shake + show modal
    setShaking(true);
    setError(true);
    setTimeout(() => setShaking(false), 500);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">

      {/* ── ERROR MODAL ───────────────────────────────────────────────────── */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setError(false)}
          />

          {/* Modal panel */}
          <div className="relative z-10 w-full max-w-sm animate-[fadeSlideIn_0.25s_ease-out]">
            <div className="relative rounded-xl border border-red-500/40 bg-[#0a0f1c]/95 backdrop-blur-md p-8 shadow-[0_0_60px_-10px_rgba(239,68,68,0.4)]">
              {/* Red top bar */}
              <div className="absolute top-0 left-0 w-full h-[2px] rounded-t-xl bg-red-500" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0  w-3 h-3 border-l-2 border-t-2 border-red-500" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-red-500" />
              <div className="absolute bottom-0 left-0  w-3 h-3 border-l-2 border-b-2 border-red-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-red-500/50" />

              {/* Close button */}
              <button
                onClick={() => setError(false)}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-full border border-red-500/50 bg-red-500/10 flex items-center justify-center shadow-[0_0_24px_rgba(239,68,68,0.3)]">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
              </div>

              {/* Heading */}
              <h3 className="font-orbitron text-center text-red-400 text-xl font-bold tracking-widest mb-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                OOPS...
              </h3>
              <p className="font-orbitron text-center text-white text-sm tracking-wider mb-4">
                INVALID CREDENTIALS
              </p>

              {/* Body */}
              <p className="text-slate-300 text-sm font-sans text-center leading-relaxed tracking-wide">
                You must register or contact us to use this product.
              </p>

              {/* Divider */}
              <div className="my-5 border-t border-slate-800" />

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:admin@kuboptix.com"
                  className="w-full text-center px-4 py-2.5 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded font-orbitron text-xs tracking-widest transition-all shadow-[0_0_12px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  CONTACT KUBOPTIX
                </a>
                <button
                  onClick={() => setError(false)}
                  className="w-full text-center px-4 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded font-orbitron text-xs tracking-widest transition-all"
                >
                  TRY AGAIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN CARD ────────────────────────────────────────────────────── */}
      <div className={`w-full max-w-md ${shaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Activity className="w-16 h-16 text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          </div>
          <h1 className="font-orbitron text-5xl font-bold tracking-wider text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
            KUBOPTIX
          </h1>
        </div>

        <div className="relative rounded-lg border border-[#00f0ff]/30 bg-[#0a0f1c]/80 backdrop-blur-sm p-8 shadow-[0_0_50px_-12px_rgba(0,240,255,0.2)]">
          {/* Corner accents */}
          <div className="absolute top-0 left-0  w-3 h-3 border-l-2 border-t-2 border-[#00f0ff]/60" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#00f0ff]/60" />

          <h2 className="font-orbitron text-3xl text-[#00f0ff] mb-1 tracking-wide drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            ACCESS TERMINAL
          </h2>
          <p className="text-sm text-slate-400 mb-8 tracking-widest uppercase font-sans">
            Authenticate to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 tracking-widest uppercase font-sans">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@kuboptix.com"
                  className="w-full bg-[#050b14] border border-slate-700 rounded-lg text-slate-200 text-[15px] px-10 py-3.5 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all font-sans placeholder-slate-600"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 tracking-widest uppercase font-sans">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#050b14] border border-slate-700 rounded-lg text-slate-200 text-[15px] px-10 py-3.5 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all font-sans placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0a1025] hover:bg-[#00f0ff]/10 text-white border-2 border-[#00f0ff]/60 py-3.5 rounded-lg font-orbitron font-bold text-base tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            >
              INITIATE LOGIN
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/" className="text-sm text-[#00f0ff] hover:underline tracking-widest font-sans">
              ← Return to Main Menu
            </Link>
          </div>
        </div>
      </div>

      {/* ── KEYFRAME ANIMATIONS ───────────────────────────────────────────── */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1); }
        }
      `}</style>
    </main>
  );
}
