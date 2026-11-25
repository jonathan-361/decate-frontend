import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ReminderCategory,
  ReminderRule,
} from "@/modules/reminders/schemas";
import {
  CATEGORY_META,
  LEAD_TIME_OPTIONS,
} from "@/modules/reminders/data/reminderMeta";

interface ReminderRuleCardProps {
  category: ReminderCategory;
  rule: ReminderRule;
  disabled?: boolean;
  onToggle: (enabled: boolean) => void;
  onLeadTimeChange: (leadTime: string) => void;
}

/** Activa o desactiva los avisos de un tipo y define con cuánta anticipación llegan. */
export function ReminderRuleCard({
  category,
  rule,
  disabled,
  onToggle,
  onLeadTimeChange,
}: ReminderRuleCardProps) {
  const { label, description, icon: Icon } = CATEGORY_META[category];
  const options = LEAD_TIME_OPTIONS[category];
  const selectId = `lead-time-${category}`;

  return (
    <section
      className={cn(
        "space-y-4 rounded-none border border-border bg-card p-5 transition-opacity",
        disabled && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-none bg-muted">
          <Icon className="size-4 text-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
            {label}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <Switch
          checked={rule.enabled}
          onCheckedChange={onToggle}
          disabled={disabled}
          aria-label={`Avisos de ${label.toLowerCase()}`}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={selectId} className="text-xs font-medium">
          Avisarme con anticipación
        </Label>
        <Select
          items={options}
          value={rule.leadTime}
          onValueChange={(value) => onLeadTimeChange(value ?? rule.leadTime)}
          disabled={disabled || !rule.enabled}
        >
          <SelectTrigger id={selectId} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}