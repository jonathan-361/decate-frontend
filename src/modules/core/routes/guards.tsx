import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { paths } from "@/modules/core/routes/paths/path";

/** Rutas privadas: redirige a login si no hay sesión activa */
export function PrivateGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to={paths.login} replace />;
}

/** Rutas públicas: redirige al home si ya hay sesión activa (ej. /login, /register) */
export function PublicGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return null;
  return isAuthenticated ? <Navigate to={paths.home} replace /> : <Outlet />;
}
