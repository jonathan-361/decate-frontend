import type {
  Materia,
  SubjectColor,
  WeekDay,
} from "@/modules/schedule/schemas/schedule.schema";

export const WEEK_DAYS: WeekDay[] = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const SCHEDULE_DAYS: WeekDay[] = ["Lun", "Mar", "Mié", "Jue", "Vie"];

export const DAY_LABELS: Record<WeekDay, string> = {
  Lun: "Lunes",
  Mar: "Martes",
  "Mié": "Miércoles",
  Jue: "Jueves",
  Vie: "Viernes",
  Sáb: "Sábado",
};

export const START_HOUR = 7;
export const END_HOUR = 21;

export const HOURS: number[] = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);

export const ROW_HEIGHT = 56;

export const SUBJECT_COLOR_STYLES: Record<
  SubjectColor,
  { dot: string; tint: string; bar: string; swatch: string }
> = {
  blue: {
    dot: "bg-blue-500",
    tint: "bg-blue-500/10",
    bar: "bg-blue-500",
    swatch: "bg-blue-500",
  },
  emerald: {
    dot: "bg-emerald-500",
    tint: "bg-emerald-500/10",
    bar: "bg-emerald-500",
    swatch: "bg-emerald-500",
  },
  amber: {
    dot: "bg-amber-500",
    tint: "bg-amber-500/10",
    bar: "bg-amber-500",
    swatch: "bg-amber-500",
  },
  violet: {
    dot: "bg-violet-500",
    tint: "bg-violet-500/10",
    bar: "bg-violet-500",
    swatch: "bg-violet-500",
  },
  rose: {
    dot: "bg-rose-500",
    tint: "bg-rose-500/10",
    bar: "bg-rose-500",
    swatch: "bg-rose-500",
  },
  sky: {
    dot: "bg-sky-500",
    tint: "bg-sky-500/10",
    bar: "bg-sky-500",
    swatch: "bg-sky-500",
  },
  teal: {
    dot: "bg-teal-500",
    tint: "bg-teal-500/10",
    bar: "bg-teal-500",
    swatch: "bg-teal-500",
  },
  orange: {
    dot: "bg-orange-500",
    tint: "bg-orange-500/10",
    bar: "bg-orange-500",
    swatch: "bg-orange-500",
  },
};

export const INITIAL_MATERIAS: Materia[] = [
  {
    id: 1,
    name: "Cálculo Diferencial",
    professor: "Dra. Laura Mendoza",
    room: "Aula B-204",
    days: ["Lun", "Mié", "Vie"],
    startTime: "08:00",
    endTime: "09:30",
    color: "blue",
  },
  {
    id: 2,
    name: "Programación",
    professor: "Mtro. Ricardo Salas",
    room: "Laboratorio 3",
    days: ["Lun", "Mié"],
    startTime: "10:00",
    endTime: "12:00",
    color: "emerald",
  },
  {
    id: 3,
    name: "Historia de México",
    professor: "Mtra. Ana Delgado",
    room: "Aula A-101",
    days: ["Mar", "Jue"],
    startTime: "09:00",
    endTime: "10:30",
    color: "amber",
  },
  {
    id: 4,
    name: "Electrónica",
    professor: "Ing. Pablo Herrera",
    room: "Aula C-305",
    days: ["Mar", "Jue"],
    startTime: "13:00",
    endTime: "15:00",
    color: "violet",
  },
  {
    id: 5,
    name: "Inglés B2",
    professor: "Prof. Sarah Collins",
    room: "Aula D-112",
    days: ["Vie"],
    startTime: "11:00",
    endTime: "12:30",
    color: "rose",
  },
  {
    id: 6,
    name: "Física",
    professor: "Dr. Miguel Torres",
    room: "Laboratorio 1",
    days: ["Lun", "Vie"],
    startTime: "15:00",
    endTime: "17:00",
    color: "sky",
  },
];