import { idbDelete, idbGet, idbSet } from "@/modules/core/services/indexeddb";
import { paths } from "@/modules/core/routes/paths/path";
import type { Task } from "@/modules/tasks/schemas";
import type { Exam } from "@/modules/exams/schemas";
import { dueDateTime } from "@/modules/tasks/utils/taskDate";
import { examDateTime } from "@/modules/exams/utils/examDate";

const SETTINGS_KEY = "dacate-notification-settings";
const NOTIFIED_TASK_IDS_KEY = "dacate-notified-task-ids";
const NOTIFIED_EXAM_IDS_KEY = "dacate-notified-exam-ids";

export interface NotificationSettings {
  /** Interruptor general de avisos del navegador. */
  enabled: boolean;
  taskEnabled: boolean;
  examEnabled: boolean;
  /** Minutos de anticipación antes de la entrega (por defecto 24 h). */
  taskLeadMinutes: number;
  /** Minutos de anticipación antes del examen (por defecto 3 días). */
  examLeadMinutes: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  taskEnabled: true,
  examEnabled: true,
  taskLeadMinutes: 24 * 60,
  examLeadMinutes: 3 * 24 * 60,
};

const LEAD_TIME_TO_MINUTES: Record<string, number> = {
  "6h": 6 * 60,
  "12h": 12 * 60,
  "24h": 24 * 60,
  "48h": 48 * 60,
  "1d": 24 * 60,
  "3d": 3 * 24 * 60,
  "5d": 5 * 24 * 60,
  "1w": 7 * 24 * 60,
};

export function leadTimeToMinutes(leadTime: string): number {
  return LEAD_TIME_TO_MINUTES[leadTime] ?? DEFAULT_SETTINGS.taskLeadMinutes;
}

/** Operación inversa: busca, entre las opciones de una categoría, la que equivale a los minutos guardados. */
export function leadTimeFromMinutes(
  minutes: number,
  candidates: string[],
  fallback: string,
): string {
  return (
    candidates.find((c) => LEAD_TIME_TO_MINUTES[c] === minutes) ?? fallback
  );
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const saved = await idbGet<Partial<NotificationSettings>>(SETTINGS_KEY);
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

/** Olvida qué tareas y exámenes ya se avisaron en este dispositivo (se usa al cerrar sesión). */
export async function clearNotifiedState(): Promise<void> {
  await Promise.all([
    idbDelete(NOTIFIED_TASK_IDS_KEY),
    idbDelete(NOTIFIED_EXAM_IDS_KEY),
  ]);
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

const SW_READY_TIMEOUT = 3000;

/** Registro del service worker con un worker activo, o null si no hay (p. ej. en desarrollo). */
async function getActiveRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;

  const existing = await navigator.serviceWorker.getRegistration();
  if (!existing) return null;
  if (existing.active) return existing;

  // Hay registro, pero el worker aún se está activando (p. ej. justo tras actualizar la app).
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<null>((resolve) =>
      window.setTimeout(() => resolve(null), SW_READY_TIMEOUT),
    ),
  ]);
}

/** Muestra una notificación nativa. Devuelve true si se pudo mostrar. */
export async function showLocalNotification(
  title: string,
  options?: NotificationOptions & { url?: string },
): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== "granted")
    return false;

  const { url = paths.tasks, ...rest } = options ?? {};

  const payload: NotificationOptions = {
    icon: "/icons/dacate-192x192.png",
    badge: "/icons/dacate.svg",
    data: { url },
    ...rest,
  };

  try {
    const reg = await getActiveRegistration();
    if (reg) {
      await reg.showNotification(title, payload);
      return true;
    }
  } catch (error) {
    console.warn(
      "[dacate] showNotification del service worker falló, se usa Notification:",
      error,
    );
  }

  try {
    const notification = new Notification(title, payload);
    notification.onclick = () => {
      window.focus();
      window.location.href = url;
      notification.close();
    };
    return true;
  } catch (error) {
    console.warn("[dacate] No se pudo mostrar la notificación:", error);
    return false;
  }
}

export type NotificationOrigin = { tareaId: number } | { examenId: number };

export interface UpcomingCheckInput {
  tasks: Task[];
  exams: Exam[];
  /** Ids que ya tienen una notificación registrada en el backend (p. ej. avisada desde otro dispositivo). */
  registeredTaskIds: ReadonlySet<number>;
  registeredExamIds: ReadonlySet<number>;
  /** Registra el aviso en el historial del backend. */
  register?: (
    origin: NotificationOrigin,
    data: { titulo: string; mensaje: string },
  ) => Promise<void>;
}

function describeTimeLeft(diffMs: number): string {
  const totalMinutes = Math.max(0, Math.round(diffMs / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} d`);
  if (hours > 0) parts.push(`${hours} h`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} min`);

  return parts.length > 0 ? `en ${parts.join(" ")}` : "ahora mismo";
}

interface DueCheck<T extends { id: number }> {
  items: T[];
  notifiedKey: string;
  registered: ReadonlySet<number>;
  leadMinutes: number;
  isSkipped: (item: T) => boolean;
  dueAt: (item: T) => Date;
  title: string;
  body: (item: T, timeLeft: string) => string;
  tagPrefix: string;
  url: string;
  origin: (id: number) => NotificationOrigin;
  register?: UpcomingCheckInput["register"];
}

async function notifyDue<T extends { id: number }>(check: DueCheck<T>) {
  const windowMs = check.leadMinutes * 60 * 1000;
  const now = Date.now();
  const notified = new Set((await idbGet<number[]>(check.notifiedKey)) ?? []);
  let changed = false;

  for (const item of check.items) {
    if (check.isSkipped(item) || notified.has(item.id)) continue;

    // Otro dispositivo ya avisó y lo dejó en el historial: no se repite.
    if (check.registered.has(item.id)) {
      notified.add(item.id);
      changed = true;
      continue;
    }

    const diffMs = check.dueAt(item).getTime() - now;
    if (Number.isNaN(diffMs)) continue;

    // Avisa si está dentro de la ventana configurada y no lleva más de 5 min vencida.
    if (diffMs <= windowMs && diffMs >= -5 * 60 * 1000) {
      const body = check.body(item, describeTimeLeft(diffMs));

      const shown = await showLocalNotification(check.title, {
        body,
        tag: `${check.tagPrefix}-${item.id}`,
        url: check.url,
      });
      // Si no se pudo mostrar, no se marca como avisado: se reintenta en la siguiente revisión.
      if (!shown) continue;

      notified.add(item.id);
      changed = true;

      try {
        await check.register?.(check.origin(item.id), {
          titulo: check.title,
          mensaje: body,
        });
      } catch {
        // Historial no disponible (sin conexión): el aviso ya se mostró.
      }
    }
  }

  if (changed) {
    await idbSet(check.notifiedKey, Array.from(notified));
  }
}

let checking = false;

/**
 * Evalúa tareas y exámenes pendientes, lanza una notificación nativa cuando falte menos del
 * tiempo de anticipación configurado y registra el aviso en el historial del backend.
 */
export async function checkAndNotifyUpcoming(
  input: UpcomingCheckInput,
): Promise<void> {
  if (checking) return;
  if (!isNotificationSupported() || Notification.permission !== "granted")
    return;

  const settings = await getNotificationSettings();
  if (!settings.enabled) return;

  checking = true;
  try {
    if (settings.taskEnabled) {
      await notifyDue<Task>({
        items: input.tasks,
        notifiedKey: NOTIFIED_TASK_IDS_KEY,
        registered: input.registeredTaskIds,
        leadMinutes: settings.taskLeadMinutes,
        isSkipped: (task) => task.estado === "Completado",
        dueAt: dueDateTime,
        title: "Tarea próxima a vencer",
        body: (task, timeLeft) =>
          timeLeft === "ahora mismo"
            ? `"${task.titulo}" vence ahora mismo.`
            : `"${task.titulo}" vence ${timeLeft}.`,
        tagPrefix: "dacate-task",
        url: paths.tasks,
        origin: (id) => ({ tareaId: id }),
        register: input.register,
      });
    }

    if (settings.examEnabled) {
      await notifyDue<Exam>({
        items: input.exams,
        notifiedKey: NOTIFIED_EXAM_IDS_KEY,
        registered: input.registeredExamIds,
        leadMinutes: settings.examLeadMinutes,
        isSkipped: () => false,
        dueAt: examDateTime,
        title: "Examen próximo",
        body: (exam, timeLeft) =>
          timeLeft === "ahora mismo"
            ? `"${exam.titulo}" empieza ahora mismo.`
            : `"${exam.titulo}" empieza ${timeLeft}.`,
        tagPrefix: "dacate-exam",
        url: paths.exams,
        origin: (id) => ({ examenId: id }),
        register: input.register,
      });
    }
  } finally {
    checking = false;
  }
}