import { create } from "zustand";
import axios from "axios";
import { authService } from "@/modules/auth/services/auth.service";
import { setTokenGetter } from "@/modules/core/services/axios.instance";
import type { LoginPayload, RegistroPayload, UsuarioAutenticado } from "@/modules/auth/types/auth.types";

const SESSION_KEY = "dacate-user";

function readStoredUser(): UsuarioAutenticado | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UsuarioAutenticado) : null;
  } catch {
    return null;
  }
}

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

export const useAuthStore = create<AuthState>()((set) => {
  const storedUser = readStoredUser();
  if (storedUser) {
    // shortcut: el token real lo maneja la cookie httpOnly del backend; aquí solo guardamos el usuario
    setTokenGetter(() => null);
  }

  return {
    usuario: storedUser,
    isAuthenticated: storedUser !== null,

    login: async (payload) => {
      try {
        const res = await authService.login(payload);
        if (!res.success || !res.data) {
          throw new Error(res.message || "Error al iniciar sesión");
        }

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.data));
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
      sessionStorage.removeItem(SESSION_KEY);
      set({ usuario: null, isAuthenticated: false });
    },
  };
});
