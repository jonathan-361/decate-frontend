import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { NotificationEntry } from "@/modules/reminders/data/mockReminders";
import { CATEGORY_META } from "@/modules/reminders/data/reminderMeta";

interface NotificationItemProps {
  entry: NotificationEntry;
}

export function NotificationItem({ entry }: NotificationItemProps) {
  const { icon: Icon } = CATEGORY_META[entry.category];

  return (
    <li
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 transition-colors",
        !entry.read && "bg-muted/50",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-none bg-muted">
        <Icon className="size-4 text-foreground" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={cn(
            "text-sm leading-snug text-foreground",
            entry.read ? "font-normal" : "font-semibold",
          )}
        >
          {entry.title}
        </p>
        <p className="text-sm text-muted-foreground">{entry.description}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(entry.receivedAt, {
            addSuffix: true,
            locale: es,
          })}
        </p>
      </div>

      {!entry.read && (
        <>
          <span
            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden="true"
          />
          <span className="sr-only">Sin leer</span>
        </>
      )}
    </li>
  );
}
