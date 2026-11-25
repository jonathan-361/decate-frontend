import { Link } from "react-router";
import { CheckSquare, FlaskConical, BookOpen, Clock } from "lucide-react";
import { paths } from "@/modules/core/routes/paths/path";
import { SectionHeader } from "@/components/custom";

const quickActions = [
  { icon: CheckSquare, label: "Nueva tarea", color: "text-emerald-600", path: paths.tasks },
  { icon: FlaskConical, label: "Nuevo examen", color: "text-blue-600", path: paths.exams },
  { icon: BookOpen, label: "Ver horario", color: "text-amber-600", path: paths.calendar },
  { icon: Clock, label: "Recordatorio", color: "text-purple-600", path: paths.reminders },
];

export function QuickAccessSection() {
  return (
    <section>
      <SectionHeader title="Acceso rápido" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex flex-col items-center gap-2 border border-border rounded-none p-4 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex size-10 items-center justify-center rounded-none bg-muted group-hover:bg-background transition-colors">
              <item.icon className={`size-5 ${item.color}`} />
            </div>
            <span className="text-xs font-medium text-foreground text-center leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

