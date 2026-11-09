import type { NextConfig } from "next";

/** Admin origins allowed to frame the visual editor canvas (/editor-preview). */
const adminOrigins = (process.env.NEXT_PUBLIC_ADMIN_ORIGINS ?? "http://localhost:5173,https://omp-admin-two.vercel.app")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/editor-preview",
        headers: [
          { key: "Content-Security-Policy", value: `frame-ancestors ${adminOrigins.join(" ")}` },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
