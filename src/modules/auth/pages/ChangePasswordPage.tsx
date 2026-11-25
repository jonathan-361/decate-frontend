import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { authService } from "@/modules/auth/services/auth.service";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { getErrorMessage } from "@/modules/core/services/api-error";
import { paths } from "@/modules/core/routes/paths/path";
import {
  changePasswordEmailSchema,
  type ChangePasswordEmailFormValues,
} from "@/modules/auth/schemas/change-password.schema";

function StepIndicator() {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-none bg-primary text-primary-foreground text-xs font-semibold">
          1
        </span>
        <span className="text-xs font-medium text-foreground">Verificar correo</span>
      </div>
      <div className="flex-1 h-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-none bg-muted text-muted-foreground text-xs font-semibold">
          2
        </span>
        <span className="text-xs text-muted-foreground">Nueva contraseña</span>
      </div>
    </div>
  );
}

function ChangePasswordPage() {
  const usuario = useAuthStore((s) => s.usuario);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const backTo = isAuthenticated ? paths.settings : paths.login;
  const backLabel = isAuthenticated ? "Volver a ajustes" : "Volver al inicio de sesión";

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordEmailFormValues>({
    resolver: zodResolver(changePasswordEmailSchema),
    defaultValues: { email: usuario?.correo ?? "" },
  });

  // La sesión se hidrata en segundo plano: si llega después, rellena el correo.
  useEffect(() => {
    if (usuario?.correo && !getValues("email")) {
      setValue("email", usuario.correo);
    }
  }, [usuario?.correo, getValues, setValue]);

  const onSubmit = async (data: ChangePasswordEmailFormValues) => {
    try {
      const res = await authService.solicitarRecuperacion(data.email);
      if (!res.success) {
        throw new Error(res.message || "No se pudo enviar el correo");
      }
      setSentTo(data.email);
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo enviar el correo"));
    }
  };

  const handleResend = async () => {
    if (!sentTo) return;
    setResending(true);
    try {
      const res = await authService.solicitarRecuperacion(sentTo);
      if (!res.success) {
        throw new Error(res.message || "No se pudo reenviar el correo");
      }
      toast.success("Te enviamos un nuevo enlace");
    } catch (err) {
      toast.error(getErrorMessage(err, "No se pudo reenviar el correo"));
    } finally {
      setResending(false);
    }
  };

  if (sentTo) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        description="Te enviamos un enlace para cambiar tu contraseña."
      >
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex size-16 items-center justify-center rounded-none bg-primary/10 border border-primary/20">
            <CheckCircle2 className="size-8 text-primary" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si existe una cuenta asociada a{" "}
              <span className="font-semibold text-foreground">{sentTo}</span>,
              recibirás un correo con el enlace para cambiar tu contraseña.
            </p>
            <p className="text-xs text-muted-foreground">
              El enlace expira en 15 minutos. Revisa también tu carpeta de spam.
            </p>
          </div>

          <div className="w-full space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              disabled={resending}
              onClick={handleResend}
            >
              {resending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mail className="size-4" />
              )}
              {resending ? "Reenviando..." : "Reenviar correo"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              size="lg"
              onClick={() => setSentTo(null)}
            >
              Usar otro correo
            </Button>

            <Link to={backTo} className="block">
              <Button variant="ghost" className="w-full" size="lg">
                <ArrowLeft className="size-4" />
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Cambiar contraseña"
      description="Ingresa tu correo y te enviaremos un enlace para cambiar tu contraseña."
    >
      <StepIndicator />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-6">
          <Field data-invalid={!!errors.email}>
            <FieldLabel>
              <Label htmlFor="email">Correo electrónico</Label>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
              {...register("email")}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
            <p className="text-xs text-muted-foreground">
              Te enviaremos un enlace a este correo. Expira en 15 minutos.
            </p>
          </Field>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            {isSubmitting ? "Enviando..." : "Enviar enlace"}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-6 text-center">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          {backLabel}
        </Link>
      </div>
    </AuthLayout>
  );
}

export default ChangePasswordPage;