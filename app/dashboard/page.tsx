import { Layers } from "lucide-react";
import { redirect } from "next/navigation";

export default function DashboardRoot() {
  // This forces the user to the Overview page immediately
  redirect("/dashboard/overview");
}

// export default function DashboardPage() {
//   return (
//     <div className="h-full flex flex-col">
      
//       {/* PAGE TITLE */}
//       <div className="mb-12">
//         <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-[#00f0ff] tracking-wider mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
//           DEPLOYMENTS
//         </h1>
//         <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
//           0 ACTIVE DEPLOYMENTS
//         </p>
//       </div>

//       {/* EMPTY STATE (Grid Background) */}
//       <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg bg-[#0a0f1c]/50 relative overflow-hidden group">
        
//         {/* Subtle Inner Grid */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />

//         <div className="relative z-10 text-center">
//            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0a0f1c] border border-slate-800 mb-6 group-hover:border-[#00f0ff] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-500">
//              <Layers className="w-10 h-10 text-slate-600 group-hover:text-[#00f0ff] transition-colors" />
//            </div>
//            <h3 className="font-mono text-xl text-slate-300 mb-2">NO DEPLOYMENTS FOUND</h3>
//            <p className="text-slate-600 text-sm max-w-sm mx-auto mb-8">
//              Your cluster is currently idle. Initiate a new deployment via CLI or connect a repository.
//            </p>
           
//            <button className="px-6 py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 rounded font-bold tracking-widest text-xs transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
//              + CREATE DEPLOYMENT
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// }