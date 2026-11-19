import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WeeklyProgressProps {
  completionRate: number;
}

export function WeeklyProgress({ completionRate }: WeeklyProgressProps) {
  return (
    <div className="border border-border bg-card rounded-none p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Progreso semanal
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">{completionRate}%</span> completado
        </span>
      </div>
      <Progress value={completionRate} aria-label="Progreso semanal" className="h-1.5" />
      <p className="text-xs text-muted-foreground">
        Completaste 17 de 25 actividades esta semana. ¡Buen ritmo!
      </p>
    </div>
  );
}

