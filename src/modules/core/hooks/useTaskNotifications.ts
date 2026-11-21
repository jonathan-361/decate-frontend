import { useEffect } from "react";
import { checkAndNotifyUpcomingTasks } from "@/modules/core/services/notifications";
import { useTaskStore } from "@/modules/tasks/stores/task.store";

export function useTaskNotifications() {
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  // Asegura que las tareas estén cargadas aunque el usuario entre directo a /home o /reminders
  useEffect(() => {
    if (tasks.length === 0) {
      void fetchTasks();
    }
  }, [tasks.length, fetchTasks]);

  useEffect(() => {
    if (tasks.length === 0) return;

    void checkAndNotifyUpcomingTasks(tasks);

    const interval = window.setInterval(() => {
      void checkAndNotifyUpcomingTasks(tasks);
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [tasks]);
}
