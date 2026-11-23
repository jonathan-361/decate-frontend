import { useEffect } from "react";
import { useLocation } from "react-router";
import { paths } from "@/modules/core/routes/paths/path";
import { checkAndNotifyUpcomingTasks } from "@/modules/core/services/notifications";
import { useTaskStore } from "@/modules/tasks/stores/task.store";

export function useTaskNotifications() {
  const location = useLocation();
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  // Asegura que las tareas estén cargadas si el usuario entra directo a rutas secundarias (ej. /reminders, /schedule).
  // En /home y /tasks, sus propias páginas ya gestionan la llamada a fetchTasks().
  useEffect(() => {
    if (
      tasks.length === 0 &&
      location.pathname !== paths.home &&
      location.pathname !== paths.tasks
    ) {
      void fetchTasks();
    }
  }, [tasks.length, fetchTasks, location.pathname]);

  useEffect(() => {
    if (tasks.length === 0) return;

    void checkAndNotifyUpcomingTasks(tasks);

    const interval = window.setInterval(() => {
      void checkAndNotifyUpcomingTasks(tasks);
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [tasks]);
}
