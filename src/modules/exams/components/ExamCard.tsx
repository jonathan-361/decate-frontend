import { CalendarDays, MapPin, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExamCountdown } from "@/modules/exams/components/ExamCountdown";
import { ExamTopicsList } from "@/modules/exams/components/ExamTopicsList";
import { StudyReminders } from "@/modules/exams/components/StudyReminders";
import type { Exam } from "@/modules/exams/data/mockExams";
import { formatExamSchedule, isPastExam } from "@/modules/exams/data/examMeta";

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  const past = isPastExam(exam);
  const schedule = formatExamSchedule(exam);

  return (
    <article
      className={cn(
        "group flex flex-col rounded-none border border-border bg-card transition-colors hover:border-foreground/20",
        past && "opacity-60",
      )}
    >
      {/* Encabezado: nombre, materia y tiempo restante */}
      <header className="space-y-3 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  exam.subjectColor,
                )}
                aria-hidden="true"
              />
              {exam.subject}
            </p>
            <h3 className="font-heading text-lg font-semibold uppercase leading-snug tracking-wider text-foreground">
              {exam.name}
            </h3>
          </div>

          {/* Acciones: visibles en móvil, reveladas al pasar el cursor en escritorio */}
          <div className="flex shrink-0 gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Editar ${exam.name}`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Eliminar ${exam.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <ExamCountdown exam={exam} />
      </header>

      {/* Fecha, hora y lugar */}
      <div className="space-y-2 border-b border-border p-4 text-sm text-foreground">
        <p className="flex items-center gap-2.5">
          <CalendarDays
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span>
            <span className="capitalize">{schedule.date}</span> ·{" "}
            {schedule.time}
          </span>
        </p>
        <p className="flex items-center gap-2.5">
          <MapPin
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          {exam.location}
        </p>
      </div>

      {/* Temas */}
      <div className="border-b border-border p-4">
        <ExamTopicsList topics={exam.topics} />
      </div>

      {/* Recordatorios */}
      <div className="p-4">
        <StudyReminders reminders={exam.reminders} disabled={past} />
      </div>
    </article>
  );
}
