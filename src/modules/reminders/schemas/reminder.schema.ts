export type ReminderCategory = "task" | "exam";
export type HistoryFilter = "all" | ReminderCategory;

export interface ReminderRule {
    enabled: boolean;
    leadTime: string;
}

export interface UpcomingReminder {
    /** Clave única: "task-5", "exam-5". */
    id: string;
    category: ReminderCategory;
    title: string;
    subject: string;
    subjectColor: string;
    /** Aula del examen, si la tiene. */
    location?: string;
    /** Fecha y hora de entrega o del examen. */
    dueAt: Date;
    /** Cuándo se dispara el aviso. */
    fireAt: Date;
    /** La hora de aviso ya pasó. */
    fired: boolean;
    /** La regla de su categoría está activada. */
    enabled: boolean;
}

export interface SubjectReminderGroup {
    key: string;
    subject: string;
    color: string;
    items: UpcomingReminder[];
}

export interface NotificationEntry {
    id: number;
    category: ReminderCategory;
    title: string;
    description: string;
    read: boolean;
}