import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { UpcomingReminder } from "@/modules/reminders/schemas";
import { CATEGORY_META } from "@/modules/reminders/data/reminderMeta";

interface UpcomingReminderRowProps {
  reminder: UpcomingReminder;
  disabled?: boolean;
}

export function UpcomingReminderRow({
  reminder,
  disabled,
}: UpcomingReminderRowProps) {
  const { icon: Icon } = CATEGORY_META[reminder.category];

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
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          {reminder.subject && (
            <>
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  reminder.subjectColor,
                )}
                aria-hidden="true"
              />
              <span>{reminder.subject}</span>
              <span className="text-muted-foreground/40">·</span>
            </>
          )}
          <span className="capitalize">{reminder.detail}</span>
        </div>
        <p className="text-xs capitalize text-muted-foreground">
          Aviso: {format(reminder.fireAt, "EEE d MMM · HH:mm", { locale: es })}
        </p>
      </div>
    </li>
  );
}