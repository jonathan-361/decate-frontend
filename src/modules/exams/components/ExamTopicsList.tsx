interface ExamTopicsListProps {
  topics: string[];
}

export function ExamTopicsList({ topics }: ExamTopicsListProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Temas a evaluar
      </p>

      {topics.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aún no has agregado temas para este examen.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {topics.map((topic, index) => (
            <li
              key={`${topic}-${index}`}
              className="flex items-start gap-2.5 text-sm text-foreground"
            >
              <span
                className="mt-2 size-1 shrink-0 bg-foreground/40"
                aria-hidden="true"
              />
              {topic}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}