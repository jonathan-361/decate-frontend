import { create } from "zustand";
import { taskService } from "@/modules/tasks/services/task.service";
import { getErrorMessage } from "@/modules/core/services/api-error";
import type { Task, TaskPayload } from "@/modules/tasks/schemas";

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
export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { success, message, data } = await taskService.getAll();
      if (!success || !data) throw new Error(message);
      set({ tasks: data, isLoading: false });
    } catch (err) {
      set({
        error: getErrorMessage(err, "Error al obtener las tareas"),
        isLoading: false,
      });
    }
  },

  createTask: async (payload) => {
    try {
      const { success, message, data } = await taskService.create(payload);
      if (!success || !data) throw new Error(message);
      set((s) => ({ tasks: [...s.tasks, data] }));
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al crear la tarea"));
    }
  },

  updateTask: async (id, payload) => {
    try {
      const { success, message, data } = await taskService.update(id, payload);
      if (!success || !data) throw new Error(message);
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? data : t)) }));
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al actualizar la tarea"));
    }
  },

  deleteTask: async (id) => {
    try {
      const { success, message } = await taskService.remove(id);
      if (!success) throw new Error(message);
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al eliminar la tarea"));
    }
  },
}));
