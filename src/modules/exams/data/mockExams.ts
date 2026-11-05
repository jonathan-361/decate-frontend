import { addDays, setHours, setMinutes, startOfToday } from "date-fns";

export type ExamFilter = "upcoming" | "past" | "all";

export interface StudyReminder {
  id: number;
  text: string;
  date: Date;
  done: boolean;
}

export interface Exam {
  id: number;
  name: string;
  subject: string;
  subjectColor: string;
  date: Date;
  durationMinutes: number;
  location: string;
  topics: string[];
  reminders: StudyReminder[];
}

// Fechas relativas a hoy para que el mock siempre se vea vivo.
const at = (offset: number, hour: number, minute = 0) =>
  setMinutes(setHours(addDays(startOfToday(), offset), hour), minute);

export const MOCK_EXAMS: Exam[] = [
  {
    id: 1,
    name: "Examen parcial 2",
    subject: "Cálculo Diferencial",
    subjectColor: "bg-blue-500",
    date: at(2, 8),
    durationMinutes: 120,
    location: "Aula B-204",
    topics: [
      "Límites y continuidad",
      "Derivadas por definición",
      "Regla de la cadena",
      "Aplicaciones de la derivada",
    ],
    reminders: [
      {
        id: 1,
        text: "Resolver guía de ejercicios 3",
        date: at(-1, 18),
        done: true,
      },
      {
        id: 2,
        text: "Repasar fórmulas de derivación",
        date: at(0, 20),
        done: false,
      },
      {
        id: 3,
        text: "Hacer simulacro con tiempo",
        date: at(1, 17),
        done: false,
      },
    ],
  },
  {
    id: 2,
    name: "Evaluación práctica",
    subject: "Programación I",
    subjectColor: "bg-emerald-500",
    date: at(7, 10),
    durationMinutes: 120,
    location: "Lab. 3",
    topics: ["Listas enlazadas", "Pilas y colas", "Complejidad algorítmica"],
    reminders: [
      {
        id: 4,
        text: "Practicar implementación de listas",
        date: at(4, 19),
        done: false,
      },
      { id: 5, text: "Repasar notación Big-O", date: at(6, 18), done: false },
    ],
  },
  {
    id: 3,
    name: "Examen final",
    subject: "Historia de México",
    subjectColor: "bg-amber-500",
    date: at(14, 14),
    durationMinutes: 120,
    location: "Aula A-108",
    topics: [
      "Porfiriato",
      "Revolución Mexicana",
      "Cardenismo",
      "Milagro mexicano",
    ],
    reminders: [
      { id: 6, text: "Releer capítulos 4 al 6", date: at(10, 17), done: false },
    ],
  },
  {
    id: 4,
    name: "Quiz de estequiometría",
    subject: "Química",
    subjectColor: "bg-purple-500",
    date: at(20, 9),
    durationMinutes: 60,
    location: "Laboratorio de Química",
    topics: ["Balanceo de ecuaciones", "Relaciones molares"],
    reminders: [],
  },
  {
    id: 5,
    name: "Examen parcial 1",
    subject: "Cálculo Diferencial",
    subjectColor: "bg-blue-500",
    date: at(-20, 8),
    durationMinutes: 120,
    location: "Aula B-204",
    topics: ["Funciones y gráficas", "Álgebra de límites"],
    reminders: [
      {
        id: 7,
        text: "Resolver guía de ejercicios 1",
        date: at(-23, 18),
        done: true,
      },
    ],
  },
  {
    id: 6,
    name: "Quiz de cinemática",
    subject: "Física",
    subjectColor: "bg-purple-500",
    date: at(-9, 11),
    durationMinutes: 60,
    location: "Aula C-301",
    topics: ["Movimiento rectilíneo", "Caída libre"],
    reminders: [],
  },
];
