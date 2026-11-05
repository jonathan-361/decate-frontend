import { FlaskConical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExamsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 border border-border px-6 py-16 text-center">
      <div className="flex size-10 items-center justify-center rounded-none bg-muted">
        <FlaskConical className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold uppercase tracking-wider text-foreground">
          Sin exámenes
        </h3>
        <p className="text-sm text-muted-foreground">
          Agrega la fecha de tu próximo examen para empezar a prepararte.
        </p>
      </div>
      <Button size="sm">
        <Plus className="size-3.5" />
        Nuevo examen
      </Button>
    </div>
  );
}
