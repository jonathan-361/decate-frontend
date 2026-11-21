import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, type Plugin } from "vite";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

const rootDir = import.meta.dirname;

/**
 * Genera el Service Worker a partir de `src/sw/sw.js`, inyectando el manifiesto
 * de pre-cache con el shell y los assets iniciales del build.
 */
function dacateServiceWorker(): Plugin {
  const swPath = path.resolve(rootDir, "src/sw/sw.js");

  return {
    name: "dacate-service-worker",
    apply: "build",
    generateBundle(_options, bundle) {
      const initialChunks = new Set<string>();
      const initialCss = new Set<string>();

      const collectInitialChunk = (fileName: string) => {
        if (initialChunks.has(fileName)) return;
        initialChunks.add(fileName);

        const chunk = bundle[fileName];
        if (!chunk || chunk.type !== "chunk") return;

        for (const imported of chunk.imports) {
          collectInitialChunk(imported);
        }
        for (const css of chunk.viteMetadata?.importedCss ?? []) {
          initialCss.add(css);
        }
      };

      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type === "chunk" && output.isEntry) {
          collectInitialChunk(fileName);
        }
      }

      const precache = Array.from(initialChunks)
        .map((fileName) => `/${fileName}`)
        .concat(Array.from(initialCss, (fileName) => `/${fileName}`))
        .concat("/index.html")
        .sort();

      const buildId = createHash("sha256")
        .update(precache.join("|"))
        .update(readFileSync(swPath, "utf8"))
        .digest("hex")
        .slice(0, 12);

      const source = readFileSync(swPath, "utf8")
        .replace("self.__PRECACHE_MANIFEST__", JSON.stringify(precache, null, 2))
        .replaceAll("__BUILD_ID__", buildId);

      this.emitFile({ type: "asset", fileName: "sw.js", source });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    dacateServiceWorker(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router") || id.includes("react-dom") || id.includes("/react/") || id.endsWith("/react")) {
              return "vendor-react";
            }
            if (id.includes("@base-ui")) {
              return "vendor-base-ui";
            }
            if (id.includes("lucide-react")) {
              return "vendor-lucide-react";
            }
            if (id.includes("zod")) {
              return "vendor-zod";
            }
            if (id.includes("axios")) {
              return "vendor-axios";
            }
          }
        },
      },
    },
  },
});
