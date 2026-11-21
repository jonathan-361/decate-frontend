import { create } from "zustand";
import { taskService } from "@/modules/tasks/services/task.service";
import { getErrorMessage } from "@/modules/core/services/api-error";
import { idbGet, idbSet } from "@/modules/core/services/indexeddb";
import type { Task, TaskPayload } from "@/modules/tasks/schemas";

/** Clave de IndexedDB con la ultima copia de las tareas del usuario. */
export const TASKS_KEY = "dacate-tasks";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (payload: TaskPayload) => Promise<void>;
  updateTask: (id: number, payload: Partial<TaskPayload>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

// shortcut: sin actualización optimista, el estado cambia cuando responde el backend; mejorar si se siente lento.
// shortcut: offline solo se pueden VER las tareas; crear/editar/borrar necesita red, mejorar con una cola de cambios pendientes.
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });

    // 1. Muestra al instante la ultima copia guardada (si existe).
    const guardadas = await idbGet<Task[]>(TASKS_KEY);
    if (guardadas?.length && get().tasks.length === 0) {
      set({ tasks: guardadas });
    }

    // 2. Pide las tareas al servidor y actualiza la copia.
    try {
      const { success, message, data } = await taskService.getAll();
      if (!success || !data) throw new Error(message);
      set({ tasks: data, isLoading: false });
      void idbSet(TASKS_KEY, data);
    } catch (err) {
      // Si hay copia guardada, se sigue mostrando sin error (modo offline).
      set({
        error: guardadas?.length
          ? null
          : getErrorMessage(err, "Error al obtener las tareas"),
        isLoading: false,
      });
    }
  },

  createTask: async (payload) => {
    try {
      const { success, message, data } = await taskService.create(payload);
      if (!success || !data) throw new Error(message);
      set((s) => ({ tasks: [...s.tasks, data] }));
      void idbSet(TASKS_KEY, get().tasks);
    } catch (err) {
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
}));
