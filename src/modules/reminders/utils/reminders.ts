import { format, subMinutes } from "date-fns";
import { es } from "date-fns/locale";
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

/** Avisos que aún no se han disparado: tareas y exámenes pendientes cuya hora de aviso es futura. */
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
        const fireAt = subMinutes(due, leadTimeToMinutes(rules.task.leadTime));
        if (Number.isNaN(fireAt.getTime()) || fireAt.getTime() <= now) continue;

        reminders.push({
            id: `task-${task.id}`,
            category: "task",
            title: task.titulo,
            detail: `Entrega ${format(due, "EEE d MMM · HH:mm", { locale: es })}`,
            subject: getMateriaLabel(task.materia),
            subjectColor: getMateriaColor(task.materia),
            fireAt,
            enabled: rules.task.enabled,
        });
    }

    for (const exam of exams) {
        const start = examDateTime(exam);
        const fireAt = subMinutes(start, leadTimeToMinutes(rules.exam.leadTime));
        if (Number.isNaN(fireAt.getTime()) || fireAt.getTime() <= now) continue;

        reminders.push({
            id: `exam-${exam.id}`,
            category: "exam",
            title: exam.titulo,
            detail: `${exam.aula ? `${exam.aula} · ` : ""}${format(start, "EEE d MMM · HH:mm", { locale: es })}`,
            subject: getMateriaLabel(exam.materia),
            subjectColor: getMateriaColor(exam.materia),
            fireAt,
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