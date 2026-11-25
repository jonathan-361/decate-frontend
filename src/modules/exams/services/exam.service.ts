import {
    get,
    post,
    patch,
    remove,
} from "@/modules/core/services/axios.instance";
import type { ApiResponse } from "@/modules/auth/types/auth.types";
import type { Exam, ExamPayload } from "@/modules/exams/schemas";

// El backend recibe el id por query string (?id=), no por path.
export const examService = {
    getAll: () => get<ApiResponse<Exam[]>>("/api/examenes/mostrar"),

    create: (payload: ExamPayload) =>
        post<ApiResponse<Exam>>("/api/examenes/crear", payload),

    update: (id: number, payload: Partial<ExamPayload>) =>
        patch<ApiResponse<Exam>>(`/api/examenes/actualizar?id=${id}`, payload),

    remove: (id: number) =>
        remove<ApiResponse<null>>("/api/examenes/eliminar", { params: { id } }),
};