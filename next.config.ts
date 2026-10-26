import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise l'accès au serveur de développement depuis l'hébergement
  // de prévisualisation (proxy), en plus de localhost.
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
