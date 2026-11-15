import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/custom";
import { ExamCard } from "@/modules/exams/components/ExamCard";
import { ExamsEmptyState } from "@/modules/exams/components/ExamsEmptyState";
import { ExamsFilter } from "@/modules/exams/components/ExamsFilter";
import { NextExamBanner } from "@/modules/exams/components/NextExamBanner";
import { MOCK_EXAMS, type ExamFilter } from "@/modules/exams/data/mockExams";
import { getPastExams, getUpcomingExams } from "@/modules/exams/data/examMeta";

export default function ExamsPage() {
  // Estado local solo para poder revisar el diseño de cada filtro.
  const [filter, setFilter] = useState<ExamFilter>("upcoming");

  const upcoming = getUpcomingExams(MOCK_EXAMS);
  const past = getPastExams(MOCK_EXAMS);
  const visible =
    filter === "upcoming"
      ? upcoming
      : filter === "past"
        ? past
        : [...upcoming, ...past];

  return (
    <PageContainer>
        <PageHeader
          title="Exámenes"
          description="Fechas, temas y recordatorios para llegar preparado a cada evaluación."
          actions={
            <Button size="sm">
              <Plus className="size-3.5" />
              Nuevo examen
            </Button>
          }
        />

        {/* Próximo examen */}
        {filter !== "past" && upcoming[0] && (
          <NextExamBanner exam={upcoming[0]} />
        )}

        <ExamsFilter
          value={filter}
          counts={{
            upcoming: upcoming.length,
            past: past.length,
            all: MOCK_EXAMS.length,
          }}
          onChange={setFilter}
        />

        {/* Lista */}
        {visible.length === 0 ? (
          <ExamsEmptyState />
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {visible.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </PageContainer>
  );
}
