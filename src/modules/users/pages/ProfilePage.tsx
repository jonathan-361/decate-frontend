import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/modules/core/components/AppLayout";
import type { ProfileFormValues } from "@/modules/users/schemas";
import { MOCK_STUDENT_PROFILE } from "@/modules/users/data/mockProfile";
import { StudentIdentityCard } from "@/modules/users/components/profile/StudentIdentityCard";
import { AcademicStatsOverview } from "@/modules/users/components/profile/AcademicStatsOverview";
import { ProfileEditForm } from "@/modules/users/components/profile/ProfileEditForm";

export default function ProfilePage() {
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState<ProfileFormValues>(MOCK_STUDENT_PROFILE);

  const handleChange = (field: keyof ProfileFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setFormData(MOCK_STUDENT_PROFILE);
    setIsSaved(false);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Perfil del estudiante
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra tu información académica, datos de contacto y expediente estudiantil.
          </p>
        </div>

        {/* Success alert message when saved */}
        {isSaved && (
          <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-300 transition-all">
            <CheckCircle2 className="size-5 shrink-0" />
            <p className="font-medium">Los cambios en tu perfil se guardaron correctamente.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Student identity card & stats */}
          <aside className="lg:col-span-4 space-y-6">
            <StudentIdentityCard profile={formData} />
            <AcademicStatsOverview />
          </aside>

          {/* Right Column: Edit Profile Form */}
          <main className="lg:col-span-8">
            <ProfileEditForm
              formData={formData}
              onChange={handleChange}
              onSave={handleSave}
              onReset={handleReset}
            />
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
