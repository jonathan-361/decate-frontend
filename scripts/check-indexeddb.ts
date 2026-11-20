// Self-check del helper de IndexedDB con un stub minimo en memoria.
// Ejecutar: node scripts/check-indexeddb.ts
import assert from "node:assert/strict";
import { idbDelete, idbGet, idbSet } from "../src/modules/core/services/indexeddb.ts";

type Handler = ((event?: unknown) => void) | null;

function makeIndexedDB(data: Map<string, unknown>) {
  return {
    open(_name: string, _version: number) {
      const request: any = { onsuccess: null, onerror: null, onupgradeneeded: null };
      request.result = {
        objectStoreNames: { contains: (name: string) => name === "kv" },
        createObjectStore: () => undefined,
        transaction: () => {
          const tx: any = { oncomplete: null, onerror: null, onabort: null };
          tx.objectStore = () => ({
            get(key: string) {
              const req: any = { onsuccess: null, onerror: null };
              req.result = data.get(key);
              queueMicrotask(() => req.onsuccess?.());
              return req;
            },
            put(value: unknown, key: string) {
              data.set(key, value);
              queueMicrotask(() => tx.oncomplete?.());
              return { onsuccess: null, onerror: null };
            },
            delete(key: string) {
              data.delete(key);
              queueMicrotask(() => tx.oncomplete?.());
              return { onsuccess: null, onerror: null };
            },
          });
          return tx;
        },
      };
      queueMicrotask(() => request.onsuccess?.());
      return request;
    },
  };
}

// 1) Sin IndexedDB la app sigue viva (no lanza).
(globalThis as any).indexedDB = {
  open() {
    throw new Error("IndexedDB no disponible");
  },
};
assert.equal(await idbGet<string>("dacate-theme"), undefined, "sin IndexedDB devuelve undefined");
await idbSet("dacate-theme", "light");

// 2) Con IndexedDB: guardar, leer y borrar.
const data = new Map<string, unknown>();
(globalThis as any).indexedDB = makeIndexedDB(data);

await idbSet("dacate-theme", "dark");
assert.equal(await idbGet<string>("dacate-theme"), "dark", "guarda y lee el tema");

const usuario = { id: 1, nombre: "Ana", correo: "ana@decate.dev" };
await idbSet("dacate-user", usuario);
assert.deepEqual(await idbGet("dacate-user"), usuario, "guarda y lee el usuario");

await idbDelete("dacate-theme");
assert.equal(await idbGet<string>("dacate-theme"), undefined, "borra la clave");

console.log("check-indexeddb: ok");
