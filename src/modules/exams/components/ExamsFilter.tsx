import { Button } from "@/components/ui/button";
import type { ExamFilter } from "@/modules/exams/schemas";

interface ExamsFilterProps {
  value: ExamFilter;
  counts: Record<ExamFilter, number>;
  onChange: (value: ExamFilter) => void;
}

const OPTIONS: { value: ExamFilter; label: string }[] = [
  { value: "upcoming", label: "Próximos" },
  { value: "past", label: "Pasados" },
  { value: "all", label: "Todos" },
];

export function ExamsFilter({ value, counts, onChange }: ExamsFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar exámenes"
      className="inline-flex self-start border border-border"
    >
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "ghost"}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label} ({counts[option.value]})
        </Button>
      ))}
    </div>
  );
}