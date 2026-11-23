import { create } from "zustand";
import { toast } from "sonner";
import { taskService } from "@/modules/tasks/services/task.service";
import { getErrorMessage } from "@/modules/core/services/api-error";
import { idbDelete, idbGet, idbSet } from "@/modules/core/services/indexeddb";
import type { Task, TaskPayload } from "@/modules/tasks/schemas";

/** Clave de IndexedDB con la ultima copia de las tareas del usuario. */
export const TASKS_KEY = "dacate-tasks";
export const OUTBOX_KEY = "dacate-tasks-outbox";

interface OutboxTask {
  tempId: number;
  payload: TaskPayload;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (payload: TaskPayload) => Promise<void>;
  updateTask: (id: number, payload: Partial<TaskPayload>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  syncPendingTasks: () => Promise<void>;
}

let inFlightFetch: Promise<void> | null = null;

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    if (inFlightFetch) return inFlightFetch;

    inFlightFetch = (async () => {
      set({ isLoading: true, error: null });

      // 1. Muestra al instante la ultima copia guardada (si existe).
      const guardadas = await idbGet<Task[]>(TASKS_KEY);
      if (guardadas && get().tasks.length === 0) {
        set({ tasks: guardadas });
      }

      // 2. Pide las tareas al servidor y actualiza la copia.
      try {
        const { success, message, data } = await taskService.getAll();
        if (!success || !data) throw new Error(message);
        set({ tasks: data, isLoading: false, error: null });
        void idbSet(TASKS_KEY, data);
      } catch (err) {
        // Si estamos offline o el fallo es de red (Network Error), NO mostramos error bloqueante:
        // se muestran las tareas locales (o array vacío si no hay ninguna)
        const isOffline =
          !navigator.onLine ||
          (err instanceof Error &&
            (err.message.includes("Network Error") ||
              err.message.includes("offline")));

        if (isOffline || guardadas !== undefined) {
          set({
            error: null,
            isLoading: false,
            tasks: guardadas ?? [],
          });
          return;
        }

        const msg = getErrorMessage(err, "No se pudieron cargar las tareas");
        set({ error: msg, isLoading: false });
        toast.error(msg);
      } finally {
        inFlightFetch = null;
      }
    })();

    return inFlightFetch;
  },

  createTask: async (payload) => {
    // Si estamos sin conexión directamente: guardar localmente y encolar
    if (!navigator.onLine) {
      const tempId = -Date.now();
      const localTask: Task = {
        id: tempId,
        titulo: payload.titulo,
        descripcion: payload.descripcion ?? "",
        materia: payload.materia,
        fechaEntrega: payload.fechaEntrega,
        hora: payload.hora,
        prioridad: payload.prioridad,
        estado: payload.estado,
        usuarioId: 0,
      };

      const updated = [...get().tasks, localTask];
      set({ tasks: updated });
      void idbSet(TASKS_KEY, updated);

      const outbox = (await idbGet<OutboxTask[]>(OUTBOX_KEY)) ?? [];
      void idbSet(OUTBOX_KEY, [...outbox, { tempId, payload }]);
      return;
    }

    try {
      const { success, message, data } = await taskService.create(payload);
      if (!success || !data) throw new Error(message);
      set((s) => ({ tasks: [...s.tasks, data] }));
      void idbSet(TASKS_KEY, get().tasks);
    } catch (err) {
      // Si la petición falló por red (corte justo al enviar), guardar en outbox
      const isNetError =
        err instanceof Error &&
        (err.message.includes("Network Error") ||
          err.message.includes("offline"));

      if (isNetError) {
        const tempId = -Date.now();
        const localTask: Task = {
          id: tempId,
          titulo: payload.titulo,
          descripcion: payload.descripcion ?? "",
          materia: payload.materia,
          fechaEntrega: payload.fechaEntrega,
          hora: payload.hora,
          prioridad: payload.prioridad,
          estado: payload.estado,
          usuarioId: 0,
        };

        const updated = [...get().tasks, localTask];
        set({ tasks: updated });
        void idbSet(TASKS_KEY, updated);

        const outbox = (await idbGet<OutboxTask[]>(OUTBOX_KEY)) ?? [];
        void idbSet(OUTBOX_KEY, [...outbox, { tempId, payload }]);
        return;
      }
      throw new Error(getErrorMessage(err, "Error al crear la tarea"));
    }
  },

  updateTask: async (id, payload) => {
    try {
      const { success, message, data } = await taskService.update(id, payload);
      if (!success || !data) throw new Error(message);
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? data : t)) }));
      void idbSet(TASKS_KEY, get().tasks);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al actualizar la tarea"));
    }
  },

  deleteTask: async (id) => {
    try {
      const { success, message } = await taskService.remove(id);
      if (!success) throw new Error(message);
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      void idbSet(TASKS_KEY, get().tasks);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al eliminar la tarea"));
    }
  },

  syncPendingTasks: async () => {
    if (!navigator.onLine) return;
    const outbox = await idbGet<OutboxTask[]>(OUTBOX_KEY);
    if (!outbox || outbox.length === 0) return;

    const remaining: OutboxTask[] = [];
    let syncedCount = 0;

    for (const item of outbox) {
      try {
        const res = await taskService.create(item.payload);
        if (res.success && res.data) {
          set((s) => ({
            tasks: s.tasks.map((t) => (t.id === item.tempId ? res.data! : t)),
          }));
          syncedCount++;
        } else {
          remaining.push(item);
        }
      } catch {
        remaining.push(item);
      }
    }

    void idbSet(TASKS_KEY, get().tasks);
    if (remaining.length > 0) {
      void idbSet(OUTBOX_KEY, remaining);
    } else {
      void idbDelete(OUTBOX_KEY);
    }

    if (syncedCount > 0) {
      toast.success(
        syncedCount === 1
          ? "1 tarea sincronizada con el servidor"
          : `${syncedCount} tareas sincronizadas con el servidor`,
      );
    }
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    void useTaskStore.getState().syncPendingTasks();
  });
}
