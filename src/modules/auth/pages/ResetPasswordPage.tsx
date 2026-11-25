import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertTriangle,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    ShieldCheck,
} from "lucide-react";
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
    changePasswordResetSchema,
    type ChangePasswordResetFormValues,
} from "@/modules/auth/schemas/change-password.schema";

function InvalidLink() {
    return (
        <AuthLayout
            title="Enlace no válido"
            description="El enlace es incorrecto, ya fue usado o expiró."
        >
            <div className="flex flex-col items-center text-center gap-6">
                <div className="flex size-16 items-center justify-center rounded-none bg-destructive/10 border border-destructive/20">
                    <AlertTriangle className="size-8 text-destructive" />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    Los enlaces para cambiar la contraseña expiran a los 15 minutos y
                    solo se pueden usar una vez. Solicita uno nuevo para continuar.
                </p>

                <Link to={paths.changePassword} className="block w-full">
                    <Button className="w-full" size="lg">
                        Solicitar nuevo enlace
                    </Button>
                </Link>
            </div>
        </AuthLayout>
    );
}

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")?.trim() ?? "";
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [done, setDone] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordResetFormValues>({
        resolver: zodResolver(changePasswordResetSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ChangePasswordResetFormValues) => {
        try {
            const res = await authService.restablecerPassword(token, data.password);
            if (!res.success) {
                throw new Error(res.message || "No se pudo cambiar la contraseña");
            }
            setDone(true);
        } catch (err) {
            const message = getErrorMessage(err, "No se pudo cambiar la contraseña");
            if (
                axios.isAxiosError(err) &&
                err.response?.status === 400 &&
                /token/i.test(message)
            ) {
                setInvalidToken(true);
                return;
            }
            toast.error(message);
        }
    };

    if (!token || invalidToken) return <InvalidLink />;

    if (done) {
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
                        {isAuthenticated
                            ? "Ya puedes seguir usando Dacate con tu nueva contraseña."
                            : "Ya puedes iniciar sesión con tu nueva contraseña."}
                    </p>

                    <Link
                        to={isAuthenticated ? paths.home : paths.login}
                        className="block w-full"
                    >
                        <Button className="w-full" size="lg">
                            {isAuthenticated ? "Ir al inicio" : "Ir al inicio de sesión"}
                        </Button>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Nueva contraseña"
            description="Elige una contraseña nueva para tu cuenta."
        >
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                        {isSubmitting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <KeyRound className="size-4" />
                        )}
                        {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
                    </Button>
                </FieldGroup>
            </form>
        </AuthLayout>
    );
}

export default ResetPasswordPage;