
import {
  Mail,
  Phone,
  Building2,
  GraduationCap,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PerfilUsuario } from "@/modules/users/services/profile.service";

interface StudentIdentityCardProps {
  perfil: PerfilUsuario;
}

const TURNO_LABEL: Record<PerfilUsuario["turno"], string> = {
  MATUTINO: "Matutino",
  VESPERTINO: "Vespertino",
};

export function StudentIdentityCard({ perfil }: StudentIdentityCardProps) {
  const fullName = [
    perfil.nombre,
    perfil.apellidoPaterno,
    perfil.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="border border-border bg-card p-6 flex flex-col items-start text-left">
      <div className="w-full flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-semibold text-foreground leading-snug">
            {fullName}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 break-all">
            <Mail className="size-3.5 shrink-0 text-muted-foreground" />
            {perfil.correo}
          </p>
        </div>

        {perfil.matricula > 0 && (
          <Badge variant="secondary" className="text-[11px] font-normal shrink-0">
            {perfil.matricula}
          </Badge>
        )}
      </div>

      <Separator className="my-5 w-full" />

      <div className="w-full space-y-3 text-xs">
        {perfil.telefono && (
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Phone className="size-3.5 shrink-0 text-foreground/70" />
            <span>{perfil.telefono}</span>
          </div>
        )}
        <div className="flex items-start gap-2.5 text-muted-foreground">
          <Building2 className="size-3.5 shrink-0 mt-0.5 text-foreground/70" />
          <span className="leading-snug">
            {perfil.universidad || "Universidad no especificada"}
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-muted-foreground">
          <GraduationCap className="size-3.5 shrink-0 mt-0.5 text-foreground/70" />
          <span className="leading-snug">
            {perfil.carrera || "Carrera no especificada"}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0 text-foreground/70" />
          <span>
            {perfil.semestre}° Semestre · {TURNO_LABEL[perfil.turno]}
          </span>
        </div>
      </div>
    </div>
  );
}