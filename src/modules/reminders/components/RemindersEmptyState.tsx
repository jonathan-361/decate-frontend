import type { LucideIcon } from "lucide-react";

interface RemindersEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function RemindersEmptyState({
  icon: Icon,
  title,
  description,
}: RemindersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 border border-border px-6 py-14 text-center">
      <div className="flex size-10 items-center justify-center rounded-none bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
