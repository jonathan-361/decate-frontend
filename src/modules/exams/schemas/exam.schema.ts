import { z } from "zod";

export type ExamFilter = "upcoming" | "past" | "all";

/** Espeja crearExamen del backend. fecha: YYYY-MM-DD, hora: HH:mm. */
export const examFormSchema = z.object({
    titulo: z
        .string()
        .trim()
        .min(1, "El título es requerido")
        .max(120, "El título no debe exceder 120 caracteres"),
    materia: z
        .string()
        .trim()
        .min(1, "La materia es requerida")
        .max(80, "La materia no debe exceder 80 caracteres"),
    fecha: z.string().min(1, "La fecha es requerida"),
    hora: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora debe tener el formato HH:mm"),
    aula: z
        .string()
        .trim()
        .min(1, "El aula es requerida")
        .max(80, "El aula no debe exceder 80 caracteres"),
    /** Un tema por línea. El backend lo guarda como un solo texto. */
    temasEvaluar: z.string().optional(),
});

/** Lo que se envía a crear/actualizar. */
export type ExamPayload = z.infer<typeof examFormSchema>;

/** Lo que devuelve el backend. fecha y hora llegan como ISO (ver utils/examDate.ts). */
export interface Exam {
    id: number;
    titulo: string;
    materia: string;
    fecha: string;
    hora: string;
    aula: string;
    temasEvaluar: string;
    usuarioId: number;
}