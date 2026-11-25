import { useCallback, useEffect } from "react";
import { useLocation } from "react-router";
import { paths } from "@/modules/core/routes/paths/path";
import { checkAndNotifyUpcoming } from "@/modules/core/services/notifications";
import { useTaskStore } from "@/modules/tasks/stores/task.store";
import { useExamStore } from "@/modules/exams/stores/exam.store";
import { useNotificationStore } from "@/modules/reminders/stores/notification.store";

/** Devuelve una función que revisa tareas y exámenes y dispara los avisos pendientes. */
export function useUpcomingCheck() {
  const tasks = useTaskStore((s) => s.tasks);
  const exams = useExamStore((s) => s.exams);
  const notifications = useNotificationStore((s) => s.items);
  const createNotification = useNotificationStore((s) => s.createNotification);

  return useCallback(
    () =>
      checkAndNotifyUpcoming({
        tasks,
        exams,
        registeredTaskIds: new Set(
          notifications.flatMap((n) => (n.tareaId ? [n.tareaId] : [])),
        ),
        registeredExamIds: new Set(
          notifications.flatMap((n) => (n.examenId ? [n.examenId] : [])),
        ),
        register: (origin, data) => createNotification(origin, data),
      }),
    [tasks, exams, notifications, createNotification],
  );
}

export function useTaskNotifications() {
  const location = useLocation();
  const tasks = useTaskStore((s) => s.tasks);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const exams = useExamStore((s) => s.exams);
  const fetchExams = useExamStore((s) => s.fetchExams);
  const hasLoaded = useNotificationStore((s) => s.hasLoaded);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const check = useUpcomingCheck();

  // Historial de avisos: se carga una vez para no repetir notificaciones ya registradas.
  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  // Asegura que tareas y exámenes estén cargados si el usuario entra directo a rutas secundarias.
  // Home y las páginas de tareas/exámenes ya gestionan su propia carga.
  useEffect(() => {
    const path = location.pathname;
    if (tasks.length === 0 && path !== paths.home && path !== paths.tasks) {
      void fetchTasks();
    }
    if (exams.length === 0 && path !== paths.home && path !== paths.exams) {
      void fetchExams();
    }
  }, [tasks.length, exams.length, fetchTasks, fetchExams, location.pathname]);

  useEffect(() => {
    if (!hasLoaded) return;
    if (tasks.length === 0 && exams.length === 0) return;

    void check();

    const interval = window.setInterval(() => {
      void check();
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [check, hasLoaded, tasks.length, exams.length]);
}