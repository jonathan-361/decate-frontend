import { addDays, startOfToday } from "date-fns";
import type { TaskPriority } from "@/modules/tasks/schemas";

export type CalendarView = "month" | "week" | "day";
export type CalendarEventType = "task" | "exam" | "event";

export interface CalendarEvent {
  id: number;
  title: string;
  type: CalendarEventType;
  date: Date;
  /** Formato "HH:mm". Si no existe, es una actividad de todo el día. */
  time?: string;
  endTime?: string;
  subject?: string;
  subjectColor?: string;
  location?: string;
  priority?: TaskPriority;
  completed?: boolean;
}

// Fechas relativas a hoy para que el mock siempre se vea vivo.
const today = startOfToday();
const day = (offset: number) => addDays(today, offset);

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Informe de Cálculo Diferencial",
    type: "task",
    date: day(0),
    time: "23:59",
    subject: "Cálculo",
    subjectColor: "bg-blue-500",
    priority: "Alta",
  },
  {
    id: 2,
    title: "Lectura de Física — Cap. 3",
    type: "task",
    date: day(0),
    time: "17:00",
    subject: "Física",
    subjectColor: "bg-purple-500",
    priority: "Media",
  },
  {
    id: 3,
    title: "Práctica de Programación — Listas enlazadas",
    type: "task",
    date: day(1),
    time: "08:00",
    subject: "Programación",
    subjectColor: "bg-emerald-500",
    priority: "Alta",
  },
  {
    id: 4,
    title: "Conferencia de orientación vocacional",
    type: "event",
    date: day(1),
    time: "12:00",
    endTime: "13:30",
    location: "Auditorio central",
  },
  {
    id: 5,
    title: "Resumen de capítulos 4-6",
    type: "task",
    date: day(2),
    time: "20:00",
    subject: "Historia",
    subjectColor: "bg-amber-500",
    priority: "Media",
  },
  {
    id: 6,
    title: "Fecha límite de pago de colegiatura",
    type: "event",
    date: day(3),
  },
  {
    id: 7,
    title: "Ensayo de Literatura",
    type: "task",
    date: day(4),
    time: "18:00",
    subject: "Literatura",
    subjectColor: "bg-purple-500",
    priority: "Media",
  },
  {
    id: 8,
    title: "Examen parcial 2",
    type: "exam",
    date: day(5),
    time: "08:00",
    endTime: "10:00",
    subject: "Cálculo Diferencial",
    subjectColor: "bg-blue-500",
    location: "Aula B-204",
  },
  {
    id: 9,
    title: "Reporte de laboratorio",
    type: "task",
    date: day(6),
    time: "12:00",
    subject: "Química",
    subjectColor: "bg-amber-500",
    priority: "Media",
  },
  {
    id: 10,
    title: "Evaluación práctica",
    type: "exam",
    date: day(7),
    time: "10:00",
    endTime: "12:00",
    subject: "Programación",
    subjectColor: "bg-emerald-500",
    location: "Lab. 3",
  },
  {
    id: 11,
    title: "Día de asueto — sin clases",
    type: "event",
    date: day(9),
  },
  {
    id: 12,
    title: "Proyecto final de Programación",
    type: "task",
    date: day(11),
    time: "23:59",
    subject: "Programación",
    subjectColor: "bg-emerald-500",
    priority: "Alta",
  },
  {
    id: 13,
    title: "Entrega de calificaciones parciales",
    type: "event",
    date: day(12),
  },
  {
    id: 14,
    title: "Examen final de Historia",
    type: "exam",
    date: day(14),
    time: "14:00",
    endTime: "16:00",
    subject: "Historia de México",
    subjectColor: "bg-amber-500",
    location: "Aula A-108",
  },
  {
    id: 15,
    title: "Tarea de Álgebra lineal",
    type: "task",
    date: day(-2),
    time: "10:00",
    subject: "Álgebra",
    subjectColor: "bg-blue-500",
    priority: "Media",
    completed: true,
  },
];
