import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BellRing } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { paths } from "@/modules/core/routes/paths/path";
import {
  getNotificationSettings,
  isNotificationSupported,
  requestNotificationPermission,
  saveNotificationSettings,
  showLocalNotification,
} from "@/modules/core/services/notifications";

interface NotificationsTabProps {
  notifyEmail: boolean;
  onNotifyEmailChange: (val: boolean) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (val: boolean) => void;
}

/** Canales de entrega. Qué avisar y con cuánta anticipación vive en Recordatorios. */
export function NotificationsTab({
  notifyEmail,
  onNotifyEmailChange,
  soundEnabled,
  onSoundEnabledChange,
}: NotificationsTabProps) {
  const [browserEnabled, setBrowserEnabled] = useState(false);

  useEffect(() => {
    void getNotificationSettings().then((settings) => {
      const granted =
        isNotificationSupported() && Notification.permission === "granted";
      setBrowserEnabled(settings.enabled && granted);
    });
  }, []);

  const handleBrowserToggle = async (checked: boolean) => {
    if (!checked) {
      setBrowserEnabled(false);
      await saveNotificationSettings({ enabled: false });
      return;
    }

    if (!isNotificationSupported()) {
      toast.error("Tu navegador no soporta notificaciones nativas.");
      return;
    }

    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      setBrowserEnabled(false);
      await saveNotificationSettings({ enabled: false });
      toast.error(
        "Permiso denegado. Habilita las notificaciones en la configuración de tu navegador.",
      );
      return;
    }

    setBrowserEnabled(true);
    await saveNotificationSettings({ enabled: true });
    toast.success("Notificaciones del navegador activadas");
  };

  const handleTestNotification = async () => {
    if (!isNotificationSupported() || Notification.permission !== "granted") {
      setBrowserEnabled(false);
      await saveNotificationSettings({ enabled: false });
      toast.error(
        "El permiso de notificaciones está bloqueado en tu navegador. Habilítalo en su configuración y vuelve a activar el interruptor.",
      );
      return;
    }

    const shown = await showLocalNotification(
      "Prueba de notificación · Dacate",
      {
        body: "Así se verán tus recordatorios de tareas y exámenes próximos.",
        url: paths.tasks,
      },
    );

    if (shown) {
      toast.success(
        "Notificación enviada. Si no la ves, revisa el modo No molestar o el Asistente de concentración de tu sistema.",
      );
    } else {
      toast.error(
        "No se pudo mostrar la notificación. Recarga la app e inténtalo de nuevo.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 border border-border bg-card p-6">
        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
            Cómo recibir los avisos
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Elige los canales por los que Dacate te avisa.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-border">
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5 pr-4">
              <Label
                htmlFor="notify-browser"
                className="text-xs font-semibold text-foreground"
              >
                Notificaciones en el navegador
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Muestra alertas nativas del sistema operativo antes de tus
                entregas mientras Dacate esté abierto.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {browserEnabled && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleTestNotification()}
                >
                  <BellRing className="size-3.5" />
                  Probar
                </Button>
              )}
              <Switch
                id="notify-browser"
                checked={browserEnabled}
                onCheckedChange={(val) => void handleBrowserToggle(val)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <Label
                htmlFor="notify-email"
                className="text-xs font-semibold text-foreground"
              >
                Resumen matutino por correo
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Envío diario a las 07:00 AM con las actividades programadas para
                la jornada.
              </p>
            </div>
            <Switch
              id="notify-email"
              checked={notifyEmail}
              onCheckedChange={onNotifyEmailChange}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <Label
                htmlFor="notify-sound"
                className="text-xs font-semibold text-foreground"
              >
                Sonidos en la aplicación
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Reproducir un tono discreto al recibir un aviso o completar una
                tarea.
              </p>
            </div>
            <Switch
              id="notify-sound"
              checked={soundEnabled}
              onCheckedChange={onSoundEnabledChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
            Avisos por tipo y anticipación
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Activa o desactiva los avisos de tareas y exámenes, y elige con
            cuánta anticipación llegan.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          render={<Link to={paths.reminders} />}
        >
          Ir a recordatorios
        </Button>
      </div>
    </div>
  );
}