import type { Task } from "@/modules/tasks/schemas";
import type { Exam } from "@/modules/exams/schemas";
import type { CalendarEvent } from "@/modules/calendar/schemas";
import {
    getMateriaColor,
    getMateriaLabel,
} from "@/modules/tasks/data/taskMeta";
import { dueDateTime, toTimeInput } from "@/modules/tasks/utils/taskDate";
import {
    examDateTime,
    toTimeInput as toExamTimeInput,
} from "@/modules/exams/utils/examDate";
import { isPastExam } from "@/modules/exams/data/examMeta";

export const taskToEvent = (task: Task): CalendarEvent => ({
    uid: `task-${task.id}`,
    id: task.id,
    title: task.titulo,
    type: "task",
    date: dueDateTime(task),
    time: toTimeInput(task.hora),
    subject: getMateriaLabel(task.materia),
    subjectColor: getMateriaColor(task.materia),
    priority: task.prioridad,
    completed: task.estado === "Completado",
});

export const examToEvent = (exam: Exam): CalendarEvent => ({
    uid: `exam-${exam.id}`,
    id: exam.id,
    title: exam.titulo,
    type: "exam",
    date: examDateTime(exam),
    time: toExamTimeInput(exam.hora),
    subject: getMateriaLabel(exam.materia),
    subjectColor: getMateriaColor(exam.materia),
    location: exam.aula,
    // Un examen que ya pasó se muestra atenuado, igual que una tarea completada.
    completed: isPastExam(exam),
});

/** Une tareas y exámenes en una sola lista de actividades, descartando fechas inválidas. */
export const buildCalendarEvents = (
    tasks: Task[],
    exams: Exam[],
): CalendarEvent[] =>
    [...tasks.map(taskToEvent), ...exams.map(examToEvent)].filter(
        (event) => !Number.isNaN(event.date.getTime()),
    );