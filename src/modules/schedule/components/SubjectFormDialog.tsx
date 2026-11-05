import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { SubjectColor, WeekDay } from "@/modules/schedule/schemas/schedule.schema";
import {
  SUBJECT_COLOR_STYLES,
  WEEK_DAYS,
  DAY_LABELS,
} from "@/modules/schedule/data/mockSchedule";

interface SubjectFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SubjectFormDialog({ open, onClose }: SubjectFormDialogProps) {
  const [name, setName] = useState("");
  const [professor, setProfessor] = useState("");
  const [room, setRoom] = useState("");
  const [days, setDays] = useState<WeekDay[]>([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:30");
  const [color, setColor] = useState<SubjectColor>("blue");

  const toggleDay = (day: WeekDay) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg rounded-none">
        <DialogHeader>
          <DialogTitle>Registrar materia</DialogTitle>
          <DialogDescription>
            Completa los datos de la materia para incluirla en tu horario
            semanal.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4 py-2">
          {/* Nombre */}
          <Field>
            <FieldLabel>
              <Label htmlFor="materia-name">Materia *</Label>
            </FieldLabel>
            <Input
              id="materia-name"
              placeholder="Ej. Cálculo Diferencial"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          {/* Profesor + Aula */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>
                <Label htmlFor="materia-professor">Profesor</Label>
              </FieldLabel>
              <Input
                id="materia-professor"
                placeholder="Ej. Dra. Laura Mendoza"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>
                <Label htmlFor="materia-room">Aula o ubicación</Label>
              </FieldLabel>
              <Input
                id="materia-room"
                placeholder="Ej. Aula B-204"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </Field>
          </div>

          {/* Días de clase */}
          <Field>
            <FieldLabel>
              <Label>Días de clase</Label>
            </FieldLabel>
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              {WEEK_DAYS.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <Checkbox
                    checked={days.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                    aria-label={DAY_LABELS[day]}
                  />
                  <span className="text-sm text-muted-foreground">
                    {DAY_LABELS[day]}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          {/* Horario */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>
                <Label htmlFor="materia-start">Hora de inicio</Label>
              </FieldLabel>
              <Input
                id="materia-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>
                <Label htmlFor="materia-end">Hora de finalización</Label>
              </FieldLabel>
              <Input
                id="materia-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Field>
          </div>

          {/* Color identificador */}
          <Field>
            <FieldLabel>
              <Label>Color identificador</Label>
            </FieldLabel>
            <div className="flex items-center gap-2 pt-1">
              {(Object.keys(SUBJECT_COLOR_STYLES) as SubjectColor[]).map(
                (key) => (
                  <button
                    key={key}
                    type="button"
                    aria-label={`Color ${key}`}
                    aria-pressed={color === key}
                    onClick={() => setColor(key)}
                    className={`size-8 border transition-shadow ${SUBJECT_COLOR_STYLES[key].swatch} ${
                      color === key
                        ? "border-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
                        : "border-border hover:border-foreground/40"
                    }`}
                  />
                )
              )}
            </div>
          </Field>
        </FieldGroup>

        <Separator />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button">Guardar materia</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}