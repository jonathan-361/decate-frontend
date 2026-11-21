import { idbGet, idbSet } from "@/modules/core/services/indexeddb";
import { paths } from "@/modules/core/routes/paths/path";
import type { Task } from "@/modules/tasks/schemas";
import { dueDateTime } from "@/modules/tasks/utils/taskDate";

const SETTINGS_KEY = "dacate-notification-settings";
const NOTIFIED_IDS_KEY = "dacate-notified-task-ids";

export interface NotificationSettings {
  enabled: boolean;
  /** Minutos de anticipación antes de la entrega (por defecto 24h = 1440 min). */
  taskLeadMinutes: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  taskLeadMinutes: 24 * 60,
};

const LEAD_TIME_TO_MINUTES: Record<string, number> = {
  "6h": 6 * 60,
  "12h": 12 * 60,
  "24h": 24 * 60,
  "48h": 48 * 60,
};

export function leadTimeToMinutes(leadTime: string): number {
  return LEAD_TIME_TO_MINUTES[leadTime] ?? DEFAULT_SETTINGS.taskLeadMinutes;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const saved = await idbGet<NotificationSettings>(SETTINGS_KEY);
  return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
}

export async function saveNotificationSettings(
  patch: Partial<NotificationSettings>,
): Promise<NotificationSettings> {
  const current = await getNotificationSettings();
  const next = { ...current, ...patch };
  await idbSet(SETTINGS_KEY, next);
  return next;
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return await Notification.requestPermission();
}

export async function showLocalNotification(
  title: string,
  options?: NotificationOptions & { url?: string },
): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== "granted")
    return;

  const { url = paths.tasks, ...rest } = options ?? {};

  const payload: NotificationOptions = {
    icon: "/icons/dacate-192x192.png",
    badge: "/icons/dacate.svg",
    data: { url },
    ...rest,
  };

  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.showNotification(title, payload);
      return;
    }
  }

  const notification = new Notification(title, payload);
  notification.onclick = () => {
    window.focus();
    window.location.href = url;
    notification.close();
  };
}

/**
 * Evalúa las tareas pendientes y lanza una notificación nativa del SO
 * cuando falte menos del tiempo de anticipación configurado.
 */
export async function checkAndNotifyUpcomingTasks(
  tasks: Task[],
): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== "granted")
    return;

  const settings = await getNotificationSettings();
  if (!settings.enabled) return;

  const now = Date.now();
  const windowMs = settings.taskLeadMinutes * 60 * 1000;
  const notifiedIds = (await idbGet<number[]>(NOTIFIED_IDS_KEY)) ?? [];
  const notifiedSet = new Set(notifiedIds);
  let changed = false;

  for (const task of tasks) {
    if (task.estado === "Completado" || notifiedSet.has(task.id)) continue;

    const due = dueDateTime(task);
    const diffMs = due.getTime() - now;

    // Notifica si está dentro de la ventana configurada y no tiene más de 5 min vencida
    if (diffMs <= windowMs && diffMs >= -5 * 60 * 1000) {
      const totalMinutes = Math.max(0, Math.round(diffMs / 60_000));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      let timeText = "vence ahora mismo.";
      if (hours > 0) {
        timeText = `vence en ${hours} h${minutes > 0 ? ` ${minutes} min` : ""}.`;
      } else if (minutes > 0) {
        timeText = `vence en ${minutes} min.`;
      }

      await showLocalNotification("Tarea próxima a vencer", {
        body: `"${task.titulo}" ${timeText}`,
        tag: `dacate-task-${task.id}`,
        url: paths.tasks,
      });

      notifiedSet.add(task.id);
      changed = true;
    }
  }

  if (changed) {
    await idbSet(NOTIFIED_IDS_KEY, Array.from(notifiedSet));
  }
}
