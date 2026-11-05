import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ThemeMode } from "@/modules/settings/schemas";

interface AppearanceTabProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  weekStart: string;
  onWeekStartChange: (val: string) => void;
  timeFormat: string;
  onTimeFormatChange: (val: string) => void;
  defaultCalendarView: string;
  onDefaultCalendarViewChange: (val: string) => void;
}

export function AppearanceTab({
  theme,
  onThemeChange,
  weekStart,
  onWeekStartChange,
  timeFormat,
  onTimeFormatChange,
  defaultCalendarView,
  onDefaultCalendarViewChange,
}: AppearanceTabProps) {
  return (
    <div className="space-y-6">
      {/* Theme Selector */}
      <div className="border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
            Tema de la interfaz
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Elige la paleta visual que mejor se adapte a tus horas de estudio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Light */}
          <button
            type="button"
            onClick={() => onThemeChange("light")}
            className={`flex flex-col items-center gap-2.5 p-4 border text-left transition-all relative ${
              theme === "light"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="flex size-9 items-center justify-center border border-border bg-background">
              <Sun className="size-4 text-amber-500" />
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold block text-foreground">Tema Claro</span>
              <span className="text-[11px] text-muted-foreground">Fondo blanco cálido</span>
            </div>
            {theme === "light" && (
              <span className="absolute top-2 right-2 text-primary">
                <Check className="size-3.5" />
              </span>
            )}
          </button>

          {/* Dark */}
          <button
            type="button"
            onClick={() => onThemeChange("dark")}
            className={`flex flex-col items-center gap-2.5 p-4 border text-left transition-all relative ${
              theme === "dark"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="flex size-9 items-center justify-center border border-border bg-slate-900 text-white">
              <Moon className="size-4 text-blue-400" />
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold block text-foreground">Tema Oscuro</span>
              <span className="text-[11px] text-muted-foreground">Ideal para la noche</span>
            </div>
            {theme === "dark" && (
              <span className="absolute top-2 right-2 text-primary">
                <Check className="size-3.5" />
              </span>
            )}
          </button>

          {/* System */}
          <button
            type="button"
            onClick={() => onThemeChange("system")}
            className={`flex flex-col items-center gap-2.5 p-4 border text-left transition-all relative ${
              theme === "system"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/40"
            }`}
          >
            <div className="flex size-9 items-center justify-center border border-border bg-muted">
              <Laptop className="size-4 text-muted-foreground" />
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold block text-foreground">Sistema</span>
              <span className="text-[11px] text-muted-foreground">Sincroniza con tu OS</span>
            </div>
            {theme === "system" && (
              <span className="absolute top-2 right-2 text-primary">
                <Check className="size-3.5" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Calendar & Time Format Preferences */}
      <div className="border border-border bg-card p-6 space-y-5">
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
            Calendario y formato de hora
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ajusta cómo se presentan las fechas y horarios de tus clases y entregas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Inicio de semana */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Primer día de la semana</Label>
            <Select value={weekStart} onValueChange={(v) => onWeekStartChange(v ?? "lunes")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunes">Lunes (Estándar académico)</SelectItem>
                <SelectItem value="domingo">Domingo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Define la primera columna en tus vistas semanal y mensual.
            </p>
          </div>

          {/* Formato horario */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Formato horario</Label>
            <Select value={timeFormat} onValueChange={(v) => onTimeFormatChange(v ?? "24h")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 horas (Ej. 14:00)</SelectItem>
                <SelectItem value="12h">12 horas (Ej. 02:00 PM)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Afecta el horario de clases y las horas límite de tareas.
            </p>
          </div>

          {/* Vista por defecto */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium">Vista inicial del calendario académico</Label>
            <Select
              value={defaultCalendarView}
              onValueChange={(v) => onDefaultCalendarViewChange(v ?? "mes")}
            >
              <SelectTrigger className="w-full sm:w-1/2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Vista mensual completa</SelectItem>
                <SelectItem value="semana">Vista semanal detallada</SelectItem>
                <SelectItem value="dia">Agenda diaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

