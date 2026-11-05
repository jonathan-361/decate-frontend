import { Cloud, RefreshCw, Database, Download, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SyncTabProps {
  autoSync: boolean;
  onAutoSyncChange: (val: boolean) => void;
  isSyncing: boolean;
  lastSyncTime: string;
  onManualSync: () => void;
  onResetData: () => void;
}

export function SyncTab({
  autoSync,
  onAutoSyncChange,
  isSyncing,
  lastSyncTime,
  onManualSync,
  onResetData,
}: SyncTabProps) {
  return (
    <div className="space-y-6">
      {/* Cloud Sync */}
      <div className="border border-border bg-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
              Sincronización en la nube
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mantén tus tareas, exámenes y horarios actualizados en todos tus dispositivos.
            </p>
          </div>

          <Button size="sm" variant="outline" onClick={onManualSync} disabled={isSyncing}>
            <RefreshCw className={`size-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sincronizando..." : "Sincronizar ahora"}
          </Button>
        </div>

        <div className="border border-border p-4 bg-muted/20 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center bg-primary/10 text-primary border border-primary/20">
              <Cloud className="size-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Estado del servidor
              </span>
              <span className="text-[11px] text-muted-foreground">
                Última copia: {lastSyncTime}
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] text-emerald-600 dark:text-emerald-400">
            Conectado y seguro
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5 pr-4">
            <Label className="text-xs font-semibold text-foreground cursor-pointer">
              Sincronización automática periódica
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Actualiza los cambios automáticamente en segundo plano al estar conectado a internet.
            </p>
          </div>
          <Switch checked={autoSync} onCheckedChange={onAutoSyncChange} />
        </div>
      </div>

      {/* Local Data Management */}
      <div className="border border-border bg-card p-6 space-y-5">
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
            Almacenamiento y copia de respaldo
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestiona la copia de seguridad de tus asignaturas y datos locales guardados en este navegador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border p-4 bg-muted/10 space-y-2">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Espacio local en uso</span>
            </div>
            <p className="font-heading text-xl font-semibold text-foreground">3.8 MB</p>
            <p className="text-[11px] text-muted-foreground">
              Incluye 6 materias, 18 tareas y 4 exámenes almacenados para acceso sin conexión.
            </p>
          </div>

          <div className="border border-border p-4 bg-muted/10 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-medium text-foreground block">Exportar información</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Descarga una copia completa en formato JSON para transferir tus datos.
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-fit text-xs">
              <Download className="size-3.5 mr-1.5" />
              Exportar respaldo (.json)
            </Button>
          </div>
        </div>

        {/* Danger Zone: Reset local data */}
        <div className="border border-destructive/20 bg-destructive/5 p-4 sm:p-5 space-y-3 mt-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-destructive block">
                Restablecer base de datos local
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Esta acción limpiará la memoria caché y datos no sincronizados en este navegador. Tus
                datos guardados en la nube permanecerán intactos.
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs"
                />
              }
            >
              <Trash2 className="size-3.5 mr-1" />
              Borrar datos locales
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Restablecer datos locales?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se borrará la caché local del navegador para Dacate. Cualquier cambio que no se haya
                  sincronizado se perderá.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onResetData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, restablecer datos
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

