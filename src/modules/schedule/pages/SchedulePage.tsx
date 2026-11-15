import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, SectionHeader } from "@/components/custom";
import { INITIAL_MATERIAS } from "@/modules/schedule/data/mockSchedule";
import { WeeklyScheduleGrid } from "@/modules/schedule/components/WeeklyScheduleGrid";
import { MateriaCard } from "@/modules/schedule/components/MateriaCard";
import { SubjectFormDialog } from "@/modules/schedule/components/SubjectFormDialog";

export default function SchedulePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <PageContainer size="lg">
        <PageHeader
          title="Horario semanal"
          description={`${INITIAL_MATERIAS.length} materias · Lunes a viernes · 07:00–21:00`}
          actions={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              Registrar materia
            </Button>
          }
        />

        {/* Weekly grid */}
        <WeeklyScheduleGrid materias={INITIAL_MATERIAS} />

        {/* Registered subjects */}
        <section>
          <SectionHeader title="Materias registradas" />
          <div className="space-y-2">
            {INITIAL_MATERIAS.map((materia) => (
              <MateriaCard key={materia.id} materia={materia} />
            ))}
          </div>
        </section>

        <SubjectFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </PageContainer>
  );
}
