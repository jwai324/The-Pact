import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH is set by the GitHub Pages workflow to "/<repo>/" so assets
// resolve under the project-page subpath. Defaults to "/" for local dev,
// Vercel, Netlify, Cloudflare Pages, or a custom domain.
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  server: { host: true },
});
