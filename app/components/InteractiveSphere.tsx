"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
}

export default function InteractiveSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Animation values using refs to avoid re-renders
  const hoverProgress = useRef(0);
  const rotationX = useRef(0.2); // Start with a slight tilt
  const rotationY = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

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
      const projected = particles.map((p) => {
        // Rotate around Y axis
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const sphereRadius = width * 0.28 * (1 + hoverProgress.current * 0.12);
        const fov = 400;
        const scale = fov / (fov + z2 * sphereRadius * 0.5);

        const screenX = width / 2 + x1 * sphereRadius * scale;
        const screenY = height / 2 + y2 * sphereRadius * scale;

        return {
          x: screenX,
          y: screenY,
          z: z2, // keep z for sorting (painter's algorithm)
          scale: scale,
        };
      });

      // Sort particles by depth (z-coordinate descending, back to front)
      projected.sort((a, b) => b.z - a.z);

      // Draw connections (lines) between close particles to make it look like a cluster/mesh grid
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        
        // Only connect a subset to keep it fast and clean
        const maxConnections = 3;
        let connections = 0;

        for (let j = i + 1; j < projected.length && connections < maxConnections; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          // Connect if they are physically close in screen space
          const maxDistance = width * 0.12 * (1 + hoverProgress.current * 0.1);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.08 * (p1.z + 1.2) * (p2.z + 1.2);
            // Blend color between brand cyan (#00f0ff) and active tech blue/teal
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw particle dots
      projected.forEach((p) => {
        // Size based on depth and hover scale
        const baseRadius = 2.5;
        const radius = baseRadius * p.scale * (1 + hoverProgress.current * 0.4) * (p.z + 1.5) * 0.5;

        // Draw shadow glow for hovered particles
        if (isHovered && p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${0.1 * p.scale * (p.z + 1)})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

        // Gradient color based on depth
        // Front particles are bright cyan, back particles are dark teal/blue
        const brightness = Math.max(0.2, (p.z + 1) / 2);
        const red = Math.floor(0 * brightness);
        const green = Math.floor(240 * brightness);
        const blue = Math.floor(255 * brightness);

        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.4 + brightness * 0.6})`;
        ctx.fill();
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
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.current = 0;
        mouseY.current = 0;
      }}
      onMouseMove={handleMouseMove}
      className="w-full max-w-[480px] lg:max-w-[550px] aspect-square flex items-center justify-center relative cursor-pointer overflow-hidden"
    >
      <canvas ref={canvasRef} className="block" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)]" />
      <span className="absolute bottom-4 text-[9px] font-mono text-slate-500 tracking-[0.3em] uppercase pointer-events-none select-none z-10">
        Hover to trigger node resonance
      </span>
    </div>
  );
}
