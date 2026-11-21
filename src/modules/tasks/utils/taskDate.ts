import type { Task } from "@/modules/tasks/schemas";

// El backend guarda fecha (DATE) y hora (TIME) por separado y las devuelve como ISO en UTC
// ("2026-11-25T00:00:00.000Z", "1970-01-01T23:59:00.000Z"). Se leen por posición, sin pasar por
// new Date(iso): eso las convertiría a hora local y la fecha caería un día antes en México (UTC-6).
export const toDateInput = (iso: string) => iso.slice(0, 10);
export const toTimeInput = (iso: string) => iso.slice(11, 16);

/** Fecha y hora de entrega como Date local. */
export const dueDateTime = (t: Pick<Task, "fechaEntrega" | "hora">) =>
  new Date(`${toDateInput(t.fechaEntrega)}T${toTimeInput(t.hora)}`);
