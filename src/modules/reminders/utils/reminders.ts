import { subMinutes } from "date-fns";
import type { Task } from "@/modules/tasks/schemas";
import type { Exam } from "@/modules/exams/schemas";
import { getMateriaColor, getMateriaLabel } from "@/modules/tasks/data/taskMeta";
import { dueDateTime } from "@/modules/tasks/utils/taskDate";
import { examDateTime } from "@/modules/exams/utils/examDate";
import { leadTimeToMinutes } from "@/modules/core/services/notifications";
import type { Notificacion } from "@/modules/reminders/services/notification.service";
import type {
    NotificationEntry,
    ReminderCategory,
    ReminderRule,
    UpcomingReminder,
} from "@/modules/reminders/schemas";

/** Tareas y exámenes pendientes, cada uno con su hora de aviso y si ese aviso ya salió. */
export function buildUpcomingReminders(
    tasks: Task[],
    exams: Exam[],
    rules: Record<ReminderCategory, ReminderRule>,
): UpcomingReminder[] {
    const now = Date.now();
    const reminders: UpcomingReminder[] = [];

    for (const task of tasks) {
        if (task.estado === "Completado") continue;
        const due = dueDateTime(task);
        if (Number.isNaN(due.getTime()) || due.getTime() <= now) continue;

        const fireAt = subMinutes(due, leadTimeToMinutes(rules.task.leadTime));
        reminders.push({
            id: `task-${task.id}`,
            category: "task",
            title: task.titulo,
            subject: getMateriaLabel(task.materia),
            subjectColor: getMateriaColor(task.materia),
            dueAt: due,
            fireAt,
            fired: fireAt.getTime() <= now,
            enabled: rules.task.enabled,
        });
    }

    for (const exam of exams) {
        const start = examDateTime(exam);
        if (Number.isNaN(start.getTime()) || start.getTime() <= now) continue;

        const fireAt = subMinutes(start, leadTimeToMinutes(rules.exam.leadTime));
        reminders.push({
            id: `exam-${exam.id}`,
            category: "exam",
            title: exam.titulo,
            subject: getMateriaLabel(exam.materia),
            subjectColor: getMateriaColor(exam.materia),
            location: exam.aula || undefined,
            dueAt: start,
            fireAt,
            fired: fireAt.getTime() <= now,
            enabled: rules.exam.enabled,
        });
    }

    return reminders;
}

/** El backend solo liga una notificación a una tarea o a un examen. */
export const toNotificationEntry = (n: Notificacion): NotificationEntry => ({
    id: n.id,
    category: n.examenId ? "exam" : "task",
    title: n.titulo,
    description: n.mensaje,
    read: n.leida,
});