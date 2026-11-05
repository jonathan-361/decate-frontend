import { BellOff } from "lucide-react";
import { SectionHeader } from "@/components/custom";
import { RemindersEmptyState } from "@/modules/reminders/components/RemindersEmptyState";
import { UpcomingReminderRow } from "@/modules/reminders/components/UpcomingReminderRow";
import type { UpcomingReminder } from "@/modules/reminders/data/mockReminders";
import { groupUpcoming } from "@/modules/reminders/data/reminderMeta";

interface UpcomingRemindersProps {
  reminders: UpcomingReminder[];
  disabled?: boolean;
}

export function UpcomingReminders({
  reminders,
  disabled,
}: UpcomingRemindersProps) {
  const groups = groupUpcoming(reminders);

  if (groups.length === 0) {
    return (
      <RemindersEmptyState
        icon={BellOff}
        title="Sin avisos programados"
        description="Cuando agregues tareas, exámenes o clases, sus avisos aparecerán aquí."
      />
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key}>
          <SectionHeader title={group.label} />
          <ul className="divide-y divide-border rounded-none border border-border">
            {group.items.map((reminder) => (
              <UpcomingReminderRow
                key={reminder.id}
                reminder={reminder}
                disabled={disabled}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
