/**
 * Service Worker de Dacate.
 *
 * El SW no usa una unica estrategia: cada tipo de recurso recibe la politica
 * que mejor encaja con su perfil de uso.
 *
 *   | Tipo de recurso        | Estrategia                              | Cache            |
 *   |-------------------------|-----------------------------------------|------------------|
 *   | App shell (instalacion)| Precache (Promise.all + put)            | `precache`       |
 *   | Documentos (navegacion) | Network First + timeout + fallback SPA  | `precache`       |
 *   | Build assets (`/assets`)| Cache First (contenido inmutable)       | `assets`         |
 *   | Iconos / imagenes       | Stale While Revalidate                  | `images`         |
 *   | API (GET, mismo origen) | Network First + TTL de 5 min            | `api`            |
 *   | API (mutaciones)        | Network only (nunca se cachean)         | -                |
 *   | Fuentes / estaticos     | Stale While Revalidate                  | `runtime`        |
 *   | Cualquier otra cosa     | Sin interceptar (la resuelve el navegador) | -             |
 *
 * Los valores de precache y de build se inyectan en el bundle final mediante
 * el plugin de Vite (`vite.config.ts`).
 *
 * Actualizaciones: la version nueva NO se activa sola. Queda en espera hasta
 * que la pagina envia `SKIP_WAITING` (ver `applyServiceWorkerUpdate`).
 */

const BUILD_ID = "__BUILD_ID__";
const PRECACHE_MANIFEST = self.__PRECACHE_MANIFEST__ ?? [];

const CACHE_PREFIX = "dacate";
const CACHES = {
  precache: `${CACHE_PREFIX}-precache-${BUILD_ID}`,
  assets: `${CACHE_PREFIX}-assets-${BUILD_ID}`,
  runtime: `${CACHE_PREFIX}-runtime-${BUILD_ID}`,
  images: `${CACHE_PREFIX}-images-${BUILD_ID}`,
  api: `${CACHE_PREFIX}-api-${BUILD_ID}`,
};

/** Shell minimo que siempre debe estar disponible sin red. */
const CORE_SHELL = ["/", "/index.html", "/manifest.json", "/offline.html"];

/** Rutas que SI son HTML: el resto del precache no deberia serlo. */
const HTML_PRECACHE_URLS = new Set(["/", "/index.html", "/offline.html"]);

const PRECACHE_URLS = Array.from(
  new Set([
    ...CORE_SHELL,
    ...(Array.isArray(PRECACHE_MANIFEST) ? PRECACHE_MANIFEST : []),
  ]),
);

const API_MAX_AGE = 5 * 60 * 1000; // 5 minutos
const NAVIGATION_TIMEOUT = 1500; // 1.5 segundos
const API_TIMEOUT = 4000; // 4 segundos
const IMAGE_CACHE_LIMIT = 60;
const API_CACHE_LIMIT = 80;

/* ------------------------------------------------------------------ *
 * Utilidades
 * ------------------------------------------------------------------ */

/** Devuelve true si la peticion corresponde a la API de la aplicacion. */
function isApiRequest(request, url) {
  const accept = request.headers.get("accept") || "";
  if (accept.includes("application/json")) return true;

  return (
    url.pathname.startsWith("/api/") ||
    url.pathname === "/api" ||
    url.pathname.startsWith("/graphql")
  );
}

/** Clasifica un recurso estatico (fuentes, css, js suelto, imagenes...). */
function isStaticAsset(url) {
  return /\.(?:css|js|mjs|woff2?|ttf|otf|eot|svg|png|jpe?g|webp|gif|avif|ico|webmanifest|json)$/i.test(
    url.pathname,
  );
}

function isImageRequest(url) {
  return /\.(?:svg|png|jpe?g|webp|gif|avif|ico)$/i.test(url.pathname);
}

/**
 * Con el fallback de SPA de Cloudflare, un archivo que no existe devuelve
 * index.html con 200. Esto detecta ese caso para no cachearlo como si fuera
 * un JS, CSS o imagen.
 */
function isHtmlResponse(response) {
  return (response.headers.get("content-type") || "").includes("text/html");
}

/** Clona una respuesta anadiendo la marca de tiempo de cache. */
async function withTimestamp(response) {
  const body = await response.clone().blob();
  const headers = new Headers(response.headers);
  headers.set("x-sw-cached-at", String(Date.now()));
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** Indica si una respuesta cacheada sigue siendo valida. */
function isFresh(response, maxAge) {
  const cachedAt = Number(response.headers.get("x-sw-cached-at"));
  if (!cachedAt) return false;
  return Date.now() - cachedAt < maxAge;
}

/** fetch con timeout usando AbortController. */
async function fetchWithTimeout(request, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Elimina las entradas mas antiguas de un cache cuando supera el limite. */
async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  const excess = keys.length - limit;
  for (let i = 0; i < excess; i += 1) {
    await cache.delete(keys[i]);
  }
}

/** Responde con un 503 sintetico cuando no hay nada que devolver. */
function offlineResponse(message = "Sin conexion") {
  return new Response(message, {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/* ------------------------------------------------------------------ *
 * Estrategias de cache
 * ------------------------------------------------------------------ */

/** Cache First: ideal para recursos con hash (immutables). */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (
    response &&
    response.ok &&
    response.type !== "opaque" &&
    !isHtmlResponse(response)
  ) {
    await cache.put(request, response.clone());
  }
  return response;
}

/** Stale While Revalidate: sirve la version cacheada y refresca en segundo plano. */
async function staleWhileRevalidate(request, cacheName, event) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then(async (response) => {
      if (
        response &&
        response.ok &&
        response.type !== "opaque" &&
        !isHtmlResponse(response)
      ) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Refresco en segundo plano, sin bloquear la respuesta.
    if (event && typeof event.waitUntil === "function")
      event.waitUntil(networkPromise);
    return cached;
  }

  const response = await networkPromise;
  if (response) return response;
  throw new Error("offline");
}

/** Network First con timeout: prioriza datos frescos y cae en la cache. */
async function networkFirst(
  request,
  cacheName,
  { timeout = API_TIMEOUT, maxAge = null } = {},
) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetchWithTimeout(request, timeout);
    if (response && response.ok && response.type !== "opaque") {
      const stored = maxAge
        ? await withTimestamp(response.clone())
        : response.clone();
      await cache.put(request, stored);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      // Si esta expirada (`!isFresh`) igual se sirve: es el ultimo recurso offline.
      if (maxAge && !isFresh(cached, maxAge)) return cached;
      return cached;
    }
    throw new Error("offline");
  }
}

/**
 * Navegaciones (HTML): Network First rapido, con fallback al shell cacheado
 * para que las rutas de la SPA (/tasks, /calendar...) funcionen sin conexion.
 */
async function handleNavigation(event) {
  const { request } = event;
  const cache = await caches.open(CACHES.precache);

  const loadFromNetwork = async () => {
    const preloaded = await event.preloadResponse;
    if (preloaded) return preloaded;
    return fetchWithTimeout(request, NAVIGATION_TIMEOUT);
  };

  try {
    const response = await loadFromNetwork();
    if (response && response.ok) return response;
    throw new Error("bad response");
  } catch {
    const shell =
      (await cache.match("/index.html")) ||
      (await cache.match("/")) ||
      (await cache.match("/offline.html"));
    return shell || offlineResponse();
  }
}

/* ------------------------------------------------------------------ *
 * Ciclo de vida del Service Worker
 * ------------------------------------------------------------------ */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHES.precache);

      // Se espera a que termine TODO el precache antes de dar la instalacion
      // por buena (antes se usaba forEach(async ...) y no esperaba nada).
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(new Request(url, { cache: "reload" }));
            const esperaHtml = HTML_PRECACHE_URLS.has(url);
            if (
              response &&
              response.ok &&
              (esperaHtml || !isHtmlResponse(response))
            ) {
              await cache.put(url, response);
            }
          } catch {
            /* recurso no disponible en este momento */
          }
        }),
      );

      // Sin skipWaiting(): la version nueva espera a que el usuario la acepte
      // (mensaje SKIP_WAITING). En la primera instalacion no hay SW previa,
      // asi que se activa sola.
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith(CACHE_PREFIX) &&
              !Object.values(CACHES).includes(key),
          )
          .map((key) => caches.delete(key)),
      );

      try {
        if (self.registration.navigationPreload) {
          await self.registration.navigationPreload.enable();
        }
      } catch {
        // Navegacion preload no soportada: se usara fetch directo.
      }

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (data.type === "GET_VERSION") {
    event.source?.postMessage({ type: "VERSION", buildId: BUILD_ID });
    return;
  }

  if (data.type === "CACHE_URLS") {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHES.runtime);
        const urls = Array.isArray(data.urls) ? data.urls : [];
        await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await fetch(
                new Request(url, { cache: "reload" }),
              );
              if (response && response.ok) await cache.put(url, response);
            } catch {
              /* ignore */
            }
          }),
        );
        event.source?.postMessage({
          type: "CACHE_URLS_DONE",
          count: urls.length,
        });
      })(),
    );
    return;
  }

  if (data.type === "CLEAR_API_CACHE") {
    event.waitUntil(
      (async () => {
        await caches.delete(CACHES.api);
        event.source?.postMessage({ type: "API_CACHE_CLEARED" });
      })(),
    );
  }
});

/* ------------------------------------------------------------------ *
 * Enrutado de peticiones
 * ------------------------------------------------------------------ */

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return; // las mutaciones siempre van a la red

  // Sondas del navegador de solo cache: no se pueden resolver con fetch().
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
    return;
  }

  const url = new URL(request.url);

  // No interceptamos otros origenes que no sean la propia app
  // (p.ej. Unsplash o el backend en onrender.com).
  if (url.origin !== self.location.origin) return;

  // Peticiones con rango (video/audio) requieren streaming: no cacheamos.
  if (request.headers.has("range")) return;

  // Navegaciones -> Network First con fallback al shell de la SPA.
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }

  // API -> Network First con TTL. Solo aplica si la API vive en el mismo origen.
  if (isApiRequest(request, url)) {
    event.respondWith(
      networkFirst(request, CACHES.api, {
        timeout: API_TIMEOUT,
        maxAge: API_MAX_AGE,
      }).catch(() => offlineResponse("offline")),
    );
    return;
  }

  // Build assets (hash en el nombre) -> Cache First, son inmutables.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      cacheFirst(request, CACHES.assets).catch(() => offlineResponse()),
    );
    return;
  }

  // Imagenes e iconos -> Stale While Revalidate.
  if (isImageRequest(url)) {
    event.respondWith(
      staleWhileRevalidate(request, CACHES.images, event).catch(() =>
        offlineResponse(),
      ),
    );
    event.waitUntil(trimCache(CACHES.images, IMAGE_CACHE_LIMIT));
    return;
  }

  // Resto de estaticos (fuentes, css, manifest...) -> Stale While Revalidate.
  if (isStaticAsset(url)) {
    event.respondWith(
      staleWhileRevalidate(request, CACHES.runtime, event).catch(() =>
        offlineResponse(),
      ),
    );
    return;
  }

  // Cualquier otra peticion: no se intercepta. La resuelve el navegador y no
  // aparecen errores del SW en DevTools (antes: respondWith(fetch(request))).
});

// Limpieza periodica de caches cuando la SW queda inactiva.
self.addEventListener("periodicsync", (event) => {
  if (event.tag !== "dacate-cache-cleanup") return;
  event.waitUntil(
    (async () => {
      await trimCache(CACHES.images, IMAGE_CACHE_LIMIT);
      await trimCache(CACHES.api, API_CACHE_LIMIT);
    })(),
  );
});

/* ------------------------------------------------------------------ *
 * Notificaciones locales
 * ------------------------------------------------------------------ */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/tasks";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});

/** Una respuesta que viene de una redirección no se puede servir a una navegación. */
async function cleanCopy(response) {
  if (!response.redirected) return response;
  return new Response(await response.blob(), {
    status: 200,
    statusText: "OK",
    headers: response.headers,
  });
}
