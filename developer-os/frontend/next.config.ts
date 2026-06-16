import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the markdown knowledge base is bundled with the AI route's
  // serverless function (needed on platforms like Vercel).
  outputFileTracingIncludes: {
    "/api/ai/chat": ["./content/**/*"],
  },
};

export default nextConfig;
