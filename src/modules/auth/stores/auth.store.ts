import { create } from "zustand";
import axios from "axios";
import { authService } from "@/modules/auth/services/auth.service";
import { setTokenGetter } from "@/modules/core/services/axios.instance";
import { idbDelete, idbGet, idbSet } from "@/modules/core/services/indexeddb";
import type { LoginPayload, RegistroPayload, UsuarioAutenticado } from "@/modules/auth/types/auth.types";

const SESSION_KEY = "dacate-user";

function parseApiErrorMessage(err: unknown, defaultMessage: string): string {
  if (axios.isAxiosError(err) && err.response?.data) {
    const data = err.response.data as { message?: string; errors?: string[] };
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(", ");
    }
    if (data.message) {
      return data.message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return defaultMessage;
}

interface AuthState {
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registro: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  usuario: null,
  isAuthenticated: false,

  login: async (payload) => {
    try {
      const res = await authService.login(payload);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al iniciar sesión");
      }

      await idbSet(SESSION_KEY, res.data);
      set({ usuario: res.data, isAuthenticated: true });
    } catch (err) {
      throw new Error(parseApiErrorMessage(err, "Error al iniciar sesión"));
    }
  },

  registro: async (payload) => {
    try {
      const res = await authService.registro(payload);
      if (!res.success) {
        throw new Error(res.message || "Error al registrarse");
      }
    } catch (err) {
      throw new Error(parseApiErrorMessage(err, "Error al registrarse"));
    }
  },

  logout: () => {
    void idbDelete(SESSION_KEY);
    set({ usuario: null, isAuthenticated: false });
  },
}));

/** Recupera el usuario de IndexedDB antes de renderizar la app. */
export async function hydrateAuth() {
  // Usar setTimeout para no bloquear el render
  setTimeout(async () => {
    const stored = await idbGet<UsuarioAutenticado>(SESSION_KEY);
    if (stored) {
      // shortcut: el token real lo maneja la cookie httpOnly del backend; aquí solo guardamos el usuario
      setTokenGetter(() => null);
      useAuthStore.setState({ usuario: stored, isAuthenticated: true });
    }
  }, 0);
}
