import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { paths } from "@/modules/core/routes/paths/path";
import {
  changePasswordEmailSchema,
  changePasswordResetSchema,
  type ChangePasswordEmailFormValues,
  type ChangePasswordResetFormValues,
} from "@/modules/auth/schemas/change-password.schema";

// ── Step 1 view ────────────────────────────────────────────────────────────────
function StepEmail({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordEmailFormValues>({
    resolver: zodResolver(changePasswordEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ChangePasswordEmailFormValues) => {
    // UI-only: no API call
    console.log("Change password email:", data);
    onSuccess(data.email);
  };

  return (
    <AuthLayout
      title="Cambiar contraseña"
      description="Ingresa tu correo y te enviaremos un código de verificación."
    >
      {/* Step indicator */}
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
              {...register("email")}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
            <p className="text-xs text-muted-foreground">
              Te enviaremos un código de 6 dígitos a este correo.
            </p>
          </Field>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            <Mail className="size-4" />
            {isSubmitting ? "Enviando..." : "Enviar código"}
          </Button>
        </FieldGroup>
      </form>

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

// ── Step 2 view ────────────────────────────────────────────────────────────────
function StepReset({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordResetFormValues>({
    resolver: zodResolver(changePasswordResetSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setValue("code", value, { shouldValidate: true });
  };

  const onSubmit = (data: ChangePasswordResetFormValues) => {
    // UI-only: no API call
    console.log("Reset password data:", data);
    onSuccess();
  };

  return (
    <AuthLayout
      title="Verificar y cambiar"
      description={`Ingresa el código enviado a ${email} y tu nueva contraseña.`}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-none bg-muted text-muted-foreground text-xs font-semibold">
            <CheckCircle2 className="size-3.5" />
          </span>
          <span className="text-xs text-muted-foreground">Verificar correo</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-none bg-primary text-primary-foreground text-xs font-semibold">
            2
          </span>
          <span className="text-xs font-medium text-foreground">Nueva contraseña</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-6">
          {/* OTP code */}
          <Field data-invalid={!!errors.code}>
            <FieldLabel>
              <Label>Código de verificación</Label>
            </FieldLabel>
            <div className="flex justify-center py-2">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={handleOtpChange}
                aria-invalid={!!errors.code}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="size-12 text-base" />
                  <InputOTPSlot index={1} className="size-12 text-base" />
                  <InputOTPSlot index={2} className="size-12 text-base" />
                  <InputOTPSlot index={3} className="size-12 text-base" />
                  <InputOTPSlot index={4} className="size-12 text-base" />
                  <InputOTPSlot index={5} className="size-12 text-base" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {errors.code && <FieldError errors={[errors.code]} />}
            <p className="text-xs text-muted-foreground text-center">
              ¿No recibiste el código?{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                onClick={onBack}
              >
                Reenviar
              </button>
            </p>
          </Field>

          {/* New password */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel>
              <Label htmlFor="password">Nueva contraseña</Label>
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className="pr-10"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:text-foreground"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && <FieldError errors={[errors.password]} />}
          </Field>

          {/* Confirm password */}
          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            </FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                className="pr-10"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:text-foreground"
                aria-label={
                  showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <FieldError errors={[errors.confirmPassword]} />
            )}
          </Field>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            <KeyRound className="size-4" />
            {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Cambiar correo
        </button>
      </div>
    </AuthLayout>
  );
}

// ── Success view ───────────────────────────────────────────────────────────────
function StepSuccess() {
  return (
    <AuthLayout
      title="Contraseña actualizada"
      description="Tu contraseña ha sido cambiada exitosamente."
    >
      <div className="flex flex-col items-center text-center gap-6">
        <div className="flex size-16 items-center justify-center rounded-none bg-primary/10 border border-primary/20">
          <ShieldCheck className="size-8 text-primary" />
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>

        <Link to={paths.login} className="block w-full">
          <Button className="w-full" size="lg">
            Ir al inicio de sesión
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────
type Step = "email" | "reset" | "success";

function ChangePasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  if (step === "email") {
    return (
      <StepEmail
        onSuccess={(submittedEmail) => {
          setEmail(submittedEmail);
          setStep("reset");
        }}
      />
    );
  }

  if (step === "reset") {
    return (
      <StepReset
        email={email}
        onSuccess={() => setStep("success")}
        onBack={() => setStep("email")}
      />
    );
  }

  return <StepSuccess />;
}

export default ChangePasswordPage;

