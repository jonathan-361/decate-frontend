import {
  get,
  post,
  patch,
  remove,
} from "@/modules/core/services/axios.instance";
import type { ApiResponse } from "@/modules/auth/types/auth.types";
import type { Task, TaskPayload } from "@/modules/tasks/schemas";

// El backend recibe el id por query string (?id=), no por path.
export const taskService = {
  getAll: () => get<ApiResponse<Task[]>>("/api/tareas/mostrar"),

  create: (payload: TaskPayload) =>
    post<ApiResponse<Task>>("/api/tareas/crear", payload),

  update: (id: number, payload: Partial<TaskPayload>) =>
    patch<ApiResponse<Task>>(`/api/tareas/actualizar?id=${id}`, payload),

  remove: (id: number) =>
    remove<ApiResponse<null>>("/api/tareas/eliminar", { params: { id } }),
};
