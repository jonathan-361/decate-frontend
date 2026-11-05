import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /** Texto o JSX (útil cuando hay datos dinámicos con énfasis). */
  description?: ReactNode;
  /** Línea pequeña sobre el título, por ejemplo la fecha de hoy. */
  eyebrow?: string;
  /** Botones de acción alineados a la derecha. */
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
