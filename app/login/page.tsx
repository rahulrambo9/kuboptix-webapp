import { Lock, Mail, Activity } from 'lucide-react';
import Link from 'next/link'; // We need this to go back Home

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      {/* LOGIN CARD */}
      <div className="w-full max-w-md">
        
        {/* LOGO SECTION */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Activity className="w-16 h-16 text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
          </div>
          <h1 className="font-orbitron text-5xl font-bold tracking-wider text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
            K8S JARVIS
          </h1>
        </div>

        <div className="relative rounded-lg border border-[#00f0ff]/30 bg-[#0a0f1c]/80 backdrop-blur-sm p-8 shadow-[0_0_50px_-12px_rgba(0,240,255,0.2)]">
          <h2 className="font-orbitron text-2xl text-[#00f0ff] mb-1 tracking-wide">
            ACCESS TERMINAL
          </h2>
          <p className="text-xs text-slate-400 mb-8 tracking-widest uppercase">
            Authenticate to continue
          </p>

          <form className="space-y-6" suppressHydrationWarning>
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2d6f7c] tracking-widest uppercase">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff]"><Mail size={18} /></div>
                <input type="email" suppressHydrationWarning placeholder="user@jarvis.ai" className="w-full bg-[#050b14] border border-slate-800 rounded text-slate-300 px-10 py-3 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all font-mono" />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2d6f7c] tracking-widest uppercase">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff]"><Lock size={18} /></div>
                <input type="password" suppressHydrationWarning placeholder="••••••••" className="w-full bg-[#050b14] border border-slate-800 rounded text-slate-300 px-10 py-3 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all font-mono" />
              </div>
            </div>

            <Link href="/dashboard" className="w-full block text-center bg-[#0a1025] hover:bg-[#00f0ff]/10 text-white border border-[#2563eb] py-3 rounded font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]">
             Initiate Login
            </Link>
          </form>
          
          <div className="mt-4 text-center">
             <Link href="/" className="text-xs text-[#00f0ff] hover:underline tracking-widest">
                ← RETURN TO MAIN MENU
             </Link>
          </div>
        </div>
      </div>
    </main>
  );
}