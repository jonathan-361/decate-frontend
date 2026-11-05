import { Link } from "react-router";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TodayClassSummary } from "@/modules/core/data/mockDashboard";

interface TodayClassesSectionProps {
  classes: TodayClassSummary[];
}

export function TodayClassesSection({ classes }: TodayClassesSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Clases de hoy
        </h2>
        <Link
          to="/schedule"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Ver todo
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="border border-border rounded-none divide-y divide-border">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              cls.current ? "bg-primary/5" : "hover:bg-muted/50"
            } transition-colors`}
          >
            <div
              className={`w-0.5 self-stretch rounded-full shrink-0 ${cls.color} ${
                cls.done ? "opacity-30" : ""
              }`}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium leading-snug truncate ${
                  cls.done ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {cls.subject}
              </p>
              <p className="text-xs text-muted-foreground">
                {cls.time} · {cls.room}
              </p>
            </div>
            {cls.done ? (
              <CircleCheck className="size-4 text-muted-foreground/50 shrink-0" />
            ) : (
              <Badge variant={cls.current ? "default" : "secondary"} className="shrink-0">
                {cls.status}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

