import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  linkTo,
  linkLabel = "Ver todo",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
        {title}
      </h2>
      {linkTo && (
        <Link
          to={linkTo}
          aria-label={`${linkLabel}: ${title}`}
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          {linkLabel}
          <ArrowRight className="size-3" />
        </Link>
      )}
    </div>
  );
}

