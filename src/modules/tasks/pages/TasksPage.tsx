import { useState } from "react";
import { Plus, Search, CircleCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer, PageHeader } from "@/components/custom";
import { AppLayout } from "@/modules/core/components/AppLayout";
import type { Task, TaskStatus } from "@/modules/tasks/schemas";
import { INITIAL_TASKS, SUBJECT_COLORS } from "@/modules/tasks/data/mockTasks";
import { TaskCard } from "@/modules/tasks/components/TaskCard";
import { TaskFormDialog } from "@/modules/tasks/components/TaskFormDialog";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("todas");
  const [filterSubject, setFilterSubject] = useState<string>("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ── Filter logic ──
  const filtered = tasks.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchPriority =
      filterPriority === "todas" || t.priority === filterPriority;
    const matchSubject =
      filterSubject === "todas" || t.subject === filterSubject;
    return matchSearch && matchPriority && matchSubject;
  });

  const byStatus = (status: TaskStatus) =>
    filtered.filter((t) => t.status === status);

  const counts = {
    all: filtered.length,
    pendiente: byStatus("pendiente").length,
    "en-proceso": byStatus("en-proceso").length,
    completada: byStatus("completada").length,
  };

  // ── Handlers ──
  const handleSave = (data: Omit<Task, "id">) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t)),
      );
    } else {
      setTasks((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setEditingTask(null);
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "completada" ? "pendiente" : "completada",
            }
          : t,
      ),
    );
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const uniqueSubjects = [...new Set(tasks.map((t) => t.subject))];

  return (
    <AppLayout>
      <PageContainer size="md">
        <PageHeader
          title="Tareas y actividades"
          description={`${counts.pendiente + counts["en-proceso"]} pendientes · ${counts.completada} completadas`}
          actions={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Nueva tarea
            </Button>
          }
        />

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar tareas…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Select
            value={filterSubject}
            onValueChange={(v) => setFilterSubject(v ?? "todas")}
          >
            <SelectTrigger className="w-auto min-w-36">
              <SelectValue placeholder="Materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las materias</SelectItem>
              {uniqueSubjects.map((s) => (
                <SelectItem key={s} value={s}>
                  <span
                    className={`inline-block size-2 rounded-full mr-2 ${
                      SUBJECT_COLORS[s] ?? "bg-muted-foreground"
                    }`}
                  />
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterPriority}
            onValueChange={(v) => setFilterPriority(v ?? "todas")}
          >
            <SelectTrigger className="w-auto min-w-36">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda prioridad</SelectItem>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs view */}
        <Tabs defaultValue="pendiente">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border rounded-none pb-0 h-auto"
          >
            {(
              [
                { value: "pendiente", label: "Pendientes" },
                { value: "en-proceso", label: "En proceso" },
                { value: "completada", label: "Completadas" },
              ] as const
            ).map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative pb-3"
              >
                {tab.label}
                {counts[tab.value] > 0 && (
                  <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                    {counts[tab.value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {(["pendiente", "en-proceso", "completada"] as TaskStatus[]).map(
            (status) => (
              <TabsContent key={status} value={status} className="mt-4">
                {byStatus(status).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-none">
                    <CircleCheck className="size-8 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {status === "completada"
                        ? "Aún no hay tareas completadas"
                        : "No hay tareas en esta categoría"}
                    </p>
                    {status === "pendiente" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3"
                        onClick={openCreate}
                      >
                        <Plus className="size-3.5" />
                        Crear tarea
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {byStatus(status).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ),
          )}
        </Tabs>
      </PageContainer>

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingTask(null);
        }}
        initial={editingTask}
        onSave={handleSave}
      />
    </AppLayout>
  );
}
