import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { paths } from "@/modules/core/routes/paths/path";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { loginSchema, type LoginFormValues } from "@/modules/auth/schemas";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login({ correo: data.email, password: data.password });
      navigate(paths.home);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al iniciar sesión");
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      description="Ingresa tus credenciales para acceder a tu cuenta."
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
                placeholder="••••••••"
                autoComplete="current-password"
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

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox id="rememberMe" {...register("rememberMe")} />
              <span className="text-sm text-muted-foreground">
                Recordarme
              </span>
            </label>
            <Link
              to={paths.forgotPassword}
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isSubmitting}
          >
            <LogIn className="size-4" />
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
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

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          to={paths.register}
          className="text-primary font-semibold underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
