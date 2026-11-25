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
    read: boolean;
}