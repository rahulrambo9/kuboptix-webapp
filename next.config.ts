import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "10.5.0.2",
    "10.5.0.2:3000",
    "10.5.0.2:3001",
    "localhost",
    "localhost:3000",
    "localhost:3001"
  ],
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
