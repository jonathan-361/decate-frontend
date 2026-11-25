import { FlaskConical } from "lucide-react";
import { SectionHeader } from "@/components/custom";
import type { Exam } from "@/modules/exams/schemas";
import {
  formatCountdown,
  formatExamSchedule,
  getTimeRemaining,
} from "@/modules/exams/data/examMeta";
import { examDateTime } from "@/modules/exams/utils/examDate";

interface UpcomingExamsSectionProps {
  exams: Exam[];
  isLoading?: boolean;
}

export function UpcomingExamsSection({ exams, isLoading }: UpcomingExamsSectionProps) {
  return (
    <section>
      <SectionHeader title="Próximos exámenes" linkTo="/exams" />

      <div className="border border-border rounded-none divide-y divide-border">
        {exams.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            {isLoading ? "Cargando exámenes…" : "No tienes exámenes próximos."}
          </p>
        ) : (
          exams.map((exam) => {
            const schedule = formatExamSchedule(exam);
            return (
              <div
                key={exam.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex size-8 items-center justify-center rounded-none bg-muted shrink-0">
                  <FlaskConical className="size-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug truncate">
                    {exam.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{exam.materia}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-foreground capitalize">
                    {schedule.date}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCountdown(getTimeRemaining(examDateTime(exam)))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}