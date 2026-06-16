"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        className="absolute inset-0 -z-10" // Ensures it stays way in the back
        options={{
          background: {
            color: {
              value: "transparent", // Transparent so the dark blue CSS background shows through
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#00f0ff", // CYAN
            },
            links: {
              color: "#00f0ff",
              distance: 120,
              enable: true,
              opacity: 0.10, // <--- REDUCED CONTRAST (Was 0.5)
              width: 3,
            },
            move: {
              enable: true,
              speed: 0.9, // Slower movement for less distraction
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "bounce",
              },
            },
            number: {
              density: {
                enable: true,
                  width: 1000,    // Container width in pixels
                  height: 1000,   // Container height in pixels
              },
              value: 70, // Fewer particles (Was 80)
            },
            opacity: {
              value: 0.3, // <--- REDUCED CONTRAST (Was 0.5)
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 2, max: 3 }, // Smaller dots
            },
          },
          detectRetina: true,
        }}
      />
    );
  }

  return <></>;
}