import { useState } from "react";
import { CheckCheck, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/modules/reminders/components/NotificationItem";
import { RemindersEmptyState } from "@/modules/reminders/components/RemindersEmptyState";
import type {
  HistoryFilter,
  NotificationEntry,
} from "@/modules/reminders/schemas";

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "task", label: "Tareas" },
  { value: "exam", label: "Exámenes" },
];

interface NotificationHistoryProps {
  entries: NotificationEntry[];
  error?: string | null;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

export function NotificationHistory({
  entries,
  error,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClearAll,
}: NotificationHistoryProps) {
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const visible =
    filter === "all" ? entries : entries.filter((e) => e.category === filter);
  const hasUnread = entries.some((e) => !e.read);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-full self-start overflow-x-auto">
          <div
            role="group"
            aria-label="Filtrar historial"
            className="inline-flex border border-border"
          >
            {FILTERS.map((item) => (
              <Button
                key={item.value}
                variant={filter === item.value ? "default" : "ghost"}
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasUnread}
            onClick={onMarkAllRead}
          >
            <CheckCheck className="size-3.5" />
            Marcar como leído
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={entries.length === 0}
            onClick={onClearAll}
          >
            <Trash2 className="size-3.5" />
            Borrar historial
          </Button>
        </div>
      </div>

      {error && entries.length === 0 && (
        <p className="border border-destructive/40 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <RemindersEmptyState
          icon={History}
          title="Sin notificaciones"
          description="Aquí verás los avisos que ya recibiste."
        />
      ) : (
        <ul className="divide-y divide-border rounded-none border border-border">
          {visible.map((entry) => (
            <NotificationItem
              key={entry.id}
              entry={entry}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}