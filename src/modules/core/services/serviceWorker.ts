/**
 * Registro y control del Service Worker de Dacate.
 *
 * La SW solo se activa en produccion: en desarrollo cachear el bundle de Vite
 * provoca recargas obsoletas.
 */

const SW_URL = "/sw.js";
const SW_SCOPE = "/";
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hora
const CLEANUP_SYNC_TAG = "dacate-cache-cleanup";

export interface ServiceWorkerOptions {
  /** Se dispara cuando hay una version nueva lista para activarse. */
  onUpdateReady?: (registration: ServiceWorkerRegistration) => void;
}

let registration: ServiceWorkerRegistration | null = null;
let updateAvailable = false;

export function isServiceWorkerSupported(): boolean {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator;
}

/** Registra el Service Worker y gestiona su ciclo de vida. */
export function registerServiceWorker(
  options: ServiceWorkerOptions = {},
): void {
  if (!isServiceWorkerSupported()) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register(SW_URL, { scope: SW_SCOPE })
        .then(async (reg) => {
          registration = reg;

          reg.addEventListener("updatefound", () => {
            const installingWorker = reg.installing;
            if (!installingWorker) return;

            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                updateAvailable = true;
                options.onUpdateReady?.(reg);
              }
            });
          });

          // Buscar actualizaciones de forma periodica.
          window.setInterval(() => {
            void reg.update();
          }, UPDATE_INTERVAL);

          // Limpieza periodica de las caches (si el navegador lo soporta).
          try {
            const sync = (
              reg as ServiceWorkerRegistration & {
                periodicSync?: { register(tag: string): Promise<void> };
              }
            ).periodicSync;
            if (sync) await sync.register(CLEANUP_SYNC_TAG);
          } catch {
            // periodicSync no disponible: la limpieza ocurre al activar la SW.
          }
        })
        .catch((error: unknown) => {
          console.warn(
            "[dacate] No se pudo registrar el Service Worker:",
            error,
          );
        });
    },
    { once: true },
  );
}

/** Activa la version pendiente de la Service Worker. */
export function applyServiceWorkerUpdate(): void {
  if (!registration?.waiting) return;
  registration.waiting.postMessage({ type: "SKIP_WAITING" });
}

/** Indica si hay una actualizacion pendiente de aplicar. */
export function hasServiceWorkerUpdate(): boolean {
  return updateAvailable;
}

/**
 * Limpia la cache de la API. Se usa al cerrar sesion para no servir datos de
 * una cuenta a otra en el mismo dispositivo.
 */
export function clearServiceWorkerApiCache(): void {
  navigator.serviceWorker?.controller?.postMessage({ type: "CLEAR_API_CACHE" });
}

/** Precachea de forma explicita una lista de URLs. */
export function precacheServiceWorkerUrls(urls: string[]): void {
  if (!urls.length) return;
  navigator.serviceWorker?.controller?.postMessage({
    type: "CACHE_URLS",
    urls,
  });
}

/** Devuelve el identificador de build de la Service Worker activa. */
export function getServiceWorkerVersion(): Promise<string | null> {
  if (!isServiceWorkerSupported()) return Promise.resolve(null);

  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => resolve(null), 2000);

    channel.port1.onmessage = (event: MessageEvent) => {
      window.clearTimeout(timeout);
      resolve((event.data as { buildId?: string } | null)?.buildId ?? null);
    };

    navigator.serviceWorker.controller?.postMessage({ type: "GET_VERSION" }, [
      channel.port2,
    ]);
  });
}

/**
 * Publica el estado de conexion en `document.documentElement.dataset.online`
 * y mediante el evento `dacate:connection-change`.
 */
export function watchConnectionStatus(): void {
  if (typeof window === "undefined") return;

  const publish = () => {
    const online = navigator.onLine;
    document.documentElement.dataset.online = online ? "true" : "false";
    window.dispatchEvent(
      new CustomEvent("dacate:connection-change", { detail: { online } }),
    );
  };

  window.addEventListener("online", publish);
  window.addEventListener("offline", publish);
  publish();
}
