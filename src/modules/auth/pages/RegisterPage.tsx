import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { paths } from "@/modules/core/routes/paths/path";
import { registerSchema, type RegisterFormValues } from "@/modules/auth/schemas";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const registro = useAuthStore((s) => s.registro);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      matricula: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registro({
        nombre: data.nombre,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        matricula: Number(data.matricula),
        correo: data.email,
        password: data.password,
      });
      toast.success("Cuenta creada. Ahora inicia sesión.");
      navigate(paths.login);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al registrarse");
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Regístrate para comenzar a organizar tu vida académica."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-6">
          {/* Nombre */}
          <Field data-invalid={!!errors.nombre}>
            <FieldLabel>
              <Label htmlFor="nombre">Nombre(s)</Label>
            </FieldLabel>
            <Input
              id="nombre"
              type="text"
              placeholder="Juan"
              autoComplete="given-name"
              aria-invalid={!!errors.nombre}
              {...register("nombre")}
            />
            {errors.nombre && <FieldError errors={[errors.nombre]} />}
          </Field>

          {/* Apellido paterno */}
          <Field data-invalid={!!errors.apellidoPaterno}>
            <FieldLabel>
              <Label htmlFor="apellidoPaterno">Apellido paterno</Label>
            </FieldLabel>
            <Input
              id="apellidoPaterno"
              type="text"
              placeholder="García"
              autoComplete="family-name"
              aria-invalid={!!errors.apellidoPaterno}
              {...register("apellidoPaterno")}
            />
            {errors.apellidoPaterno && (
              <FieldError errors={[errors.apellidoPaterno]} />
            )}
          </Field>

          {/* Apellido materno */}
          <Field data-invalid={!!errors.apellidoMaterno}>
            <FieldLabel>
              <Label htmlFor="apellidoMaterno">Apellido materno</Label>
            </FieldLabel>
            <Input
              id="apellidoMaterno"
              type="text"
              placeholder="López"
              autoComplete="additional-name"
              aria-invalid={!!errors.apellidoMaterno}
              {...register("apellidoMaterno")}
            />
            {errors.apellidoMaterno && (
              <FieldError errors={[errors.apellidoMaterno]} />
            )}
          </Field>

          {/* Matrícula */}
          <Field data-invalid={!!errors.matricula}>
            <FieldLabel>
              <Label htmlFor="matricula">Matrícula</Label>
            </FieldLabel>
            <Input
              id="matricula"
              type="text"
              inputMode="numeric"
              placeholder="12345678"
              aria-invalid={!!errors.matricula}
              {...register("matricula")}
            />
            {errors.matricula && <FieldError errors={[errors.matricula]} />}
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
            {errors.email && <FieldError errors={[errors.email]} />}
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
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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
