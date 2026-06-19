"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  z: number;
}

const VULNERABLE_INDEX = 120; // Index of particle to serve as the vulnerable node

export default function InteractiveSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isVulnerableHovered, setIsVulnerableHovered] = useState(false);
  const [remediationState, setRemediationState] = useState<"vulnerable" | "remediating" | "remediated">("vulnerable");

  // Keep refs in sync for the high-performance animation loop
  const isVulnerableHoveredRef = useRef(isVulnerableHovered);
  const remediationStateRef = useRef(remediationState);

  useEffect(() => {
    isVulnerableHoveredRef.current = isVulnerableHovered;
  }, [isVulnerableHovered]);

  useEffect(() => {
    remediationStateRef.current = remediationState;
  }, [remediationState]);

  // Reset remediation state after 5 seconds of being repaired
  useEffect(() => {
    if (remediationState === "remediated") {
      const timer = setTimeout(() => {
        setRemediationState("vulnerable");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [remediationState]);

  // Animation values using refs to avoid re-renders
  const hoverProgress = useRef(0);
  const rotationX = useRef(0.2); // Start with a slight tilt
  const rotationY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const mouseCanvasX = useRef<number | null>(null);
  const mouseCanvasY = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 500;
    let height = 500;

    const resize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        width = rect.width || 500;
        height = rect.width || 500; // Keep it square
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Generate sphere particles using Fibonacci lattice
    const particleCount = 300;
    const particles: Particle[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      particles.push({ x, y, z });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate hover state smoothly
      const targetHover = isHovered ? 1 : 0;
      hoverProgress.current += (targetHover - hoverProgress.current) * 0.08;

      // Update rotation
      // Spin slowly normally, follow mouse a bit on hover
      if (isHovered) {
        rotationY.current += 0.006 + (mouseX.current / width) * 0.02;
        rotationX.current += (mouseY.current / height) * 0.01;
      } else {
        rotationY.current += 0.003;
        rotationX.current += 0.001;
      }

      const sinX = Math.sin(rotationX.current);
      const cosX = Math.cos(rotationX.current);
      const sinY = Math.sin(rotationY.current);
      const cosY = Math.cos(rotationY.current);

      // Project and collect particles to draw
      const projected = particles.map((p, index) => {
        // Rotate around Y axis
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const sphereRadius = width * 0.28 * (1 + hoverProgress.current * 0.35);
        const fov = 400;
        const scale = fov / (fov + z2 * sphereRadius * 0.5);

        const screenX = width / 2 + x1 * sphereRadius * scale;
        const screenY = height / 2 + y2 * sphereRadius * scale;

        return {
          x: screenX,
          y: screenY,
          z: z2, // keep z for sorting (painter's algorithm)
          scale: scale,
          originalIndex: index,
        };
      });

      // Find the vulnerable node coordinates before sorting
      const vulnerableProj = projected.find(
        (p) => p.originalIndex === VULNERABLE_INDEX
      );

      // Perform hover check on vulnerable particle if it's in the front hemisphere
      let isVulnerableHoveredNow = false;
      if (
        mouseCanvasX.current !== null &&
        mouseCanvasY.current !== null &&
        vulnerableProj &&
        vulnerableProj.z > -0.2
      ) {
        const dx = mouseCanvasX.current - vulnerableProj.x;
        const dy = mouseCanvasY.current - vulnerableProj.y;
        const dist = Math.hypot(dx, dy);
        
        // 20px active radius for easy interaction
        if (dist < 20) {
          isVulnerableHoveredNow = true;
        }
      }

      // Update state when transition occurs
      if (isVulnerableHoveredNow !== isVulnerableHoveredRef.current) {
        setIsVulnerableHovered(isVulnerableHoveredNow);
      }

      // Update HTML Tooltip overlay position
      if (tooltipRef.current && vulnerableProj) {
        if (isVulnerableHoveredNow) {
          tooltipRef.current.style.opacity = "1";
          tooltipRef.current.style.pointerEvents = "auto";
          tooltipRef.current.style.transform = `translate(-50%, -100%) translate(${vulnerableProj.x}px, ${vulnerableProj.y - 12}px)`;
        } else {
          tooltipRef.current.style.opacity = "0";
          tooltipRef.current.style.pointerEvents = "none";
        }
      }

      // Sort particles by depth (z-coordinate descending, back to front)
      const sortedProjected = [...projected].sort((a, b) => b.z - a.z);

      // Draw connections (lines) between close particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < sortedProjected.length; i++) {
        const p1 = sortedProjected[i];
        const maxConnections = 3;
        let connections = 0;

        for (let j = i + 1; j < sortedProjected.length && connections < maxConnections; j++) {
          const p2 = sortedProjected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          // Connect if they are physically close in screen space
          const maxDistance = width * 0.12 * (1 + hoverProgress.current * 0.1);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.08 * (p1.z + 1.2) * (p2.z + 1.2);
            
            // Highlight connections attached to the vulnerable node
            if (p1.originalIndex === VULNERABLE_INDEX || p2.originalIndex === VULNERABLE_INDEX) {
              if (remediationStateRef.current === "vulnerable") {
                ctx.strokeStyle = `rgba(255, 59, 48, ${alpha * 2})`;
              } else if (remediationStateRef.current === "remediating") {
                ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 2})`;
              } else {
                ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 2})`;
              }
            } else {
              ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw particle dots
      sortedProjected.forEach((p) => {
        const baseRadius = 2.5;
        const radius = baseRadius * p.scale * (1 + hoverProgress.current * 0.4) * (p.z + 1.5) * 0.5;

        if (p.originalIndex === VULNERABLE_INDEX) {
          // Special drawing for vulnerable / remediating / remediated node
          if (remediationStateRef.current === "vulnerable") {
            // Neon red particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = "#ff3b30";
            ctx.fill();

            // Pulsing radar ring
            const pulseRadius = radius * (2 + Math.sin(Date.now() * 0.008) * 0.5);
            ctx.beginPath();
            ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 59, 48, 0.6)";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Glow core
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 59, 48, 0.15)";
            ctx.fill();
          } else if (remediationStateRef.current === "remediating") {
            // Fast color cycling/blinking to represent remediation process
            const blink = Math.floor(Date.now() / 80) % 3;
            const colors = ["#ff3b30", "#f59e0b", "#10b981"];
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = colors[blink];
            ctx.fill();

            // Expanding wave ring
            const pulseRadius = radius * (1.2 + (Date.now() % 600) / 300);
            ctx.beginPath();
            ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 242, 254, ${1 - (Date.now() % 600) / 600})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            // Remediated Successfully (Neon Green)
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = "#10b981";
            ctx.fill();

            // Green pulsing ripple ring
            const pulseRadius = radius * (1.8 + Math.sin(Date.now() * 0.005) * 0.3);
            ctx.beginPath();
            ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(16, 185, 129, 0.7)";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Glow core
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(16, 185, 129, 0.18)";
            ctx.fill();
          }
        } else {
          // Normal particle styling
          if (isHovered && p.z > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 254, ${0.06 * p.scale * (p.z + 1)})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

          const brightness = Math.max(0.18, (p.z + 1) / 2);
          const red = Math.floor(0 * brightness);
          const green = Math.floor(242 * brightness);
          const blue = Math.floor(254 * brightness);

          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.35 + brightness * 0.65})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.current = e.clientX - rect.left - rect.width / 2;
    mouseY.current = e.clientY - rect.top - rect.height / 2;
    
    // Canvas space coordinates (relative to canvas origin)
    mouseCanvasX.current = e.clientX - rect.left;
    mouseCanvasY.current = e.clientY - rect.top;
  };

  const handleCanvasClick = () => {
    if (isVulnerableHoveredRef.current && remediationState === "vulnerable") {
      setRemediationState("remediating");
      
      // Perform automated fix transition
      setTimeout(() => {
        setRemediationState("remediated");
      }, 1500);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.current = 0;
        mouseY.current = 0;
        mouseCanvasX.current = null;
        mouseCanvasY.current = null;
        setIsVulnerableHovered(false);
      }}
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
      className="w-full max-w-[480px] lg:max-w-[550px] aspect-square flex items-center justify-center relative cursor-pointer overflow-hidden group select-none transition-transform duration-500 ease-out hover:scale-[1.15]"
    >
      <canvas ref={canvasRef} className="block" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.02)_0%,transparent_70%)]" />

      {/* HTML Tooltip Overlay */}
      <div
        ref={tooltipRef}
        className="absolute z-30 pointer-events-none opacity-0 select-none transition-all duration-200 ease-out"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -100%)",
        }}
      >
        <div 
          className={`relative px-4 py-2.5 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.8)] border backdrop-blur-md flex flex-col items-center gap-0.5 text-center min-w-[210px]
            ${remediationState === "vulnerable" ? "border-red-500/40 bg-[#090303]/95" : ""}
            ${remediationState === "remediating" ? "border-amber-500/40 bg-[#090603]/95" : ""}
            ${remediationState === "remediated" ? "border-emerald-500/40 bg-[#030906]/95" : ""}
          `}
        >
          {/* Tooltip Arrow */}
          <div 
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-r border-b backdrop-blur-md
              ${remediationState === "vulnerable" ? "border-red-500/40 bg-[#090303]/95" : ""}
              ${remediationState === "remediating" ? "border-amber-500/40 bg-[#090603]/95" : ""}
              ${remediationState === "remediated" ? "border-emerald-500/40 bg-[#030906]/95" : ""}
            `} 
          />
          
          {remediationState === "vulnerable" && (
            <>
              <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider flex items-center gap-1.5 animate-pulse uppercase">
                🚨 Vulnerability Detected
              </span>
              <span className="text-[11px] font-sans font-bold text-white flex items-center gap-1 mt-0.5">
                Click to AI Repair <ArrowRight size={10} className="text-[#00f2fe]" />
              </span>
            </>
          )}
          {remediationState === "remediating" && (
            <>
              <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider flex items-center gap-1.5 animate-pulse uppercase">
                <Sparkles size={10} className="text-[#00f2fe] animate-spin" /> Repairing Cluster
              </span>
              <span className="text-[11px] font-sans font-semibold text-slate-200 mt-0.5">
                AI Copilot applying patch...
              </span>
            </>
          )}
          {remediationState === "remediated" && (
            <>
              <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider flex items-center gap-1 uppercase">
                ✅ Cluster Secured
              </span>
              <span className="text-[11px] font-sans font-bold text-white mt-0.5">
                Remediated Successfully
              </span>
            </>
          )}
        </div>
      </div>

      <span className="absolute bottom-4 text-[9px] font-mono text-slate-500 tracking-[0.25em] uppercase pointer-events-none select-none z-10 transition-colors duration-500">
        {remediationState === "vulnerable" && "Hover compromised node & click to repair"}
        {remediationState === "remediating" && "Self-healing deployment in progress"}
        {remediationState === "remediated" && "Resonant state healthy — Cluster Secured"}
      </span>
    </div>
  );
}

