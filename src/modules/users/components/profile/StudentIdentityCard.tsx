import { Camera, Mail, Building2, GraduationCap, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ProfileFormValues } from "@/modules/users/schemas";

interface StudentIdentityCardProps {
  profile: ProfileFormValues;
}

export function StudentIdentityCard({ profile }: StudentIdentityCardProps) {
  return (
    <div className="border border-border bg-card p-6 flex flex-col items-center text-center">
      <div className="relative group mb-4">
        <Avatar className="size-24 border border-border shadow-sm">
          <AvatarImage
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
            alt={profile.fullName}
          />
          <AvatarFallback className="font-heading text-xl">
            {profile.fullName
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground border border-background shadow hover:opacity-90 transition-opacity"
          title="Cambiar fotografía"
        >
          <Camera className="size-3.5" />
        </button>
      </div>

      <h2 className="font-heading text-lg font-semibold text-foreground">
        {profile.fullName}
      </h2>
      <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1.5">
        <Mail className="size-3 text-muted-foreground" />
        {profile.email}
      </p>

      <div className="mt-3">
        <Badge variant="secondary" className="text-[11px] font-normal">
          {profile.studentId}
        </Badge>
      </div>

      <Separator className="my-5 w-full" />

      <div className="w-full space-y-2.5 text-left text-xs">
        <div className="flex items-start gap-2 text-muted-foreground">
          <Building2 className="size-3.5 shrink-0 mt-0.5 text-foreground/70" />
          <span className="leading-snug">{profile.university}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <GraduationCap className="size-3.5 shrink-0 mt-0.5 text-foreground/70" />
          <span className="leading-snug">{profile.career}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0 text-foreground/70" />
          <span>
            {profile.semester}° Semestre · {profile.shift}
          </span>
        </div>
      </div>
    </div>
  );
}

