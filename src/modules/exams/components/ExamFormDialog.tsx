import { useEffect, useState } from "react";
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
import { examFormSchema } from "@/modules/exams/schemas";
import type { Exam, ExamPayload } from "@/modules/exams/schemas";
import { toDateInput, toTimeInput } from "@/modules/exams/utils/examDate";

const EMPTY: ExamPayload = {
    titulo: "",
    materia: "",
    fecha: "",
    hora: "08:00",
    aula: "",
    temasEvaluar: "",
};

const fromExam = (e: Exam): ExamPayload => ({
    titulo: e.titulo,
    materia: e.materia,
    fecha: toDateInput(e.fecha),
    hora: toTimeInput(e.hora),
    aula: e.aula,
    temasEvaluar: e.temasEvaluar,
});

interface ExamFormDialogProps {
    open: boolean;
    onClose: () => void;
    initial?: Exam | null;
    /** Debe resolver sin lanzar: el que llama muestra el error y decide si cierra. */
    onSave: (payload: ExamPayload) => Promise<void>;
}

export function ExamFormDialog({
    open,
    onClose,
    initial,
    onSave,
}: ExamFormDialogProps) {
    const isEdit = !!initial;
    const [form, setForm] = useState<ExamPayload>(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(initial ? fromExam(initial) : EMPTY);
    }, [initial, open]);

    const set = <K extends keyof ExamPayload>(key: K, value: ExamPayload[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    const parsed = examFormSchema.safeParse(form);

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
                        {isEdit ? "Editar examen" : "Nuevo examen"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {isEdit
                            ? "Modifica los datos de este examen."
                            : "Completa los datos para registrar un nuevo examen."}
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup className="gap-4 py-2">
                    <Field>
                        <FieldLabel>
                            <Label htmlFor="exam-title">Título *</Label>
                        </FieldLabel>
                        <Input
                            id="exam-title"
                            placeholder="Ej. Examen parcial 2"
                            value={form.titulo}
                            onChange={(e) => set("titulo", e.target.value)}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>
                            <Label htmlFor="exam-subject">Materia *</Label>
                        </FieldLabel>
                        <Input
                            id="exam-subject"
                            placeholder="Ej. Cálculo Diferencial"
                            value={form.materia}
                            onChange={(e) => set("materia", e.target.value)}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field>
                            <FieldLabel>
                                <Label htmlFor="exam-date">Fecha *</Label>
                            </FieldLabel>
                            <Input
                                id="exam-date"
                                type="date"
                                value={form.fecha}
                                onChange={(e) => set("fecha", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>
                                <Label htmlFor="exam-time">Hora *</Label>
                            </FieldLabel>
                            <Input
                                id="exam-time"
                                type="time"
                                value={form.hora}
                                onChange={(e) => set("hora", e.target.value)}
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel>
                            <Label htmlFor="exam-room">Aula *</Label>
                        </FieldLabel>
                        <Input
                            id="exam-room"
                            placeholder="Ej. Aula B-204"
                            value={form.aula}
                            onChange={(e) => set("aula", e.target.value)}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>
                            <Label htmlFor="exam-topics">Temas a evaluar</Label>
                        </FieldLabel>
                        <Textarea
                            id="exam-topics"
                            placeholder={"Un tema por línea\nEj. Límites y continuidad"}
                            className="min-h-24 resize-none"
                            value={form.temasEvaluar ?? ""}
                            onChange={(e) => set("temasEvaluar", e.target.value)}
                        />
                    </Field>
                </FieldGroup>

                <Separator />

                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="outline" onClick={onClose} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={!parsed.success || saving}>
                        {isEdit ? "Guardar cambios" : "Crear examen"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}