import {
    get,
    patch,
    post,
    remove,
} from "@/modules/core/services/axios.instance";
import type { ApiResponse } from "@/modules/auth/types/auth.types";

export interface Notificacion {
    id: number;
    titulo: string;
    mensaje: string;
    leida: boolean;
    usuarioId: number;
    tareaId: number | null;
    examenId: number | null;
}

export type NotificacionOrigen = { tareaId: number } | { examenId: number };

export interface CrearNotificacionPayload {
    titulo: string;
    mensaje?: string;
}

const origenQuery = (origen: NotificacionOrigen) =>
    "tareaId" in origen
        ? `tareaId=${origen.tareaId}`
        : `examenId=${origen.examenId}`;

export const notificationService = {
    // `_t` evita que el navegador sirva una copia en caché del historial.
    getAll: () =>
        get<ApiResponse<Notificacion[]>>("/api/notificaciones/mostrar", {
            params: { _t: Date.now() },
        }),

    create: (origen: NotificacionOrigen, payload: CrearNotificacionPayload) =>
        post<ApiResponse<Notificacion>, CrearNotificacionPayload>(
            `/api/notificaciones/crear?${origenQuery(origen)}`,
            payload,
        ),

    markAsRead: (id: number) =>
        patch<ApiResponse<{ count: number }>>(`/api/notificaciones/leido?id=${id}`),

    remove: (id: number) =>
        remove<ApiResponse<null>>(`/api/notificaciones/eliminar?id=${id}`),
};