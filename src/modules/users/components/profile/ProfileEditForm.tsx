import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProfileFormValues } from "@/modules/users/schemas";

interface ProfileEditFormProps {
  formData: ProfileFormValues;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  onSave: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function ProfileEditForm({ formData, onChange, onSave, onReset }: ProfileEditFormProps) {
  return (
    <form onSubmit={onSave} className="border border-border bg-card p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="font-heading text-lg font-semibold tracking-wider uppercase text-foreground">
          Información académica y personal
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Actualiza tus credenciales estudiantiles y detalles del periodo escolar.
        </p>
      </div>

      <Separator />

      <FieldGroup className="gap-5">
        {/* Full Name & Student ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              <Label htmlFor="fullName">Nombre completo</Label>
            </FieldLabel>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="Tu nombre completo"
            />
          </Field>

          <Field>
            <FieldLabel>
              <Label htmlFor="studentId">Matrícula / Carnet estudiantil</Label>
            </FieldLabel>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => onChange("studentId", e.target.value)}
              placeholder="Ej. 2021-ISC-0942"
            />
          </Field>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              <Label htmlFor="email">Correo electrónico institucional</Label>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="correo@universidad.edu"
            />
          </Field>

          <Field>
            <FieldLabel>
              <Label htmlFor="phone">Teléfono de contacto</Label>
            </FieldLabel>
            <Input
              id="phone"
              type="tel"
              value={formData.phone ?? ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+52 55 ..."
            />
          </Field>
        </div>

        {/* University & Faculty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              <Label htmlFor="university">Universidad / Institución</Label>
            </FieldLabel>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => onChange("university", e.target.value)}
              placeholder="Nombre de la institución"
            />
          </Field>

          <Field>
            <FieldLabel>
              <Label htmlFor="faculty">Facultad o Campus</Label>
            </FieldLabel>
            <Input
              id="faculty"
              value={formData.faculty ?? ""}
              onChange={(e) => onChange("faculty", e.target.value)}
              placeholder="Ej. Facultad de Ingeniería"
            />
          </Field>
        </div>

        {/* Career, Semester & Shift */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field className="sm:col-span-1">
            <FieldLabel>
              <Label htmlFor="career">Carrera o Grado</Label>
            </FieldLabel>
            <Input
              id="career"
              value={formData.career}
              onChange={(e) => onChange("career", e.target.value)}
              placeholder="Ej. Licenciatura en..."
            />
          </Field>

          <Field>
            <FieldLabel>
              <Label>Semestre / Ciclo</Label>
            </FieldLabel>
            <Select
              value={formData.semester}
              onValueChange={(val) => onChange("semester", val ?? "1")}
            >
              <SelectTrigger>
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
          </Field>

          <Field>
            <FieldLabel>
              <Label>Turno escolar</Label>
            </FieldLabel>
            <Select
              value={formData.shift}
              onValueChange={(val) => onChange("shift", (val ?? "Matutino") as ProfileFormValues["shift"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Matutino">Matutino</SelectItem>
                <SelectItem value="Vespertino">Vespertino</SelectItem>
                <SelectItem value="Mixto">Mixto</SelectItem>
                <SelectItem value="Ejecutivo">Ejecutivo / Sabatino</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Academic Goals & Bio */}
        <Field>
          <FieldLabel>
            <Label htmlFor="bio">Objetivos del periodo / Notas de estudio</Label>
          </FieldLabel>
          <Textarea
            id="bio"
            rows={3}
            className="resize-none"
            value={formData.bio ?? ""}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Escribe tus objetivos para este semestre o notas personales..."
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Esta nota te servirá como recordatorio personal en tu panel diario.
          </p>
        </Field>
      </FieldGroup>

      <Separator />

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="w-full sm:w-auto text-xs"
        >
          <RotateCcw className="size-3.5 mr-1" />
          Restablecer valores
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button type="submit" className="w-full sm:w-auto">
            <Save className="size-4" />
            Guardar cambios
          </Button>
        </div>
      </div>
    </form>
  );
}

