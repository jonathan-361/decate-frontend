import { FlaskConical } from "lucide-react";
import { SectionHeader } from "@/components/custom";
import type { UpcomingExamSummary } from "@/modules/dashboard/data/mockDashboard";

interface UpcomingExamsSectionProps {
  exams: UpcomingExamSummary[];
}

export function UpcomingExamsSection({ exams }: UpcomingExamsSectionProps) {
  return (
    <section>
      <SectionHeader title="Próximos exámenes" linkTo="/exams" />

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

