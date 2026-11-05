import {
  addDays,
  setHours,
  setMinutes,
  startOfToday,
  subMinutes,
} from "date-fns";

export type ReminderCategory = "task" | "exam" | "class";
/** "auto" lo genera la regla de anticipación; "study" lo creó el estudiante para un examen. */
export type ReminderKind = "auto" | "study";
export type HistoryFilter = "all" | ReminderCategory;

export interface ReminderRule {
  enabled: boolean;
  leadTime: string;
}

export interface UpcomingReminder {
  id: number;
  category: ReminderCategory;
  kind: ReminderKind;
  title: string;
  detail: string;
  subject?: string;
  subjectColor?: string;
  fireAt: Date;
  enabled: boolean;
}

export interface NotificationEntry {
  id: number;
  category: ReminderCategory;
  title: string;
  description: string;
  receivedAt: Date;
  read: boolean;
}

// Fechas relativas a hoy para que el mock siempre se vea vivo.
const at = (offset: number, hour: number, minute = 0) =>
  setMinutes(setHours(addDays(startOfToday(), offset), hour), minute);
const ago = (minutes: number) => subMinutes(new Date(), minutes);

export const INITIAL_RULES: Record<ReminderCategory, ReminderRule> = {
  task: { enabled: true, leadTime: "24h" },
  exam: { enabled: true, leadTime: "3d" },
  class: { enabled: true, leadTime: "15m" },
};

export const MOCK_UPCOMING_REMINDERS: UpcomingReminder[] = [
  {
    id: 1,
    category: "exam",
    kind: "study",
    title: "Repasar fórmulas de derivación",
    detail: "Examen parcial 2",
    subject: "Cálculo Diferencial",
    subjectColor: "bg-blue-500",
    fireAt: at(0, 20),
    enabled: true,
  },
  {
    id: 2,
    category: "class",
    kind: "auto",
    title: "Historia de México",
    detail: "Aula A-108 · 14:00",
    subject: "Historia",
    subjectColor: "bg-amber-500",
    fireAt: at(0, 13, 45),
    enabled: true,
  },
  {
    id: 3,
    category: "task",
    kind: "auto",
    title: "Práctica de Programación — Listas enlazadas",
    detail: "Entrega mañana, 08:00",
    subject: "Programación",
    subjectColor: "bg-emerald-500",
    fireAt: at(0, 21),
    enabled: true,
  },
  {
    id: 4,
    category: "exam",
    kind: "study",
    title: "Hacer simulacro con tiempo",
    detail: "Examen parcial 2",
    subject: "Cálculo Diferencial",
    subjectColor: "bg-blue-500",
    fireAt: at(1, 17),
    enabled: true,
  },
  {
    id: 5,
    category: "class",
    kind: "auto",
    title: "Programación I",
    detail: "Lab. 3 · 10:00",
    subject: "Programación",
    subjectColor: "bg-emerald-500",
    fireAt: at(1, 9, 45),
    enabled: true,
  },
  {
    id: 6,
    category: "task",
    kind: "auto",
    title: "Resumen de capítulos 4-6",
    detail: "Entrega en 2 días, 20:00",
    subject: "Historia",
    subjectColor: "bg-amber-500",
    fireAt: at(1, 20),
    enabled: false,
  },
  {
    id: 7,
    category: "exam",
    kind: "auto",
    title: "Examen parcial 2",
    detail: "Pasado mañana, 08:00 · Aula B-204",
    subject: "Cálculo Diferencial",
    subjectColor: "bg-blue-500",
    fireAt: at(2, 8),
    enabled: true,
  },
  {
    id: 8,
    category: "exam",
    kind: "study",
    title: "Practicar implementación de listas",
    detail: "Evaluación práctica",
    subject: "Programación",
    subjectColor: "bg-emerald-500",
    fireAt: at(4, 19),
    enabled: true,
  },
];

export const MOCK_NOTIFICATIONS: NotificationEntry[] = [
  {
    id: 1,
    category: "task",
    title: "Tarea por vencer",
    description: "Informe de Cálculo Diferencial vence hoy a las 23:59.",
    receivedAt: ago(30),
    read: false,
  },
  {
    id: 2,
    category: "class",
    title: "Clase en 15 minutos",
    description: "Programación I · Lab. 3 · 10:00.",
    receivedAt: ago(180),
    read: false,
  },
  {
    id: 3,
    category: "exam",
    title: "Examen próximo",
    description: "Examen parcial 2 de Cálculo Diferencial es en 3 días.",
    receivedAt: ago(26 * 60),
    read: true,
  },
  {
    id: 4,
    category: "task",
    title: "Tarea por vencer",
    description: "Práctica de Programación vence mañana a las 08:00.",
    receivedAt: ago(28 * 60),
    read: true,
  },
  {
    id: 5,
    category: "class",
    title: "Clase en 15 minutos",
    description: "Historia de México · Aula A-108 · 14:00.",
    receivedAt: ago(50 * 60),
    read: true,
  },
  {
    id: 6,
    category: "exam",
    title: "Recordatorio de estudio",
    description: "Resolver guía de ejercicios 3 para el parcial de Cálculo.",
    receivedAt: ago(4 * 24 * 60),
    read: true,
  },
  {
    id: 7,
    category: "task",
    title: "Tarea por vencer",
    description: "Tarea de Álgebra lineal vencía hoy a las 10:00.",
    receivedAt: ago(6 * 24 * 60),
    read: true,
  },
  {
    id: 8,
    category: "exam",
    title: "Examen próximo",
    description: "Examen parcial 1 de Cálculo Diferencial es en 3 días.",
    receivedAt: ago(23 * 24 * 60),
    read: true,
  },
];
