import { Link, useLocation, Outlet } from "react-router";
import {
  GraduationCap,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Clock,
  FlaskConical,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { paths } from "@/modules/core/routes/paths/path";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clearServiceWorkerApiCache } from "@/modules/core/services/serviceWorker";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

const navItems = [
  { label: "Inicio", icon: LayoutDashboard, path: paths.home },
  { label: "Tareas", icon: CheckSquare, path: paths.tasks },
  { label: "Calendario", icon: Calendar, path: paths.calendar },
  { label: "Horario", icon: Clock, path: paths.schedule },
  { label: "Exámenes", icon: FlaskConical, path: paths.exams },
  { label: "Recordatorios", icon: Bell, path: paths.reminders },
];

interface AppLayoutProps {
  children?: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <TooltipProvider>
      <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* Logo */}
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<Link to={paths.home} />}
                className="font-heading"
              >
                <div className="flex size-8 items-center justify-center rounded-none bg-primary text-primary-foreground shrink-0">
                  <GraduationCap className="size-4" />
                </div>
                <span className="font-heading text-sm font-semibold tracking-wider uppercase">
                  Dacate
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Nav */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menú</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      render={<Link to={item.path} />}
                      isActive={location.pathname === item.path}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to={paths.profile} />}
                isActive={location.pathname === paths.profile}
                tooltip="Perfil"
              >
                <User />
                <span>Perfil</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to={paths.settings} />}
                isActive={location.pathname === paths.settings}
                tooltip="Configuración"
              >
                <Settings />
                <span>Configuración</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link to={paths.login} />}
                onClick={() => {
                  logout();
                  clearServiceWorkerApiCache();
                }}
                tooltip="Cerrar sesión"
                className="text-destructive hover:text-destructive focus-visible:text-destructive"
              >
                <LogOut />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main content */}
      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          {/* Breadcrumb placeholder – each page can pass its own title */}
          <span className="text-sm text-muted-foreground">
            {location.pathname === paths.profile
              ? "Perfil de estudiante"
              : location.pathname === paths.settings
                ? "Configuración"
                : (navItems.find((n) => n.path === location.pathname)?.label ??
                  "Dacate")}
          </span>
        </header>

        <main className="flex-1 p-6">{children ?? <Outlet />}</main>
      </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export { AppLayout };
