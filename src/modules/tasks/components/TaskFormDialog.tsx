import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priorityConfig } from "@/components/custom";
import {
  taskFormSchema,
  taskPrioritySchema,
  taskStatusSchema,
} from "@/modules/tasks/schemas";
import type { Task, TaskPayload } from "@/modules/tasks/schemas";
import { ESTADO_LABEL, getMateriaLabel } from "@/modules/tasks/data/taskMeta";
import { toDateInput, toTimeInput } from "@/modules/tasks/utils/taskDate";

const EMPTY: TaskPayload = {
  titulo: "",
  descripcion: "",
  materia: "",
  fechaEntrega: "",
  hora: "23:59",
  prioridad: "Media",
  estado: "Pendiente",
};

const fromTask = (t: Task): TaskPayload => ({
  titulo: t.titulo,
  descripcion: t.descripcion,
  materia: getMateriaLabel(t.materia),
  fechaEntrega: toDateInput(t.fechaEntrega),
  hora: toTimeInput(t.hora),
  prioridad: t.prioridad,
  estado: t.estado,
});

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: Task | null;
  /** Datos precargados al crear una tarea (p. ej. desde Web Share Target). */
  prefill?: Partial<TaskPayload> | null;
  /** Debe resolver sin lanzar: el que llama muestra el error y decide si cierra. */
  onSave: (payload: TaskPayload) => Promise<void>;
}

export function TaskFormDialog({
  open,
  onClose,
  initial,
  prefill,
  onSave,
}: TaskFormDialogProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState<TaskPayload>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm(fromTask(initial));
    } else if (prefill) {
      setForm({ ...EMPTY, ...prefill });
    } else {
      setForm(EMPTY);
    }
  }, [initial, prefill, open]);

  const set = <K extends keyof TaskPayload>(key: K, value: TaskPayload[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const parsed = taskFormSchema.safeParse(form);

  const handleSave = async () => {
    if (!parsed.success) return;
    setSaving(true);
    await onSave(parsed.data);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-base font-semibold tracking-wider uppercase">
            {isEdit ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Modifica los datos de esta tarea."
              : "Completa los datos para crear una nueva tarea."}
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4 py-2">
          <Field>
            <FieldLabel>
              <Label htmlFor="task-title">Título *</Label>
            </FieldLabel>
            <Input
              id="task-title"
              placeholder="Ej. Práctica de laboratorio"
              value={form.titulo}
              onChange={(e) => set("titulo", e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>
              <Label htmlFor="task-desc">Descripción</Label>
            </FieldLabel>
            <Textarea
              id="task-desc"
              placeholder="Detalles de la tarea, instrucciones, notas…"
              className="min-h-20 resize-none"
              value={form.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>
              <Label htmlFor="task-subject">Materia *</Label>
            </FieldLabel>
            <Input
              id="task-subject"
              placeholder="Ej. Cálculo Diferencial"
              value={form.materia}
              onChange={(e) => set("materia", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>
                <Label htmlFor="task-date">Fecha de entrega *</Label>
              </FieldLabel>
              <Input
                id="task-date"
                type="date"
                value={form.fechaEntrega}
                onChange={(e) => set("fechaEntrega", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>
                <Label htmlFor="task-time">Hora</Label>
              </FieldLabel>
              <Input
                id="task-time"
                type="time"
                value={form.hora}
                onChange={(e) => set("hora", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>
                <Label>Prioridad</Label>
              </FieldLabel>
              <Select
                value={form.prioridad}
                onValueChange={(v) => v && set("prioridad", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskPrioritySchema.options.map((p) => (
                    <SelectItem key={p} value={p}>
                      <span
                        className={`inline-block size-2 rounded-full mr-2 ${priorityConfig[p].dotColor}`}
                      />
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>
                <Label>Estado</Label>
              </FieldLabel>
              <Select
                value={form.estado}
                items={ESTADO_LABEL}
                onValueChange={(v) => v && set("estado", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskStatusSchema.options.map((s) => (
                    <SelectItem key={s} value={s}>
                      {ESTADO_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>

        <Separator />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!parsed.success || saving}>
            {isEdit ? "Guardar cambios" : "Crear tarea"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}