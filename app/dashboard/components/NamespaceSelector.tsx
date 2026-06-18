"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useNamespace } from "./NamespaceContext";

// ✅ THE WORD "default" IS REQUIRED HERE
export default function NamespaceSelector() {
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const { selectedNamespace, setSelectedNamespace } = useNamespace();

  useEffect(() => {
    fetch("http://localhost:8000/api/namespaces")
      .then((res) => res.json())
      .then((data) => {
        const nsList = ["all", ...data.filter((ns: string) => ns !== "all")];
        setNamespaces(nsList);
        
        // If context is "default" but it doesn't exist, select the first namespace
        if (selectedNamespace === "default" && !data.includes("default")) {
          if (data.length > 0) {
            setSelectedNamespace(data[0]);
          } else {
            setSelectedNamespace("all");
          }
        }
      })
      .catch((err) => console.error("Failed to load namespaces", err));
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-r border-slate-800/50 mr-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Filter className="w-4 h-4" />
        <span className="text-[10px] font-mono tracking-widest uppercase">NAMESPACE</span>
      </div>

      <div className="relative group">
        <select 
          value={selectedNamespace}
          onChange={(e) => setSelectedNamespace(e.target.value)}
          className="appearance-none bg-[#0a0f1c] border border-slate-700 text-[#00f0ff] text-xs font-mono font-bold py-1 px-3 pr-8 rounded focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all cursor-pointer uppercase min-w-[120px]"
        >
          {namespaces.map((ns) => (
            <option key={ns} value={ns}>
              {ns}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#00f0ff]">
          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}