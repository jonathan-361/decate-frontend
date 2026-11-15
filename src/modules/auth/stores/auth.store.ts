import { create } from "zustand";
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

interface AuthState {
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registro: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => {
  // Restaurar sesión si existe en sessionStorage
  const storedUser = readStoredUser();
  if (storedUser) {
    // shortcut: el token real lo maneja la cookie httpOnly del backend; aquí solo guardamos el usuario
    setTokenGetter(() => null);
  }

  return {
    usuario: storedUser,
    isAuthenticated: storedUser !== null,

    login: async (payload) => {
      const res = await authService.login(payload);
      if (!res.success || !res.data) throw new Error(res.message);

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.data));
      set({ usuario: res.data, isAuthenticated: true });
    },

    registro: async (payload) => {
      const res = await authService.registro(payload);
      if (!res.success) throw new Error(res.message);
    },

    logout: () => {
      sessionStorage.removeItem(SESSION_KEY);
      set({ usuario: null, isAuthenticated: false });
    },
  };
});
