import type { TaskStatus } from "@/modules/tasks/schemas";

const LEGACY_MATERIA_LABEL: Record<string, string> = {
  Calculo: "Cálculo",
  Programacion: "Programación",
  Historia: "Historia",
  Electronica: "Electrónica",
  Otra: "Otra",
};

const SUBJECT_PALETTE = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-teal-500",
  "bg-orange-500",
] as const;

export function getMateriaLabel(materia: string): string {
  return LEGACY_MATERIA_LABEL[materia] ?? materia;
}

export function getMateriaColor(materia: string): string {
  const normalized = materia.trim().toLowerCase();
  if (!normalized || normalized === "otra") return "bg-muted-foreground";

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }
  return SUBJECT_PALETTE[hash % SUBJECT_PALETTE.length];
}

export const ESTADO_LABEL: Record<TaskStatus, string> = {
  Pendiente: "Pendiente",
  EnProceso: "En proceso",
  Completado: "Completada",
};