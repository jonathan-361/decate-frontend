import { useCallback, useEffect, useMemo } from "react";
import { useTaskStore } from "@/modules/tasks/stores/task.store";
import { useExamStore } from "@/modules/exams/stores/exam.store";
import { buildCalendarEvents } from "@/modules/calendar/utils/calendarEvents";

export function useCalendarEvents() {
    const tasks = useTaskStore((s) => s.tasks);
    const tasksLoading = useTaskStore((s) => s.isLoading);
    const tasksError = useTaskStore((s) => s.error);
    const fetchTasks = useTaskStore((s) => s.fetchTasks);

    const exams = useExamStore((s) => s.exams);
    const examsLoading = useExamStore((s) => s.isLoading);
    const examsError = useExamStore((s) => s.error);
    const fetchExams = useExamStore((s) => s.fetchExams);

    useEffect(() => {
        void fetchTasks();
        void fetchExams();
    }, [fetchTasks, fetchExams]);

    const refetch = useCallback(() => {
        void fetchTasks();
        void fetchExams();
    }, [fetchTasks, fetchExams]);

    const events = useMemo(
        () => buildCalendarEvents(tasks, exams),
        [tasks, exams],
    );

    return {
        events,
        isLoading: tasksLoading || examsLoading,
        error: tasksError ?? examsError,
        refetch,
    };
}