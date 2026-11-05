import { BellPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { StudyReminder } from "@/modules/exams/data/mockExams";
import { formatReminderDate } from "@/modules/exams/data/examMeta";

interface StudyRemindersProps {
  reminders: StudyReminder[];
  disabled?: boolean;
}

export function StudyReminders({ reminders, disabled }: StudyRemindersProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Recordatorios para estudiar
      </p>

      {reminders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aún no tienes recordatorios para este examen.
        </p>
      ) : (
        <ul className="divide-y divide-border border border-border">
          {reminders.map((reminder) => (
            <li key={reminder.id}>
              <label className="flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50">
                <Checkbox
                  defaultChecked={reminder.done}
                  disabled={disabled}
                  className="mt-0.5"
                  aria-label={reminder.text}
                />
                <span className="min-w-0 flex-1 space-y-0.5">
                  <span
                    className={cn(
                      "block text-sm leading-snug text-foreground",
                      reminder.done && "text-muted-foreground line-through",
                    )}
                  >
                    {reminder.text}
                  </span>
                  <span className="block text-xs capitalize text-muted-foreground">
                    {formatReminderDate(reminder.date)}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {!disabled && (
        <Button variant="outline" size="sm" className="w-full">
          <BellPlus className="size-3.5" />
          Agregar recordatorio
        </Button>
      )}
    </div>
  );
}
