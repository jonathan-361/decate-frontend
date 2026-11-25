import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
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
import { extractIncomingShareData } from "@/modules/core/services/webShare";
import type { Task, TaskPayload, TaskStatus } from "@/modules/tasks/schemas";
import {
  getMateriaColor,
  getMateriaLabel,
} from "@/modules/tasks/data/taskMeta";
import { useTaskStore } from "@/modules/tasks/stores/task.store";
import { dueDateTime } from "@/modules/tasks/utils/taskDate";
import { TaskCard } from "@/modules/tasks/components/TaskCard";
import { TaskFormDialog } from "@/modules/tasks/components/TaskFormDialog";

const TABS: { value: TaskStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendientes" },
  { value: "EnProceso", label: "En proceso" },
  { value: "Completado", label: "Completadas" },
];

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Ocurrió un error";

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("todas");
  const [filterSubject, setFilterSubject] = useState<string>("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sharedPrefill, setSharedPrefill] = useState<Partial<TaskPayload> | null>(null);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  // Captura contenido compartido hacia Dacate desde otras aplicaciones (Web Share Target)
  useEffect(() => {
    const incoming = extractIncomingShareData(searchParams);
    if (!incoming) return;

    const descriptionParts = [incoming.text, incoming.url].filter(Boolean);
    setEditingTask(null);
    setSharedPrefill({
      titulo: incoming.title || incoming.text.slice(0, 80) || "Tarea compartida",
      descripcion: descriptionParts.join("\n"),
    });
    setDialogOpen(true);
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const availableSubjects = Array.from(
    new Set(tasks.map((t) => t.materia).filter(Boolean)),
  ).sort((a, b) => getMateriaLabel(a).localeCompare(getMateriaLabel(b), "es"));

  const subjectFilterItems: Record<string, string> = {
    todas: "Todas las materias",
    ...Object.fromEntries(
      availableSubjects.map((m) => [m, getMateriaLabel(m)]),
    ),
  };

  const activeSubjectFilter =
    filterSubject === "todas" || availableSubjects.includes(filterSubject)
      ? filterSubject
      : "todas";

  // ── Filtros en cliente ──
  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.titulo.toLowerCase().includes(q) ||
      getMateriaLabel(t.materia).toLowerCase().includes(q) ||
      t.materia.toLowerCase().includes(q);
    const matchPriority =
      filterPriority === "todas" || t.prioridad === filterPriority;
    const matchSubject =
      activeSubjectFilter === "todas" || t.materia === activeSubjectFilter;
    return matchSearch && matchPriority && matchSubject;
  });

  // El backend no ordena: se ordena por fecha de entrega.
  const byStatus = (estado: TaskStatus) =>
    filtered
      .filter((t) => t.estado === estado)
      .sort((a, b) => dueDateTime(a).getTime() - dueDateTime(b).getTime());

  const counts: Record<TaskStatus, number> = {
    Pendiente: byStatus("Pendiente").length,
    EnProceso: byStatus("EnProceso").length,
    Completado: byStatus("Completado").length,
  };

  // ── Handlers ──
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
    setSharedPrefill(null);
  };

  const handleSave = async (payload: TaskPayload) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
        toast.success("Tarea actualizada");
      } else {
        await createTask(payload);
        if (!navigator.onLine) {
          toast.success(
            "Tarea guardada sin conexión (se sincronizará al conectar)",
          );
        } else {
          toast.success("Tarea creada");
        }
      }
      closeDialog();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      toast.success("Tarea eliminada");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await updateTask(task.id, {
        estado: task.estado === "Completado" ? "Pendiente" : "Completado",
      });
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const handleEdit = (task: Task) => {
    setSharedPrefill(null);
    setEditingTask(task);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setSharedPrefill(null);
    setEditingTask(null);
    setDialogOpen(true);
  };

  return (
    <PageContainer size="md">
      <PageHeader
        title="Tareas y actividades"
        description={`${counts.Pendiente + counts.EnProceso} pendientes · ${counts.Completado} completadas`}
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Nueva tarea
          </Button>
        }
      />

      {/* Barra de filtros */}
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
          value={activeSubjectFilter}
          items={subjectFilterItems}
          onValueChange={(v) => setFilterSubject(v ?? "todas")}
        >
          <SelectTrigger className="w-auto min-w-36">
            <SelectValue placeholder="Materia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las materias</SelectItem>
            {availableSubjects.map((m) => (
              <SelectItem key={m} value={m}>
                <span
                  className={`inline-block size-2 rounded-full mr-2 ${getMateriaColor(m)}`}
                />
                {getMateriaLabel(m)}
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

      {error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-none">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => void fetchTasks()}
          >
            Reintentar
          </Button>
        </div>
      ) : isLoading && tasks.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Cargando tareas…
        </p>
      ) : (
        <Tabs defaultValue="Pendiente">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border rounded-none pb-0 h-auto"
          >
            {TABS.map((tab) => (
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

          {TABS.map(({ value: estado }) => (
            <TabsContent key={estado} value={estado} className="mt-4">
              {counts[estado] === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-none">
                  <CircleCheck className="size-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {estado === "Completado"
                      ? "Aún no hay tareas completadas"
                      : "No hay tareas en esta categoría"}
                  </p>
                  {estado === "Pendiente" && (
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
                  {byStatus(estado).map((task) => (
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
          ))}
        </Tabs>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        initial={editingTask}
        prefill={sharedPrefill}
        onSave={handleSave}
      />
    </PageContainer>
  );
}