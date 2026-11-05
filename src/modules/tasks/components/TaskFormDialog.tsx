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
import type { Task, TaskPriority, TaskStatus } from "@/modules/tasks/schemas";
import { SUBJECTS, SUBJECT_COLORS } from "@/modules/tasks/data/mockTasks";

const priorityConfig: Record<TaskPriority, { color: string; dotColor: string }> = {
  Alta: { color: "text-destructive", dotColor: "bg-destructive" },
  Media: { color: "text-amber-600", dotColor: "bg-amber-500" },
  Baja: { color: "text-muted-foreground", dotColor: "bg-muted-foreground/50" },
};

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: Task | null;
  onSave: (task: Omit<Task, "id">) => void;
}

export function TaskFormDialog({ open, onClose, initial, onSave }: TaskFormDialogProps) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [dueTime, setDueTime] = useState(initial?.dueTime ?? "23:59");
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? "Media");
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "pendiente");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description);
      setSubject(initial.subject);
      setDueDate(initial.dueDate);
      setDueTime(initial.dueTime);
      setPriority(initial.priority);
      setStatus(initial.status);
    } else {
      setTitle("");
      setDescription("");
      setSubject("");
      setDueDate("");
      setDueTime("23:59");
      setPriority("Media");
      setStatus("pendiente");
    }
  }, [initial, open]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      subject: subject || "Otra",
      subjectColor: SUBJECT_COLORS[subject] ?? SUBJECT_COLORS["Otra"],
      dueDate,
      dueTime,
      priority,
      status,
      hasAttachment: initial?.hasAttachment ?? false,
    });
    onClose();
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
          {/* Title */}
          <Field>
            <FieldLabel>
              <Label htmlFor="task-title">Título *</Label>
            </FieldLabel>
            <Input
              id="task-title"
              placeholder="Ej. Práctica de laboratorio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>
              <Label htmlFor="task-desc">Descripción</Label>
            </FieldLabel>
            <Textarea
              id="task-desc"
              placeholder="Detalles de la tarea, instrucciones, notas…"
              className="min-h-20 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          {/* Subject */}
          <Field>
            <FieldLabel>
              <Label>Materia</Label>
            </FieldLabel>
            <Select value={subject} onValueChange={(v) => setSubject(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una materia" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className={`inline-block size-2 rounded-full mr-2 ${SUBJECT_COLORS[s]}`} />
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Date + Time row */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>
                <Label htmlFor="task-date">Fecha de entrega</Label>
              </FieldLabel>
              <Input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>
                <Label htmlFor="task-time">Hora</Label>
              </FieldLabel>
              <Input
                id="task-time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </Field>
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>
                <Label>Prioridad</Label>
              </FieldLabel>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Alta", "Media", "Baja"] as TaskPriority[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      <span className={`inline-block size-2 rounded-full mr-2 ${priorityConfig[p].dotColor}`} />
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
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en-proceso">En proceso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>

        <Separator />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {isEdit ? "Guardar cambios" : "Crear tarea"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

