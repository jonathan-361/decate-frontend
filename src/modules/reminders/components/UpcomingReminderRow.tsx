import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { UpcomingReminder } from "@/modules/reminders/schemas";
import { CATEGORY_META } from "@/modules/reminders/data/reminderMeta";

interface UpcomingReminderRowProps {
  reminder: UpcomingReminder;
  disabled?: boolean;
}

const formatWhen = (date: Date) =>
  format(date, "EEE d MMM · HH:mm", { locale: es });

export function UpcomingReminderRow({
  reminder,
  disabled,
}: UpcomingReminderRowProps) {
  const { icon: Icon } = CATEGORY_META[reminder.category];
  const dueLabel = reminder.category === "task" ? "Entrega" : "Examen";

  return (
    <li
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
        disabled && "opacity-60",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-none bg-muted">
        <Icon className="size-4 text-foreground" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-medium leading-snug text-foreground">
          {reminder.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {dueLabel}:{" "}
          <span className="capitalize">{formatWhen(reminder.dueAt)}</span>
          {reminder.location ? ` · ${reminder.location}` : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          {!reminder.enabled ? (
            "Avisos desactivados"
          ) : reminder.fired ? (
            "Aviso enviado"
          ) : (
            <>
              Aviso:{" "}
              <span className="capitalize">{formatWhen(reminder.fireAt)}</span>
            </>
          )}
        </p>
      </div>
    </li>
  );
}