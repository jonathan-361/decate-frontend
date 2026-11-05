import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "@/modules/core/stores/theme.store";
import type { ResolvedTheme } from "@/modules/core/schemas/theme.schema";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (resolved: ResolvedTheme) => {
      root.classList.toggle("dark", resolved === "dark");
      root.dataset.theme = resolved;
    };

    if (theme !== "system") {
      apply(theme);
      return;
    }

    const media = window.matchMedia(DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      apply(event.matches ? "dark" : "light");
    };

    apply(media.matches ? "dark" : "light");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  return children;
}