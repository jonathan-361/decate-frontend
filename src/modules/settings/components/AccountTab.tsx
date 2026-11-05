import { Link } from "react-router";
import { KeyRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { paths } from "@/modules/core/routes/paths/path";

interface AccountTabProps {
  onLogout: () => void;
}

export function AccountTab({ onLogout }: AccountTabProps) {
  return (
    <div className="space-y-6">
      {/* Account Info & Security */}
      <div className="border border-border bg-card p-6 space-y-5">
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
            Seguridad de la cuenta
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Controla el acceso a tu cuenta académica y credenciales.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Contraseña de acceso
              </span>
              <p className="text-[11px] text-muted-foreground">
                Se recomienda cambiar tu contraseña periódicamente para proteger tus apuntes y evaluaciones.
              </p>
            </div>
            <Link to={paths.changePassword} className="shrink-0">
              <Button variant="outline" size="sm" className="text-xs">
                <KeyRound className="size-3.5 mr-1.5" />
                Actualizar contraseña
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Sesión activa en este dispositivo
              </span>
              <p className="text-[11px] text-muted-foreground">
                Conectado desde navegador de escritorio · IP: 189.204.xx.xx (México)
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] w-fit">
              Sesión actual
            </Badge>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground block">
            Cerrar sesión
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Finaliza la sesión actual de Dacate en este navegador de manera segura.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground text-xs shrink-0"
              />
            }
          >
            <LogOut className="size-3.5 mr-1.5" />
            Cerrar sesión
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Deseas cerrar tu sesión?</AlertDialogTitle>
              <AlertDialogDescription>
                Tendrás que ingresar nuevamente tus credenciales de acceso para volver a consultar tus tareas y clases.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Volver</AlertDialogCancel>
              <AlertDialogAction
                onClick={onLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cerrar sesión ahora
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

