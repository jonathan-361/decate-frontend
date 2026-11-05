import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exam } from "@/modules/exams/data/mockExams";
import {
  formatCountdown,
  getTimeRemaining,
  isExamUrgent,
} from "@/modules/exams/data/examMeta";

interface ExamCountdownProps {
  exam: Exam;
}

/** Tiempo restante en una línea, para el encabezado de cada tarjeta. */
export function ExamCountdown({ exam }: ExamCountdownProps) {
  const remaining = getTimeRemaining(exam.date);
  const urgent = isExamUrgent(exam);
  const Icon = urgent ? AlertCircle : Clock;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-xs font-medium",
        urgent ? "text-destructive" : "text-muted-foreground",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {formatCountdown(remaining)}
    </span>
  );
}
