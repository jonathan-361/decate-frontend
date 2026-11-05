import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { paths } from "@/modules/core/routes/paths/path";
import { registerSchema, type RegisterFormValues } from "@/modules/auth/schemas";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    // UI-only: no API call
    console.log("Register data:", data);
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Regístrate para comenzar a organizar tu vida académica."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-6">
          {/* Full name */}
          <Field data-invalid={!!errors.fullName}>
            <FieldLabel>
              <Label htmlFor="fullName">Nombre completo</Label>
            </FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="Juan García"
              autoComplete="name"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName && (
              <FieldError errors={[errors.fullName]} />
            )}
          </Field>

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
            {errors.email && (
              <FieldError errors={[errors.email]} />
            )}
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel>
              <Label htmlFor="password">Contraseña</Label>
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
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <FieldError errors={[errors.password]} />
            )}
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
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
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

          {/* Terms note */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            Al registrarte, aceptas nuestros{" "}
            <span className="text-primary underline underline-offset-4 cursor-pointer hover:text-primary/80">
              Términos de servicio
            </span>{" "}
            y{" "}
            <span className="text-primary underline underline-offset-4 cursor-pointer hover:text-primary/80">
              Política de privacidad
            </span>
            .
          </p>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            <UserPlus className="size-4" />
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </FieldGroup>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          o
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to={paths.login}
          className="text-primary font-semibold underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
