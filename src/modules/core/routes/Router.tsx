import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { paths } from "@/modules/core/routes/paths/path";
import { PrivateGuard, PublicGuard } from "@/modules/core/routes/guards";
import { AppLayout } from "@/modules/core/components/AppLayout";

const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/modules/auth/pages/RegisterPage"));
const ChangePasswordPage = lazy(() => import("@/modules/auth/pages/ChangePasswordPage"));
const ResetPasswordPage = lazy(() => import("@/modules/auth/pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("@/modules/dashboard/pages/DashboardPage"));
const TasksPage = lazy(() => import("@/modules/tasks/pages/TasksPage"));
const SchedulePage = lazy(() => import("@/modules/schedule/pages/SchedulePage"));
const CalendarPage = lazy(() => import("@/modules/calendar/pages/CalendarPage"));
const ExamsPage = lazy(() => import("@/modules/exams/pages/ExamsPage"));
const RemindersPage = lazy(() => import("@/modules/reminders/pages/RemindersPage"));
const ProfilePage = lazy(() => import("@/modules/users/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/modules/settings/pages/SettingsPage"));

function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Rutas públicas: redirigen al home si ya hay sesión */}
        <Route element={<PublicGuard />}>
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.register} element={<RegisterPage />} />
        </Route>

        <Route path={paths.changePassword} element={<ChangePasswordPage />} />
        <Route path={paths.resetPassword} element={<ResetPasswordPage />} />

        {/* Rutas privadas: redirigen a login si no hay sesión */}
        <Route element={<PrivateGuard />}>
          <Route element={<AppLayout />}>
            <Route path={paths.home} element={<DashboardPage />} />
            <Route path={paths.tasks} element={<TasksPage />} />
            <Route path={paths.schedule} element={<SchedulePage />} />
            <Route path={paths.calendar} element={<CalendarPage />} />
            <Route path={paths.exams} element={<ExamsPage />} />
            <Route path={paths.reminders} element={<RemindersPage />} />
            <Route path={paths.profile} element={<ProfilePage />} />
            <Route path={paths.settings} element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={paths.home} replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
