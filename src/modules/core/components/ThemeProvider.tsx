import { useEffect, type ReactNode } from "react";
import {
  applyTheme,
  DARK_QUERY,
  resolveTheme,
  useThemeStore,
} from "@/modules/core/stores/theme.store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const apply = (resolved: "light" | "dark") => applyTheme(resolved);

    if (theme !== "system") {
      apply(theme);
      return;
    }

    const media = window.matchMedia(DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      apply(event.matches ? "dark" : "light");
    };

    apply(resolveTheme("system"));
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  return children;
}
