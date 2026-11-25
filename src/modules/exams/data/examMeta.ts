import { differenceInCalendarDays, format } from "date-fns";
import { es } from "date-fns/locale";
import type { Exam } from "@/modules/exams/schemas";
import { examDateTime } from "@/modules/exams/utils/examDate";

const MS_DAY = 86_400_000;
const MS_HOUR = 3_600_000;
const MS_MINUTE = 60_000;

export interface TimeRemaining {
  isPast: boolean;
  days: number;
  hours: number;
  minutes: number;
}

export function getTimeRemaining(date: Date): TimeRemaining {
  const ms = date.getTime() - Date.now();
  if (ms <= 0) return { isPast: true, days: 0, hours: 0, minutes: 0 };
  return {
    isPast: false,
    days: Math.floor(ms / MS_DAY),
    hours: Math.floor((ms % MS_DAY) / MS_HOUR),
    minutes: Math.floor((ms % MS_HOUR) / MS_MINUTE),
  };
}

export const isPastExam = (exam: Exam) =>
  examDateTime(exam).getTime() <= Date.now();

/** Examen en los próximos 2 días: comparte el criterio de "entrega próxima" del calendario. */
export const isExamUrgent = (exam: Exam) =>
  !isPastExam(exam) &&
  differenceInCalendarDays(examDateTime(exam), new Date()) <= 2;

export function formatCountdown({
  isPast,
  days,
  hours,
  minutes,
}: TimeRemaining) {
  if (isPast) return "Finalizado";
  if (days > 0) return `En ${days} ${days === 1 ? "día" : "días"} y ${hours} h`;
  if (hours > 0) return `En ${hours} h ${minutes} min`;
  return `En ${minutes} min`;
}

export function formatExamSchedule(exam: Exam) {
  const date = examDateTime(exam);
  return {
    date: format(date, "EEEE d 'de' MMMM", { locale: es }),
    time: format(date, "HH:mm"),
  };
}

export const getUpcomingExams = (exams: Exam[]) =>
  exams
    .filter((e) => !isPastExam(e))
    .sort((a, b) => examDateTime(a).getTime() - examDateTime(b).getTime());

export const getPastExams = (exams: Exam[]) =>
  exams
    .filter(isPastExam)
    .sort((a, b) => examDateTime(b).getTime() - examDateTime(a).getTime());