import { create } from "zustand";
import {
    notificationService,
    type CrearNotificacionPayload,
    type Notificacion,
    type NotificacionOrigen,
} from "@/modules/reminders/services/notification.service";
import { getErrorMessage } from "@/modules/core/services/api-error";

interface NotificationState {
    items: Notificacion[];
    isLoading: boolean;
    /** Indica que ya se intentó cargar el historial (con o sin éxito). */
    hasLoaded: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    createNotification: (
        origen: NotificacionOrigen,
        payload: CrearNotificacionPayload,
    ) => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    removeNotification: (id: number) => Promise<void>;
    clearAll: () => Promise<void>;
    clear: () => void;
}

let inFlightFetch: Promise<void> | null = null;

export const useNotificationStore = create<NotificationState>((set, get) => ({
    items: [],
    isLoading: false,
    hasLoaded: false,
    error: null,

    fetchNotifications: async () => {
        if (inFlightFetch) return inFlightFetch;

        inFlightFetch = (async () => {
            set({ isLoading: true, error: null });

            try {
                const { success, message, data } = await notificationService.getAll();
                if (!success || !data) throw new Error(message);
                set({ items: data, error: null });
            } catch (err) {
                // Con datos ya en pantalla se conservan; sin datos se muestra el error.
                if (get().items.length === 0) {
                    set({
                        error: getErrorMessage(
                            err,
                            "No se pudo cargar el historial de notificaciones",
                        ),
                    });
                }
            } finally {
                set({ isLoading: false, hasLoaded: true });
                inFlightFetch = null;
            }
        })();

        return inFlightFetch;
    },

    createNotification: async (origen, payload) => {
        try {
            const { success, message, data } = await notificationService.create(
                origen,
                payload,
            );
            if (!success || !data) throw new Error(message);
            set((s) => ({ items: [data, ...s.items] }));
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al registrar la notificación"));
        }
    },

    markAsRead: async (id) => {
        try {
            const { success, message } = await notificationService.markAsRead(id);
            if (!success) throw new Error(message);
            set((s) => ({
                items: s.items.map((n) => (n.id === id ? { ...n, leida: true } : n)),
            }));
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al marcar como leída"));
        }
    },

    markAllAsRead: async () => {
        // El backend responde 404 si la notificación ya estaba leída: solo se envían las no leídas.
        const unread = get().items.filter((n) => !n.leida);
        if (unread.length === 0) return;

        const results = await Promise.allSettled(
            unread.map((n) => notificationService.markAsRead(n.id)),
        );
        const done = new Set(
            unread.filter((_, i) => results[i].status === "fulfilled").map((n) => n.id),
        );

        set((s) => ({
            items: s.items.map((n) => (done.has(n.id) ? { ...n, leida: true } : n)),
        }));

        if (done.size < unread.length) {
            throw new Error("No se pudieron marcar algunas notificaciones como leídas");
        }
    },

    removeNotification: async (id) => {
        try {
            const { success, message } = await notificationService.remove(id);
            if (!success) throw new Error(message);
            set((s) => ({ items: s.items.filter((n) => n.id !== id) }));
        } catch (err) {
            throw new Error(getErrorMessage(err, "Error al eliminar la notificación"));
        }
    },

    clearAll: async () => {
        const all = get().items;
        if (all.length === 0) return;

        const results = await Promise.allSettled(
            all.map((n) => notificationService.remove(n.id)),
        );
        const removed = new Set(
            all.filter((_, i) => results[i].status === "fulfilled").map((n) => n.id),
        );

        set((s) => ({ items: s.items.filter((n) => !removed.has(n.id)) }));

        if (removed.size < all.length) {
            throw new Error("No se pudieron borrar todas las notificaciones");
        }
    },

    clear: () => set({ items: [], error: null, hasLoaded: false }),
}));