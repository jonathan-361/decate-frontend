import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { paths } from "@/modules/core/routes/paths/path";
import { AppLayout } from "@/modules/core/components/AppLayout";
import type { ThemeMode } from "@/modules/settings/schemas";
import { AppearanceTab } from "@/modules/settings/components/AppearanceTab";
import { NotificationsTab } from "@/modules/settings/components/NotificationsTab";
import { SyncTab } from "@/modules/settings/components/SyncTab";
import { AccountTab } from "@/modules/settings/components/AccountTab";

export default function SettingsPage() {
  const navigate = useNavigate();

  // Appearance states
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [weekStart, setWeekStart] = useState<string>("lunes");
  const [timeFormat, setTimeFormat] = useState<string>("24h");
  const [defaultCalendarView, setDefaultCalendarView] = useState<string>("mes");

  // Notifications states
  const [notifyTasks, setNotifyTasks] = useState(true);
  const [notifyExams, setNotifyExams] = useState(true);
  const [notifyClasses, setNotifyClasses] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [taskLeadTime, setTaskLeadTime] = useState("24h");
  const [examLeadTime, setExamLeadTime] = useState("3d");
  const [classLeadTime, setClassLeadTime] = useState("15m");

  // Sync & Storage states
  const [autoSync, setAutoSync] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Hoy a las 10:04 AM");
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Hace unos segundos");
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3500);
    }, 1200);
  };

  const handleResetData = () => {
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  const handleLogout = () => {
    navigate(paths.login);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Configuración
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra tus preferencias de visualización, notificaciones, sincronización y privacidad.
          </p>
        </div>

        {/* Global notification feedback banner */}
        {syncSuccess && (
          <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <p className="font-medium">Sincronización en la nube completada exitosamente.</p>
          </div>
        )}

        {resetSuccess && (
          <div className="flex items-center gap-3 border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300">
            <CheckCircle2 className="size-4 shrink-0" />
            <p className="font-medium">Los datos locales de la aplicación han sido restablecidos.</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <Tabs defaultValue="apariencia" className="space-y-6">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border rounded-none pb-0 h-auto gap-4"
          >
            <TabsTrigger value="apariencia" className="pb-3 text-xs">
              Apariencia
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="pb-3 text-xs">
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="sincronizacion" className="pb-3 text-xs">
              Sincronización y Datos
            </TabsTrigger>
            <TabsTrigger value="cuenta" className="pb-3 text-xs">
              Cuenta y Sesión
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apariencia">
            <AppearanceTab
              theme={theme}
              onThemeChange={setTheme}
              weekStart={weekStart}
              onWeekStartChange={setWeekStart}
              timeFormat={timeFormat}
              onTimeFormatChange={setTimeFormat}
              defaultCalendarView={defaultCalendarView}
              onDefaultCalendarViewChange={setDefaultCalendarView}
            />
          </TabsContent>

          <TabsContent value="notificaciones">
            <NotificationsTab
              notifyTasks={notifyTasks}
              onNotifyTasksChange={setNotifyTasks}
              notifyExams={notifyExams}
              onNotifyExamsChange={setNotifyExams}
              notifyClasses={notifyClasses}
              onNotifyClassesChange={setNotifyClasses}
              notifyEmail={notifyEmail}
              onNotifyEmailChange={setNotifyEmail}
              soundEnabled={soundEnabled}
              onSoundEnabledChange={setSoundEnabled}
              taskLeadTime={taskLeadTime}
              onTaskLeadTimeChange={setTaskLeadTime}
              examLeadTime={examLeadTime}
              onExamLeadTimeChange={setExamLeadTime}
              classLeadTime={classLeadTime}
              onClassLeadTimeChange={setClassLeadTime}
            />
          </TabsContent>

          <TabsContent value="sincronizacion">
            <SyncTab
              autoSync={autoSync}
              onAutoSyncChange={setAutoSync}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onManualSync={handleManualSync}
              onResetData={handleResetData}
            />
          </TabsContent>

          <TabsContent value="cuenta">
            <AccountTab onLogout={handleLogout} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

