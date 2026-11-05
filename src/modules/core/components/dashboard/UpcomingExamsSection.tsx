import { Link } from "react-router";
import { ArrowRight, FlaskConical } from "lucide-react";
import type { UpcomingExamSummary } from "@/modules/core/data/mockDashboard";

interface UpcomingExamsSectionProps {
  exams: UpcomingExamSummary[];
}

export function UpcomingExamsSection({ exams }: UpcomingExamsSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Próximos exámenes
        </h2>
        <Link
          to="/exams"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Ver todo
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="border border-border rounded-none divide-y divide-border">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <div
              className={`flex size-8 items-center justify-center rounded-none ${exam.subjectColor}/10 shrink-0`}
            >
              <FlaskConical className="size-4 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug truncate">
                {exam.name}
              </p>
              <p className="text-xs text-muted-foreground">{exam.subject}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-medium text-foreground">{exam.date}</p>
              <p className="text-xs text-muted-foreground">en {exam.daysLeft} días</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

