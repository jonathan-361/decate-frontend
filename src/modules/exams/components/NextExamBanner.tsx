import { CalendarDays, MapPin } from "lucide-react";
import type { Exam } from "@/modules/exams/data/mockExams";
import {
  formatExamSchedule,
  getTimeRemaining,
} from "@/modules/exams/data/examMeta";

interface NextExamBannerProps {
  exam: Exam;
}

/** El único bloque de tinta de la página: el examen que sigue y su cuenta regresiva. */
export function NextExamBanner({ exam }: NextExamBannerProps) {
  const { days, hours, minutes } = getTimeRemaining(exam.date);
  const schedule = formatExamSchedule(exam);

  const units = [
    { value: days, label: "Días" },
    { value: hours, label: "Horas" },
    { value: minutes, label: "Minutos" },
  ];

  return (
    <section
      aria-label="Próximo examen"
      className="flex flex-col gap-6 rounded-none bg-primary p-6 text-primary-foreground lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="min-w-0 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
          Próximo examen
        </p>
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-wider">
            {exam.name}
          </h2>
          <p className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <span
              className={`inline-block size-1.5 rounded-full ${exam.subjectColor}`}
              aria-hidden="true"
            />
            {exam.subject}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-primary-foreground/80">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span className="capitalize">{schedule.date}</span> ·{" "}
            {schedule.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {exam.location}
          </span>
        </div>
      </div>

      <div
        className="grid shrink-0 grid-cols-3 divide-x divide-primary-foreground/20 border border-primary-foreground/20"
        role="timer"
        aria-label="Tiempo restante para el examen"
      >
        {units.map((unit) => (
          <div key={unit.label} className="min-w-20 px-5 py-3 text-center">
            <p className="text-3xl font-semibold tabular-nums leading-none">
              {String(unit.value).padStart(2, "0")}
            </p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/70">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
