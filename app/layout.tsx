import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google"; 
import "./globals.css";
// 1. Import the background here
import ParticlesBackground from "./components/ParticlesBackground";

// 1. Load the Sci-Fi Font (Orbitron)
const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron", 
  display: "swap",
});

// 2. Load the Standard Font (Inter)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kuboptix — Autonomous Kubernetes Operations Platform",
  description:
    "Advanced cluster visualization and autonomous management interface. Monitor pod health, optimize resource allocation, and detect anomalies in real-time across distributed containerized fleets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Here we apply the dark background color: bg-[#020617] 
         And we apply the fonts variables so we can use them later.
      */}
      
      <body className={`${inter.variable} ${orbitron.variable} bg-[#020617] text-white antialiased`}>
        {/* 2. Place the background HERE, behind the children */}
        <ParticlesBackground />
        {children}
      </body>
    </html>
  );
}