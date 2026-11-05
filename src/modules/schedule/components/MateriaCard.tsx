import { Clock, MapPin, Pencil, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Materia } from "@/modules/schedule/schemas/schedule.schema";
import { SUBJECT_COLOR_STYLES } from "@/modules/schedule/data/mockSchedule";

interface MateriaCardProps {
  materia: Materia;
}

export function MateriaCard({ materia }: MateriaCardProps) {
  const styles = SUBJECT_COLOR_STYLES[materia.color];

  return (
    <div className="group flex gap-3 border border-border rounded-none p-4 hover:border-foreground/20 transition-colors">
      <span
        className={`w-0.5 self-stretch shrink-0 ${styles.bar}`}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-sm font-medium leading-snug text-foreground">
          {materia.name}
        </p>

        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <UserRound className="size-3" />
            {materia.professor}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {materia.room}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Clock className="size-3" />
            {materia.startTime}–{materia.endTime}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {materia.days.map((day) => (
            <span
              key={day}
              className="px-1.5 py-0.5 border border-border text-[10px] font-semibold tracking-widest uppercase text-muted-foreground"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          aria-label="Editar materia"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          aria-label="Eliminar materia"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}