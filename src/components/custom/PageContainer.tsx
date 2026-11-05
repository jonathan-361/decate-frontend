import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  md: "max-w-5xl", // Dashboard, Exámenes, Tareas
  lg: "max-w-6xl", // Calendario, Horario
} as const;

interface PageContainerProps {
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}

/** Ancho máximo, centrado, ritmo vertical y alineación a la izquierda de toda página. */
export function PageContainer({
  size = "md",
  className,
  children,
}: PageContainerProps) {
  return (
    <div className={cn("mx-auto space-y-6 text-left", SIZES[size], className)}>
      {children}
    </div>
  );
}
