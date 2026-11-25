import type { Exam } from "@/modules/exams/schemas";

// El backend guarda fecha (DATE) y hora (TIME) por separado y las devuelve como ISO en UTC
// ("2026-11-25T00:00:00.000Z", "1970-01-01T08:00:00.000Z"). Se leen por posición, sin pasar por
// new Date(iso): eso las convertiría a hora local y la fecha caería un día antes en México (UTC-6).
export const toDateInput = (iso: string) => iso.slice(0, 10);
export const toTimeInput = (iso: string) => iso.slice(11, 16);

/** Fecha y hora del examen como Date local. */
export const examDateTime = (e: Pick<Exam, "fecha" | "hora">) =>
    new Date(`${toDateInput(e.fecha)}T${toTimeInput(e.hora)}`);

/** Convierte el texto de temas (uno por línea) en una lista. */
export const parseTopics = (raw: string | null | undefined): string[] =>
    (raw ?? "")
        .split(/\r?\n/)
        .map((t) => t.trim())
        .filter(Boolean);