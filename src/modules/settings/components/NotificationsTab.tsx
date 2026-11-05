import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { paths } from "@/modules/core/routes/paths/path";

interface NotificationsTabProps {
  notifyEmail: boolean;
  onNotifyEmailChange: (val: boolean) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (val: boolean) => void;
}

/** Solo canales de entrega. Qué avisar y con cuánta anticipación vive en Recordatorios. */
export function NotificationsTab({
  notifyEmail,
  onNotifyEmailChange,
  soundEnabled,
  onSoundEnabledChange,
}: NotificationsTabProps) {
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
            Activa o desactiva los avisos de tareas, exámenes y clases, y elige
            con cuánta anticipación llegan.
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
