import type { TaskPriority } from "@/modules/tasks/schemas";

export interface PendingTaskSummary {
  id: number;
  title: string;
  subject: string;
  subjectColor: string;
  dueDate: string;
  priority: TaskPriority;
  isUrgent: boolean;
}

export interface TodayClassSummary {
  id: number;
  subject: string;
  color: string;
  room: string;
  teacher: string;
  time: string;
  status: string;
  done: boolean;
  current?: boolean;
}

export const MOCK_PENDING_TASKS: PendingTaskSummary[] = [
  {
    id: 1,
    title: "Informe de Cálculo Diferencial",
    subject: "Cálculo",
    subjectColor: "bg-blue-500",
    dueDate: "Hoy, 11:59 PM",
    priority: "Alta",
    isUrgent: true,
  },
  {
    id: 2,
    title: "Práctica de Programación — Listas enlazadas",
    subject: "Programación",
    subjectColor: "bg-emerald-500",
    dueDate: "Mañana, 8:00 AM",
    priority: "Alta",
    isUrgent: false,
  },
  {
    id: 3,
    title: "Resumen de capítulos 4-6",
    subject: "Historia",
    subjectColor: "bg-amber-500",
    dueDate: "Vie 7 nov",
    priority: "Media",
    isUrgent: false,
  },
];

export const MOCK_TODAY_CLASSES: TodayClassSummary[] = [
  {
    id: 1,
    subject: "Cálculo Diferencial",
    color: "bg-blue-500",
    room: "Aula B-204",
    teacher: "Dr. Ramírez",
    time: "08:00 – 10:00",
    status: "Completada",
    done: true,
  },
  {
    id: 2,
    subject: "Programación I",
    color: "bg-emerald-500",
    room: "Lab. 3",
    teacher: "Ing. Torres",
    time: "10:00 – 12:00",
    status: "En curso",
    done: false,
    current: true,
  },
  {
    id: 3,
    subject: "Historia de México",
    color: "bg-amber-500",
    room: "Aula A-108",
    teacher: "Mtra. Flores",
    time: "14:00 – 16:00",
    status: "Próxima",
    done: false,
    current: false,
  },
];

export const MOCK_COMPLETION_RATE = 68;