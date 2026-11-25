
import { useNavigate } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageContainer, PageHeader } from "@/components/custom";
import { paths } from "@/modules/core/routes/paths/path";
import { useThemeStore } from "@/modules/core/stores/theme.store";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useSettingsStore } from "@/modules/settings/stores/settings.store";
import { AppearanceTab } from "@/modules/settings/components/AppearanceTab";
import { NotificationsTab } from "@/modules/settings/components/NotificationsTab";
import { AccountTab } from "@/modules/settings/components/AccountTab";

export default function SettingsPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  // Appearance states
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Settings persistidas en IndexedDB
  const {
    weekStart,
    setWeekStart,
    timeFormat,
    setTimeFormat,
    defaultCalendarView,
    setDefaultCalendarView,
    notifyEmail,
    setNotifyEmail,
    soundEnabled,
    setSoundEnabled,
  } = useSettingsStore();






  const handleLogout = () => {
    logout();
    navigate(paths.login);
  };

  return (
    <PageContainer size="md">
      <PageHeader
        title="Configuración"
        description="Administra tus preferencias de visualización, notificaciones, sincronización y privacidad."
      />

      {/* Navigation Tabs */}
      <Tabs defaultValue="apariencia" className="min-w-0 space-y-6">
        <TabsList
          variant="line"
          className="h-auto w-full max-w-full justify-start gap-4 overflow-x-auto overscroll-x-contain rounded-none border-b border-border pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <TabsTrigger value="apariencia" className="shrink-0 pb-3 text-xs">
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="shrink-0 pb-3 text-xs">
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="cuenta" className="shrink-0 pb-3 text-xs">
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
            notifyEmail={notifyEmail}
            onNotifyEmailChange={setNotifyEmail}
            soundEnabled={soundEnabled}
            onSoundEnabledChange={setSoundEnabled}
          />
        </TabsContent>

        <TabsContent value="cuenta">
          <AccountTab onLogout={handleLogout} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}