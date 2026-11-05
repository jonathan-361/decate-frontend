import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

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
import { paths } from "@/modules/core/routes/paths/path";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/modules/auth/schemas";

function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    // UI-only: no API call
    console.log("Forgot password data:", data);
    setSubmittedEmail(data.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Revisa tu correo"
        description="Te hemos enviado las instrucciones para recuperar tu cuenta."
      >
        {/* Success state */}
        <div className="flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className="flex size-16 items-center justify-center rounded-none bg-primary/10 border border-primary/20">
            <CheckCircle2 className="size-8 text-primary" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si existe una cuenta asociada a{" "}
              <span className="font-semibold text-foreground">
                {submittedEmail}
              </span>
              , recibirás un correo con las instrucciones para restablecer tu
              contraseña.
            </p>
            <p className="text-xs text-muted-foreground">
              Revisa también tu carpeta de spam.
            </p>
          </div>

          {/* Resend */}
          <div className="w-full space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => setSubmitted(false)}
            >
              <Mail className="size-4" />
              Reenviar correo
            </Button>

            <Link to={paths.login} className="block">
              <Button variant="ghost" className="w-full" size="lg">
                <ArrowLeft className="size-4" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="¿Olvidaste tu contraseña?"
      description="Ingresa tu correo y te enviaremos un enlace para restablecerla."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-6">
          {/* Email */}
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
              {...register("email")}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
            <p className="text-xs text-muted-foreground">
              Te enviaremos un enlace de recuperación a este correo.
            </p>
          </Field>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            <Mail className="size-4" />
            {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
          </Button>
        </FieldGroup>
      </form>

      {/* Back to login */}
      <div className="mt-6 text-center">
        <Link
          to={paths.login}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;

