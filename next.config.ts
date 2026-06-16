import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname), // ✅ Correct: Root is a top-level Turbopack property
    rules: {
      // Custom file loaders would go here if needed later
    },
  },
};

export default nextConfig;