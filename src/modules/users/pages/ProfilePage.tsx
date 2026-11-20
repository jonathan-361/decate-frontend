import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/custom";
import type { ProfileFormValues } from "@/modules/users/schemas";
import { StudentIdentityCard } from "@/modules/users/components/profile/StudentIdentityCard";
import { AcademicStatsOverview } from "@/modules/users/components/profile/AcademicStatsOverview";
import { ProfileEditForm } from "@/modules/users/components/profile/ProfileEditForm";
import { useProfileStore } from "@/modules/users/stores/profile.store";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

const EMPTY_FORM: ProfileFormValues = {
  fullName: "",
  email: "",
  phone: "",
  university: "",
  faculty: "",
  career: "",
  studentId: "",
  semester: "1",
  shift: "Matutino",
  bio: "",
};

export default function ProfilePage() {
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState<ProfileFormValues>(EMPTY_FORM);

  const usuario = useAuthStore((s) => s.usuario);
  const { perfil, isLoading, error, fetchPerfil } = useProfileStore();

  useEffect(() => {
    if (usuario?.id) {
      fetchPerfil(usuario.id);
    }
  }, [usuario?.id]);

  // Cuando llegan los datos de la API, poblar los campos que el backend conoce
  useEffect(() => {
    if (!perfil) return;
    const fullName = [perfil.nombre, perfil.apellidoPaterno, perfil.apellidoMaterno]
      .filter(Boolean)
      .join(" ");
    setFormData((prev) => ({
      ...prev,
      fullName,
      email: perfil.correo,
      studentId: String(perfil.matricula),
    }));
  }, [perfil]);

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
    if (!perfil) return;
    const fullName = [perfil.nombre, perfil.apellidoPaterno, perfil.apellidoMaterno]
      .filter(Boolean)
      .join(" ");
    setFormData((prev) => ({
      ...prev,
      fullName,
      email: perfil.correo,
      studentId: String(perfil.matricula),
    }));
    setIsSaved(false);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Cargando perfil...</span>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3 border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <p>{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Perfil del estudiante"
        description="Administra tu información académica, datos de contacto y expediente estudiantil."
      />

      {isSaved && (
        <div className="flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-300 transition-all">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="font-medium">Los cambios en tu perfil se guardaron correctamente.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <StudentIdentityCard profile={formData} />
          <AcademicStatsOverview />
        </aside>

        <div className="lg:col-span-8">
          <ProfileEditForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            onReset={handleReset}
          />
        </div>
      </div>
    </PageContainer>
  );
}
