import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    // Without this, `vite build` still succeeds but emits a generic
    // dist/server + dist/client pair with no Vercel serverless-function
    // manifest — Vercel has nothing to route requests to and serves a 404
    // for every path, even though the deployment itself shows "Ready".
    nitro({ preset: "vercel" }),
    // TanStack Start's React dev mode resolves /@react-refresh through this.
    // Without it every module request 500s and nothing hydrates.
    react(),
  ],
});
