import type { NextConfig } from "next";
import { REMOTE_IMAGE_HOSTS } from "./src/lib/remote-images";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image.
  output: "standalone",
  // This app is not an npm workspace: without these, the lockfile in the repo
  // root makes Next.js treat the parent folder as the project root.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  cacheComponents: true,
  cacheLife: {
    // Blog data from the API. `expire` stays under 1 hour because
    // Notion-hosted image URLs inside the content expire after ~1 hour.
    notion: {
      stale: 60 * 5,
      revalidate: 60 * 15,
      expire: 60 * 45,
    },
  },
  images: {
    remotePatterns: REMOTE_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
