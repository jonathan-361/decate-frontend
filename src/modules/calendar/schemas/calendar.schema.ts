import type { TaskPriority } from "@/modules/tasks/schemas";

export type CalendarView = "month" | "week" | "day";
export type CalendarEventType = "task" | "exam";

export interface CalendarEvent {
    uid: string;
    id: number;
    title: string;
    type: CalendarEventType;
    date: Date;
    time: string;
    subject: string;
    subjectColor: string;
    location?: string;
    priority?: TaskPriority;
    completed?: boolean;
}