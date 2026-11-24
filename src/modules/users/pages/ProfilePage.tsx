import { useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/custom";
import { StudentIdentityCard } from "@/modules/users/components/profile/StudentIdentityCard";
import { ProfileEditForm } from "@/modules/users/components/profile/ProfileEditForm";
import { useProfileStore } from "@/modules/users/stores/profile.store";
import type { UpdatePerfilPayload } from "@/modules/users/services/profile.service";

export default function ProfilePage() {
  const { perfil, isLoading, error, fetchPerfil, updatePerfil } =
    useProfileStore();

  useEffect(() => {
    void fetchPerfil();
  }, [fetchPerfil]);

  const handleSave = async (payload: UpdatePerfilPayload) => {
    try {
      await updatePerfil(payload);
      toast.success("Perfil actualizado correctamente.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al actualizar el perfil",
      );
    }
  };

  if (isLoading && !perfil) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Cargando perfil...</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !perfil) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3 border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <p>{error || "No se pudo cargar la información del perfil."}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Perfil del estudiante"
        description="Consulta tu expediente académico y actualiza tus datos de contacto y ciclo escolar."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4">
          <StudentIdentityCard perfil={perfil} />
        </aside>

        <div className="lg:col-span-8">
          <ProfileEditForm perfil={perfil} onSave={handleSave} />
        </div>
      </div>
    </PageContainer>
  );
}