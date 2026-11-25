import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageContainer, PageHeader } from "@/components/custom";
import { paths } from "@/modules/core/routes/paths/path";
import {
  getNotificationSettings,
  isNotificationSupported,
  leadTimeFromMinutes,
  leadTimeToMinutes,
  requestNotificationPermission,
  saveNotificationSettings,
  showLocalNotification,
} from "@/modules/core/services/notifications";
import { useUpcomingCheck } from "@/modules/core/hooks/useTaskNotifications";
import { useTaskStore } from "@/modules/tasks/stores/task.store";
import { useExamStore } from "@/modules/exams/stores/exam.store";
import { useNotificationStore } from "@/modules/reminders/stores/notification.store";
import { AlertsMasterSwitch } from "@/modules/reminders/components/AlertsMasterSwitch";
import { NotificationHistory } from "@/modules/reminders/components/NotificationHistory";
import { ReminderRuleCard } from "@/modules/reminders/components/ReminderRuleCard";
import { UpcomingReminders } from "@/modules/reminders/components/UpcomingReminders";
import {
  INITIAL_RULES,
  LEAD_TIME_OPTIONS,
} from "@/modules/reminders/data/reminderMeta";
import type {
  ReminderCategory,
  ReminderRule,
} from "@/modules/reminders/schemas";
import {
  buildUpcomingReminders,
  toNotificationEntry,
} from "@/modules/reminders/utils/reminders";

const CATEGORIES: ReminderCategory[] = ["task", "exam"];

function CountChip({ value }: { value: number }) {
  return (
    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-none bg-muted px-1 text-[10px] font-semibold text-muted-foreground">
      {value}
    </span>
  );
}

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Ocurrió un error inesperado";

export default function RemindersPage() {
  const [allEnabled, setAllEnabled] = useState(false);
  const [rules, setRules] =
    useState<Record<ReminderCategory, ReminderRule>>(INITIAL_RULES);

  const tasks = useTaskStore((s) => s.tasks);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const exams = useExamStore((s) => s.exams);
  const fetchExams = useExamStore((s) => s.fetchExams);

  const items = useNotificationStore((s) => s.items);
  const historyError = useNotificationStore((s) => s.error);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const runCheck = useUpcomingCheck();

  useEffect(() => {
    void fetchTasks();
    void fetchExams();
    void fetchNotifications();
  }, [fetchTasks, fetchExams, fetchNotifications]);

  useEffect(() => {
    void getNotificationSettings().then((settings) => {
      const granted =
        isNotificationSupported() && Notification.permission === "granted";
      setAllEnabled(settings.enabled && granted);
      setRules({
        task: {
          enabled: settings.taskEnabled,
          leadTime: leadTimeFromMinutes(
            settings.taskLeadMinutes,
            LEAD_TIME_OPTIONS.task.map((o) => o.value),
            INITIAL_RULES.task.leadTime,
          ),
        },
        exam: {
          enabled: settings.examEnabled,
          leadTime: leadTimeFromMinutes(
            settings.examLeadMinutes,
            LEAD_TIME_OPTIONS.exam.map((o) => o.value),
            INITIAL_RULES.exam.leadTime,
          ),
        },
      });
    });
  }, []);

  const handleMasterToggle = async (enabled: boolean) => {
    if (!enabled) {
      setAllEnabled(false);
      await saveNotificationSettings({ enabled: false });
      toast.info("Avisos del navegador pausados");
      return;
    }

    if (!isNotificationSupported()) {
      toast.error("Tu navegador no soporta notificaciones nativas.");
      return;
    }

    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      setAllEnabled(false);
      await saveNotificationSettings({ enabled: false });
      toast.error(
        "Permiso denegado. Habilita las notificaciones en la configuración de tu navegador.",
      );
      return;
    }

    setAllEnabled(true);
    await saveNotificationSettings({ enabled: true });
    toast.success("Avisos del navegador activados");

    await showLocalNotification("Avisos activados en Dacate", {
      body: "Te notificaremos cuando tengas tareas o exámenes próximos.",
      url: paths.reminders,
    });

    await runCheck();
  };

  const updateRule = (
    category: ReminderCategory,
    patch: Partial<ReminderRule>,
  ) => {
    const updated = { ...rules[category], ...patch };
    setRules((prev) => ({ ...prev, [category]: updated }));

    const minutes = leadTimeToMinutes(updated.leadTime);
    void saveNotificationSettings(
      category === "task"
        ? { taskEnabled: updated.enabled, taskLeadMinutes: minutes }
        : { examEnabled: updated.enabled, examLeadMinutes: minutes },
    );
  };

  const upcoming = useMemo(
    () => buildUpcomingReminders(tasks, exams, rules),
    [tasks, exams, rules],
  );
  const entries = useMemo(() => items.map(toNotificationEntry), [items]);
  const unread = entries.filter((e) => !e.read).length;
  const scheduled = upcoming.filter((r) => r.enabled && !r.fired).length;

  const run = async (action: () => Promise<void>, success?: string) => {
    try {
      await action();
      if (success) toast.success(success);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleClearAll = () => {
    if (!window.confirm("¿Borrar todo el historial de notificaciones?")) return;
    void run(clearAll, "Historial borrado");
  };

  return (
    <PageContainer size="md">
      <PageHeader
        title="Recordatorios y avisos"
        description={`${scheduled} ${scheduled === 1 ? "aviso programado" : "avisos programados"} · ${unread} sin leer`}
      />

      <AlertsMasterSwitch
        enabled={allEnabled}
        onChange={(val) => void handleMasterToggle(val)}
      />

      <Tabs defaultValue="upcoming" className="min-w-0">
        <TabsList
          variant="line"
          className="h-auto w-full max-w-full justify-start gap-4 overflow-x-auto overscroll-x-contain rounded-none border-b border-border pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <TabsTrigger value="upcoming" className="relative shrink-0 pb-3">
            Próximos
            <CountChip value={upcoming.length} />
          </TabsTrigger>
          <TabsTrigger value="rules" className="relative shrink-0 pb-3">
            Anticipación
          </TabsTrigger>
          <TabsTrigger value="history" className="relative shrink-0 pb-3">
            Historial
            {unread > 0 && <CountChip value={unread} />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <UpcomingReminders reminders={upcoming} disabled={!allEnabled} />
        </TabsContent>

        <TabsContent value="rules" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CATEGORIES.map((category) => (
              <ReminderRuleCard
                key={category}
                category={category}
                rule={rules[category]}
                disabled={!allEnabled}
                onToggle={(enabled) => updateRule(category, { enabled })}
                onLeadTimeChange={(leadTime) =>
                  updateRule(category, { leadTime })
                }
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            El correo de resumen y los sonidos se ajustan en{" "}
            <Link
              to={paths.settings}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Configuración
            </Link>
            .
          </p>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <NotificationHistory
            entries={entries}
            error={historyError}
            onMarkRead={(id) => void run(() => markAsRead(id))}
            onMarkAllRead={() =>
              void run(markAllAsRead, "Notificaciones marcadas como leídas")
            }
            onDelete={(id) => void run(() => removeNotification(id))}
            onClearAll={handleClearAll}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}