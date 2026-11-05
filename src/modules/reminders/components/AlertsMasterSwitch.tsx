import { Bell, BellOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AlertsMasterSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

/** Interruptor general: pausa todos los avisos sin perder la configuración. */
export function AlertsMasterSwitch({
  enabled,
  onChange,
}: AlertsMasterSwitchProps) {
  const Icon = enabled ? Bell : BellOff;

  return (
    <div className="flex items-center gap-4 rounded-none border border-border bg-card p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-muted">
        <Icon
          className={
            enabled ? "size-5 text-foreground" : "size-5 text-muted-foreground"
          }
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <Label
          htmlFor="all-reminders"
          className="text-sm font-semibold text-foreground"
        >
          {enabled ? "Avisos activados" : "Avisos en pausa"}
        </Label>
        <p className="text-xs text-muted-foreground">
          {enabled
            ? "Recibirás avisos de tareas, exámenes y clases según tu configuración."
            : "No recibirás ningún aviso. Tu configuración se conserva al reactivarlos."}
        </p>
      </div>
      <Switch id="all-reminders" checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}
