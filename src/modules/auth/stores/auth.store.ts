import axios from "axios";
import { create } from "zustand";
import { authService } from "@/modules/auth/services/auth.service";
import { profileService } from "@/modules/users/services/profile.service";
import { setTokenGetter } from "@/modules/core/services/axios.instance";
import { getErrorMessage } from "@/modules/core/services/api-error";
import { idbDelete, idbGet, idbSet } from "@/modules/core/services/indexeddb";
import type {
  LoginPayload,
  RegistroPayload,
  UsuarioAutenticado,
} from "@/modules/auth/types/auth.types";

const SESSION_KEY = "dacate-user";
const TASKS_KEY = "dacate-tasks";
const OUTBOX_KEY = "dacate-tasks-outbox";
const PROFILE_KEY = "dacate-profile";

interface AuthState {
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registro: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  usuario: null,
  isAuthenticated: false,
  isHydrated: false,

  login: async (payload) => {
    try {
      const res = await authService.login(payload);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al iniciar sesión");
      }

      await idbSet(SESSION_KEY, res.data);
      set({ usuario: res.data, isAuthenticated: true, isHydrated: true });
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al iniciar sesión"));
    }
  },

  registro: async (payload) => {
    try {
      const res = await authService.registro(payload);
      if (!res.success) {
        throw new Error(res.message || "Error al registrarse");
      }
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al registrarse"));
    }
  },

  logout: () => {
    void idbDelete(SESSION_KEY);
    // Borra la copia local de tareas y perfil para no mostrarlas a otra cuenta en este dispositivo.
    void idbDelete(TASKS_KEY);
    void idbDelete(OUTBOX_KEY);
    void idbDelete(PROFILE_KEY);
    void import("@/modules/tasks/stores/task.store").then((m) =>
      m.useTaskStore.setState({ tasks: [] })
    );
    void import("@/modules/exams/stores/exam.store").then((m) =>
      m.useExamStore.getState().clear()
    );
    void import("@/modules/reminders/stores/notification.store").then((m) =>
      m.useNotificationStore.getState().clear()
    );
    void import("@/modules/core/services/notifications").then((m) =>
      m.clearNotifiedState()
    );
    void import("@/modules/users/stores/profile.store").then((m) =>
      m.useProfileStore.setState({ perfil: null })
    );
    set({ usuario: null, isAuthenticated: false, isHydrated: true });
  },
}));

/** Recupera el usuario de IndexedDB y verifica que la cookie de sesión siga activa en el backend. */
export async function hydrateAuth() {
  try {
    const stored = await idbGet<UsuarioAutenticado>(SESSION_KEY);
    if (!stored) {
      useAuthStore.setState({ isHydrated: true });
      return;
    }

    // shortcut: el token real lo maneja la cookie httpOnly del backend; aquí solo guardamos el usuario
    setTokenGetter(() => null);

    try {
      const res = await profileService.getPerfil();
      if (res.success && res.data) {
        const usuario: UsuarioAutenticado = {
          id: res.data.id ?? stored.id,
          nombre: res.data.nombre,
          correo: res.data.correo,
        };
        await idbSet(SESSION_KEY, usuario);
        useAuthStore.setState({ usuario, isAuthenticated: true, isHydrated: true });
        return;
      }
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        (err.response?.status === 401 || err.response?.status === 403)
      ) {
        useAuthStore.getState().logout();
        return;
      }
      // Sin conexión o error temporal de red: se conserva la sesión local para uso offline.
      useAuthStore.setState({ usuario: stored, isAuthenticated: true, isHydrated: true });
      return;
    }

    useAuthStore.getState().logout();
  } catch {
    useAuthStore.setState({ isHydrated: true });
  }
}