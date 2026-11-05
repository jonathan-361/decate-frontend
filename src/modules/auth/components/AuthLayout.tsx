import { GraduationCap } from "lucide-react";
import { Link } from "react-router";
import { paths } from "@/modules/core/routes/paths/path";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary flex-col justify-between p-12 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-foreground" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary-foreground" />
          <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full bg-primary-foreground" />
        </div>

        {/* Logo */}
        <Link
          to={paths.login}
          className="relative z-10 flex items-center gap-3 w-fit"
        >
          <div className="flex size-10 items-center justify-center rounded-none bg-primary-foreground/10 border border-primary-foreground/20">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-semibold tracking-wider uppercase text-primary-foreground">
            Dacate
          </span>
        </Link>

        {/* Quote / tagline */}
        <div className="relative z-10 space-y-4">
          <blockquote className="text-primary-foreground/90 text-2xl font-heading font-medium leading-relaxed">
            "Organiza tu vida académica, alcanza tus metas."
          </blockquote>
          <p className="text-primary-foreground/60 text-sm">
            Tu asistente académico personal para tareas, exámenes y horarios.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["Tareas", "Exámenes", "Calendario", "Recordatorios"].map(
              (feat) => (
                <span
                  key={feat}
                  className="px-3 py-1 rounded-none border border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground/70 text-xs font-semibold tracking-wider uppercase"
                >
                  {feat}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <Link
          to={paths.login}
          className="lg:hidden flex items-center gap-2 mb-10"
        >
          <div className="flex size-9 items-center justify-center rounded-none bg-primary border border-primary/20">
            <GraduationCap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-semibold tracking-wider uppercase text-foreground">
            Dacate
          </span>
        </Link>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 text-left">
            <h1 className="text-2xl font-heading font-semibold tracking-tight text-foreground mb-1">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export { AuthLayout };

