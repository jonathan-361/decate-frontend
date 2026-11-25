import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { paths } from "@/modules/core/routes/paths/path";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/modules/auth/schemas/register.schema";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const registro = useAuthStore((s) => s.registro);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      matricula: "",
      telefono: "",
      universidad: "",
      carrera: "",
      semestre: "1",
      turno: "MATUTINO",
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
        telefono: data.telefono,
        universidad: data.universidad,
        carrera: data.carrera,
        semestre: Number(data.semestre),
        turno: data.turno,
        correo: data.email,
        password: data.password,
      });
      toast.success("Cuenta creada exitosamente. Inicia sesión para continuar.");
      navigate(paths.login, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al registrarse");
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Regístrate para comenzar a organizar tu vida académica."
      contentMaxWidth="max-w-xl lg:max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldSet disabled={isSubmitting} className="border-0 p-0 m-0 min-w-0">
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {/* Nombre */}
            <Field className="sm:col-span-2" data-invalid={!!errors.nombre}>
              <FieldLabel>
                <Label htmlFor="nombre">Nombre(s)</Label>
              </FieldLabel>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan"
                autoComplete="given-name"
                aria-invalid={!!errors.nombre}
                disabled={isSubmitting}
                {...register("nombre", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
                  },
                })}
              />
              {errors.nombre && <FieldError errors={[errors.nombre]} />}
            </Field>

            {/* Apellido paterno */}
            <Field className="sm:col-span-1" data-invalid={!!errors.apellidoPaterno}>
              <FieldLabel>
                <Label htmlFor="apellidoPaterno">Apellido paterno</Label>
              </FieldLabel>
              <Input
                id="apellidoPaterno"
                type="text"
                placeholder="García"
                autoComplete="family-name"
                aria-invalid={!!errors.apellidoPaterno}
                disabled={isSubmitting}
                {...register("apellidoPaterno", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
                  },
                })}
              />
              {errors.apellidoPaterno && (
                <FieldError errors={[errors.apellidoPaterno]} />
              )}
            </Field>

            {/* Apellido materno */}
            <Field className="sm:col-span-1" data-invalid={!!errors.apellidoMaterno}>
              <FieldLabel>
                <Label htmlFor="apellidoMaterno">Apellido materno</Label>
              </FieldLabel>
              <Input
                id="apellidoMaterno"
                type="text"
                placeholder="López"
                autoComplete="additional-name"
                aria-invalid={!!errors.apellidoMaterno}
                disabled={isSubmitting}
                {...register("apellidoMaterno", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "");
                  },
                })}
              />
              {errors.apellidoMaterno && (
                <FieldError errors={[errors.apellidoMaterno]} />
              )}
            </Field>

            {/* Matrícula */}
            <Field className="sm:col-span-1" data-invalid={!!errors.matricula}>
              <FieldLabel>
                <Label htmlFor="matricula">Matrícula</Label>
              </FieldLabel>
              <Input
                id="matricula"
                type="text"
                inputMode="numeric"
                placeholder="12345678"
                aria-invalid={!!errors.matricula}
                disabled={isSubmitting}
                {...register("matricula", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
              />
              {errors.matricula && <FieldError errors={[errors.matricula]} />}
            </Field>

            {/* Teléfono */}
            <Field className="sm:col-span-1" data-invalid={!!errors.telefono}>
              <FieldLabel>
                <Label htmlFor="telefono">Teléfono (10 dígitos)</Label>
              </FieldLabel>
              <Input
                id="telefono"
                type="tel"
                inputMode="numeric"
                placeholder="5512345678"
                aria-invalid={!!errors.telefono}
                disabled={isSubmitting}
                {...register("telefono", {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  },
                })}
              />
              {errors.telefono && <FieldError errors={[errors.telefono]} />}
            </Field>

            {/* Universidad */}
            <Field className="sm:col-span-1" data-invalid={!!errors.universidad}>
              <FieldLabel>
                <Label htmlFor="universidad">Universidad / Institución</Label>
              </FieldLabel>
              <Input
                id="universidad"
                type="text"
                placeholder="Ej. Universidad Autónoma"
                aria-invalid={!!errors.universidad}
                disabled={isSubmitting}
                {...register("universidad")}
              />
              {errors.universidad && <FieldError errors={[errors.universidad]} />}
            </Field>

            {/* Carrera */}
            <Field className="sm:col-span-1" data-invalid={!!errors.carrera}>
              <FieldLabel>
                <Label htmlFor="carrera">Carrera</Label>
              </FieldLabel>
              <Input
                id="carrera"
                type="text"
                placeholder="Ej. Ingeniería en Sistemas"
                aria-invalid={!!errors.carrera}
                disabled={isSubmitting}
                {...register("carrera")}
              />
              {errors.carrera && <FieldError errors={[errors.carrera]} />}
            </Field>

            {/* Semestre */}
            <Field className="sm:col-span-1" data-invalid={!!errors.semestre}>
              <FieldLabel>
                <Label htmlFor="semestre">Semestre</Label>
              </FieldLabel>
              <Controller
                name="semestre"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val ?? "1")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="semestre" className="w-full">
                      <SelectValue placeholder="Semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          {s}° Semestre
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.semestre && <FieldError errors={[errors.semestre]} />}
            </Field>

            {/* Turno */}
            <Field className="sm:col-span-1" data-invalid={!!errors.turno}>
              <FieldLabel>
                <Label htmlFor="turno">Turno escolar</Label>
              </FieldLabel>
              <Controller
                name="turno"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val ?? "MATUTINO")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="turno" className="w-full">
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MATUTINO">Matutino</SelectItem>
                      <SelectItem value="VESPERTINO">Vespertino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.turno && <FieldError errors={[errors.turno]} />}
            </Field>

            {/* Email */}
            <Field className="sm:col-span-2" data-invalid={!!errors.email}>
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
            </Field>

            {/* Password */}
            <Field className="sm:col-span-1" data-invalid={!!errors.password}>
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
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-50"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <FieldError errors={[errors.password]} />}
            </Field>

            {/* Confirm password */}
            <Field className="sm:col-span-1" data-invalid={!!errors.confirmPassword}>
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
                  disabled={isSubmitting}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-50"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <FieldError errors={[errors.confirmPassword]} />
              )}
            </Field>

            {/* Password hint */}
            <p className="sm:col-span-2 text-[0.75rem] text-muted-foreground">
              Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo especial.
            </p>

            {/* Terms note */}
            <p className="sm:col-span-2 text-xs text-muted-foreground leading-relaxed pt-1">
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
              className="sm:col-span-2 w-full mt-1"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center gap-3">
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
          className={cn(
            "text-primary font-semibold underline underline-offset-4 hover:text-primary/80 transition-colors",
            isSubmitting && "pointer-events-none opacity-50"
          )}
        >
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
