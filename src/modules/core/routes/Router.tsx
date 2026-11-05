import { Routes, Route, Navigate } from "react-router";
import { paths } from "@/modules/core/routes/paths/path";
import LoginPage from "@/modules/auth/pages/LoginPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import ChangePasswordPage from "@/modules/auth/pages/ChangePasswordPage";
import DashboardPage from "@/modules/core/pages/DashboardPage";
import TasksPage from "@/modules/tasks/pages/TasksPage";
import SchedulePage from "@/modules/schedule/pages/SchedulePage";
import ProfilePage from "@/modules/users/pages/ProfilePage";
import SettingsPage from "@/modules/settings/pages/SettingsPage";
import CalendarPage from "@/modules/calendar/pages/CalendarPage";
import ExamsPage from "@/modules/exams/pages/ExamsPage";
import RemindersPage from "@/modules/reminders/pages/RemindersPage";

function AppRouter() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.register} element={<RegisterPage />} />
      <Route path={paths.forgotPassword} element={<ForgotPasswordPage />} />
      <Route path={paths.changePassword} element={<ChangePasswordPage />} />

      {/* App Routes */}
      <Route path={paths.home} element={<DashboardPage />} />
      <Route path={paths.tasks} element={<TasksPage />} />
      <Route path={paths.schedule} element={<SchedulePage />} />
      <Route path={paths.calendar} element={<CalendarPage />} />
      <Route path={paths.exams} element={<ExamsPage />} />
      <Route path={paths.reminders} element={<RemindersPage />} />
      <Route path={paths.profile} element={<ProfilePage />} />
      <Route path={paths.settings} element={<SettingsPage />} />

      <Route path="*" element={<Navigate to={paths.home} replace />} />
    </Routes>
  );
}

export default AppRouter;
