import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  // GitHub Pages er eneste miljø som publiserer appen under en undermappe.
  // Cloudflare Pages, custom domain og lokal kjøring bruker rotstien "/".
  const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

  return {
    plugins: [react()],
    base: isGitHubPages ? "/ms-website/" : "/",
  };
});
