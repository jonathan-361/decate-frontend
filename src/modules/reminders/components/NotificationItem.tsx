import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NotificationEntry } from "@/modules/reminders/schemas";
import { CATEGORY_META } from "@/modules/reminders/data/reminderMeta";

interface NotificationItemProps {
  entry: NotificationEntry;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export function NotificationItem({
  entry,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const { icon: Icon, label } = CATEGORY_META[entry.category];

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
          {!entry.read && <span className="sr-only"> (sin leer)</span>}
        </p>
        {entry.description && (
          <p className="text-sm text-muted-foreground">{entry.description}</p>
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>

      <div className="flex shrink-0 items-center">
        {!entry.read && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Marcar como leída"
            onClick={() => onMarkRead(entry.id)}
          >
            <Check className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Eliminar notificación"
          onClick={() => onDelete(entry.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}