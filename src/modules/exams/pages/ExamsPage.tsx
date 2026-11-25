import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageContainer, PageHeader } from "@/components/custom";
import { ExamCard } from "@/modules/exams/components/ExamCard";
import { ExamFormDialog } from "@/modules/exams/components/ExamFormDialog";
import { ExamsEmptyState } from "@/modules/exams/components/ExamsEmptyState";
import { ExamsFilter } from "@/modules/exams/components/ExamsFilter";
import { NextExamBanner } from "@/modules/exams/components/NextExamBanner";
import type {
  Exam,
  ExamFilter,
  ExamPayload,
} from "@/modules/exams/schemas";
import { getPastExams, getUpcomingExams } from "@/modules/exams/data/examMeta";
import { useExamStore } from "@/modules/exams/stores/exam.store";

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Ocurrió un error";

export default function ExamsPage() {
  const { exams, isLoading, error, fetchExams, createExam, updateExam, deleteExam } =
    useExamStore();
  const [filter, setFilter] = useState<ExamFilter>("upcoming");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deletingExam, setDeletingExam] = useState<Exam | null>(null);

  useEffect(() => {
    void fetchExams();
  }, [fetchExams]);

  const upcoming = getUpcomingExams(exams);
  const past = getPastExams(exams);
  const visible =
    filter === "upcoming"
      ? upcoming
      : filter === "past"
        ? past
        : [...upcoming, ...past];

  // ── Handlers ──
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingExam(null);
  };

  const openCreate = () => {
    setEditingExam(null);
    setDialogOpen(true);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setDialogOpen(true);
  };

  const handleSave = async (payload: ExamPayload) => {
    try {
      if (editingExam) {
        await updateExam(editingExam.id, payload);
        toast.success("Examen actualizado");
      } else {
        await createExam(payload);
        toast.success("Examen creado");
      }
      closeDialog();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const handleConfirmDelete = async () => {
    const target = deletingExam;
    if (!target) return;
    try {
      await deleteExam(target.id);
      toast.success("Examen eliminado");
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setDeletingExam(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Exámenes"
        description="Fechas, temas y recordatorios para llegar preparado a cada evaluación."
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-3.5" />
            Nuevo examen
          </Button>
        }
      />

      {error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-none">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => void fetchExams()}
          >
            Reintentar
          </Button>
        </div>
      ) : isLoading && exams.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Cargando exámenes…
        </p>
      ) : (
        <>
          {/* Próximo examen */}
          {filter !== "past" && upcoming[0] && (
            <NextExamBanner exam={upcoming[0]} />
          )}

          <ExamsFilter
            value={filter}
            counts={{
              upcoming: upcoming.length,
              past: past.length,
              all: exams.length,
            }}
            onChange={setFilter}
          />

          {/* Lista */}
          {visible.length === 0 ? (
            <ExamsEmptyState onCreate={openCreate} />
          ) : (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              {visible.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onEdit={handleEdit}
                  onDelete={setDeletingExam}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ExamFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        initial={editingExam}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!deletingExam}
        onOpenChange={(o) => !o && setDeletingExam(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este examen?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará {deletingExam ? `"${deletingExam.titulo}"` : "el examen"}{" "}
              de forma permanente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleConfirmDelete()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}