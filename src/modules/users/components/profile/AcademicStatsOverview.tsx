import { Link } from "react-router";
import { KeyRound } from "lucide-react";
import { paths } from "@/modules/core/routes/paths/path";
import { MOCK_STUDENT_STATS } from "@/modules/users/data/mockProfile";

export function AcademicStatsOverview() {
  return (
    <div className="border border-border bg-card p-5 space-y-4">
      <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
        Rendimiento del ciclo
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border/70 p-3 bg-muted/20">
          <span className="text-[11px] text-muted-foreground block">Promedio general</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-heading text-xl font-semibold text-foreground">
              {MOCK_STUDENT_STATS.gpa}
            </span>
            <span className="text-[10px] text-muted-foreground">/ {MOCK_STUDENT_STATS.maxGpa}</span>
          </div>
        </div>

        <div className="border border-border/70 p-3 bg-muted/20">
          <span className="text-[11px] text-muted-foreground block">Materias activas</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-heading text-xl font-semibold text-foreground">
              {MOCK_STUDENT_STATS.activeCourses}
            </span>
            <span className="text-[10px] text-muted-foreground">cursos</span>
          </div>
        </div>

        <div className="border border-border/70 p-3 bg-muted/20">
          <span className="text-[11px] text-muted-foreground block">Tareas entregadas</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-heading text-xl font-semibold text-foreground">
              {MOCK_STUDENT_STATS.completedTasks}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">
              {MOCK_STUDENT_STATS.completionPercentage}
            </span>
          </div>
        </div>

        <div className="border border-border/70 p-3 bg-muted/20">
          <span className="text-[11px] text-muted-foreground block">Exámenes rendidos</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-heading text-xl font-semibold text-foreground">
              {MOCK_STUDENT_STATS.passedExams}
            </span>
            <span className="text-[10px] text-muted-foreground">aprobados</span>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <Link
          to={paths.changePassword}
          className="w-full flex items-center justify-center gap-2 border border-border py-2 px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <KeyRound className="size-3.5 text-muted-foreground" />
          Cambiar contraseña
        </Link>
      </div>
    </div>
  );
}

