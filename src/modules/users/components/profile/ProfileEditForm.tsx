import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/modules/users/schemas";
import type {
  PerfilUsuario,
  UpdatePerfilPayload,
} from "@/modules/users/services/profile.service";

interface ProfileEditFormProps {
  perfil: PerfilUsuario;
  onSave: (payload: UpdatePerfilPayload) => Promise<void>;
}

export function ProfileEditForm({ perfil, onSave }: ProfileEditFormProps) {
  const fullName = [
    perfil.nombre,
    perfil.apellidoPaterno,
    perfil.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      telefono: perfil.telefono ?? "",
      carrera: perfil.carrera ?? "",
      semestre: String(perfil.semestre || 1),
      turno: perfil.turno ?? "MATUTINO",
    },
  });

  useEffect(() => {
    reset({
      telefono: perfil.telefono ?? "",
      carrera: perfil.carrera ?? "",
      semestre: String(perfil.semestre || 1),
      turno: perfil.turno ?? "MATUTINO",
    });
  }, [perfil, reset]);

  const onSubmit = async (data: UpdateProfileFormValues) => {
    const payload: UpdatePerfilPayload = {};

    if (data.telefono !== perfil.telefono) payload.telefono = data.telefono;
    if (data.carrera !== perfil.carrera) payload.carrera = data.carrera;
    if (Number(data.semestre) !== perfil.semestre) {
      payload.semestre = Number(data.semestre);
    }
    if (data.turno !== perfil.turno) payload.turno = data.turno;

    if (Object.keys(payload).length === 0) {
      toast.info("No hay cambios para guardar.");
      return;
    }

    await onSave(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border border-border bg-card p-6 sm:p-8 space-y-6"
    >
      <div>
        <h2 className="font-heading text-lg font-semibold tracking-wider uppercase text-foreground">
          Información académica y personal
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Consulta tus datos registrados y actualiza tu carrera, semestre, turno o teléfono.
        </p>
      </div>

      <Separator />

      <FieldSet disabled={isSubmitting} className="border-0 p-0 m-0 min-w-0">
        <FieldGroup className="gap-5">
          {/* Datos de registro (solo lectura en backend) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>
                <Label htmlFor="fullName">Nombre completo</Label>
              </FieldLabel>
              <Input id="fullName" value={fullName} disabled />
            </Field>

            <Field>
              <FieldLabel>
                <Label htmlFor="studentId">Matrícula</Label>
              </FieldLabel>
              <Input
                id="studentId"
                value={perfil.matricula > 0 ? String(perfil.matricula) : ""}
                disabled
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>
                <Label htmlFor="email">Correo electrónico</Label>
              </FieldLabel>
              <Input id="email" type="email" value={perfil.correo} disabled />
            </Field>

            <Field>
              <FieldLabel>
                <Label htmlFor="university">Universidad / Institución</Label>
              </FieldLabel>
              <Input id="university" value={perfil.universidad} disabled />
            </Field>
          </div>

          <Separator />

          {/* Campos editables permitidos por PATCH /api/usuarios/actualizar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.carrera}>
              <FieldLabel>
                <Label htmlFor="carrera">Carrera</Label>
              </FieldLabel>
              <Input
                id="carrera"
                placeholder="Ej. Ingeniería en Sistemas"
                aria-invalid={!!errors.carrera}
                {...register("carrera")}
              />
              {errors.carrera && <FieldError errors={[errors.carrera]} />}
            </Field>

            <Field data-invalid={!!errors.telefono}>
              <FieldLabel>
                <Label htmlFor="telefono">Teléfono (10 dígitos)</Label>
              </FieldLabel>
              <Input
                id="telefono"
                type="tel"
                inputMode="numeric"
                placeholder="5512345678"
                aria-invalid={!!errors.telefono}
                {...register("telefono", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
              />
              {errors.telefono && <FieldError errors={[errors.telefono]} />}
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.semestre}>
              <FieldLabel>
                <Label htmlFor="semestre">Semestre</Label>
              </FieldLabel>
              <Controller
                name="semestre"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val ?? "1")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="semestre" className="w-full">
                      <SelectValue placeholder="Semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          {s}° Semestre
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.semestre && <FieldError errors={[errors.semestre]} />}
            </Field>

            <Field data-invalid={!!errors.turno}>
              <FieldLabel>
                <Label htmlFor="turno">Turno escolar</Label>
              </FieldLabel>
              <Controller
                name="turno"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) =>
                      field.onChange((val ?? "MATUTINO") as UpdateProfileFormValues["turno"])
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="turno" className="w-full">
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MATUTINO">Matutino</SelectItem>
                      <SelectItem value="VESPERTINO">Vespertino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.turno && <FieldError errors={[errors.turno]} />}
            </Field>
          </div>
        </FieldGroup>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || isSubmitting}
            onClick={() =>
              reset({
                telefono: perfil.telefono ?? "",
                carrera: perfil.carrera ?? "",
                semestre: String(perfil.semestre || 1),
                turno: perfil.turno ?? "MATUTINO",
              })
            }
            className="w-full sm:w-auto text-xs"
          >
            <RotateCcw className="size-3.5 mr-1" />
            Restablecer valores
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}