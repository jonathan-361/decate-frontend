import { BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { RemindersEmptyState } from "@/modules/reminders/components/RemindersEmptyState";
import { UpcomingReminderRow } from "@/modules/reminders/components/UpcomingReminderRow";
import type { UpcomingReminder } from "@/modules/reminders/schemas";
import { groupBySubject } from "@/modules/reminders/data/reminderMeta";

interface UpcomingRemindersProps {
  reminders: UpcomingReminder[];
  disabled?: boolean;
}

export function UpcomingReminders({
  reminders,
  disabled,
}: UpcomingRemindersProps) {
  const groups = groupBySubject(reminders);

  if (groups.length === 0) {
    return (
      <RemindersEmptyState
        icon={BellOff}
        title="Sin avisos programados"
        description="Cuando agregues tareas o exámenes pendientes, aparecerán aquí por materia."
      />
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key}>
          <div className="mb-3 flex items-center gap-2">
            <span
              className={cn("size-2 shrink-0 rounded-full", group.color)}
              aria-hidden="true"
            />
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              {group.subject}
            </h3>
            <span className="text-xs text-muted-foreground">
              {group.items.length}{" "}
              {group.items.length === 1 ? "pendiente" : "pendientes"}
            </span>
          </div>
          <ul className="divide-y divide-border rounded-none border border-border">
            {group.items.map((reminder) => (
              <UpcomingReminderRow
                key={reminder.id}
                reminder={reminder}
                disabled={disabled || !reminder.enabled}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}