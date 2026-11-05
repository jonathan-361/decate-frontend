import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationsTabProps {
  notifyTasks: boolean;
  onNotifyTasksChange: (val: boolean) => void;
  notifyExams: boolean;
  onNotifyExamsChange: (val: boolean) => void;
  notifyClasses: boolean;
  onNotifyClassesChange: (val: boolean) => void;
  notifyEmail: boolean;
  onNotifyEmailChange: (val: boolean) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (val: boolean) => void;
  taskLeadTime: string;
  onTaskLeadTimeChange: (val: string) => void;
  examLeadTime: string;
  onExamLeadTimeChange: (val: string) => void;
  classLeadTime: string;
  onClassLeadTimeChange: (val: string) => void;
}

export function NotificationsTab({
  notifyTasks,
  onNotifyTasksChange,
  notifyExams,
  onNotifyExamsChange,
  notifyClasses,
  onNotifyClassesChange,
  notifyEmail,
  onNotifyEmailChange,
  soundEnabled,
  onSoundEnabledChange,
  taskLeadTime,
  onTaskLeadTimeChange,
  examLeadTime,
  onExamLeadTimeChange,
  classLeadTime,
  onClassLeadTimeChange,
}: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
            Avisos de actividades académicas
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Elige qué eventos deben emitir alertas para que nunca olvides una entrega importante.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-border">
          {/* Tareas */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5 pr-4">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Tareas próximas a vencer
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Recibe recordatorios antes de la fecha y hora de entrega de cada trabajo escolar.
              </p>
            </div>
            <Switch checked={notifyTasks} onCheckedChange={onNotifyTasksChange} />
          </div>

          {/* Exámenes */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Alertas de exámenes y evaluaciones
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Avisos de preparación anticipada con cuenta regresiva de días restantes.
              </p>
            </div>
            <Switch checked={notifyExams} onCheckedChange={onNotifyExamsChange} />
          </div>

          {/* Clases */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Recordatorios de clases del día
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Notificación con aula y profesor antes de que comience tu próxima materia.
              </p>
            </div>
            <Switch checked={notifyClasses} onCheckedChange={onNotifyClassesChange} />
          </div>

          {/* Correo */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Resumen matutino por correo
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Envío diario a las 07:00 AM con las actividades programadas para la jornada.
              </p>
            </div>
            <Switch checked={notifyEmail} onCheckedChange={onNotifyEmailChange} />
          </div>

          {/* Sonido */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5 pr-4">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Sonidos y alertas en la aplicación
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Reproducir tono discreto al recibir un aviso o completar una tarea.
              </p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={onSoundEnabledChange} />
          </div>
        </div>
      </div>

      {/* Lead times configuration */}
      <div className="border border-border bg-card p-6 space-y-5">
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
            Tiempo de anticipación
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configura con cuánta anticipación deseas que Dacate te avise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Anticipación para tareas</Label>
            <Select value={taskLeadTime} onValueChange={(v) => onTaskLeadTimeChange(v ?? "24h")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6h">6 horas antes</SelectItem>
                <SelectItem value="12h">12 horas antes</SelectItem>
                <SelectItem value="24h">24 horas antes (1 día)</SelectItem>
                <SelectItem value="48h">48 horas antes (2 días)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Anticipación para exámenes</Label>
            <Select value={examLeadTime} onValueChange={(v) => onExamLeadTimeChange(v ?? "3d")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 día antes</SelectItem>
                <SelectItem value="3d">3 días antes</SelectItem>
                <SelectItem value="5d">5 días antes</SelectItem>
                <SelectItem value="1w">1 semana antes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Aviso antes de clase</Label>
            <Select value={classLeadTime} onValueChange={(v) => onClassLeadTimeChange(v ?? "15m")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5 minutos antes</SelectItem>
                <SelectItem value="10m">10 minutos antes</SelectItem>
                <SelectItem value="15m">15 minutos antes</SelectItem>
                <SelectItem value="30m">30 minutos antes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

