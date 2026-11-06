import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig, type Plugin } from "vite";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

const rootDir = import.meta.dirname;

/** Lista recursivamente los ficheros de un directorio (relativos, con "/"). */
function listFiles(dir: string, base = dir): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return listFiles(full, base);
    return [`/${path.relative(base, full).split(path.sep).join("/")}`];
  });
}

/**
 * Genera el Service Worker a partir de `src/sw/sw.js`, inyectando el manifiesto
 * de pre-cache con los ficheros reales del build (JS/CSS hashados, fuentes,
 * iconos y ficheros de `public/`).
 */
function dacateServiceWorker(): Plugin {
  const swPath = path.resolve(rootDir, "src/sw/sw.js");
  const publicDir = path.resolve(rootDir, "public");

  return {
    name: "dacate-service-worker",
    apply: "build",
    generateBundle(_options, bundle) {
      const urls = new Set<string>();

      // Ficheros generados por el build (index.html, assets/*).
      for (const fileName of Object.keys(bundle)) {
        urls.add(`/${fileName}`);
      }

      // Ficheros estaticos de public/.
      for (const file of listFiles(publicDir)) {
        urls.add(file);
      }

      const precache = Array.from(urls)
        .filter((url) => url !== "/sw.js")
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
});
