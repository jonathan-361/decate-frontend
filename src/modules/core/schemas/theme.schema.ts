export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function isThemeMode(val: unknown): val is ThemeMode {
  return val === "light" || val === "dark" || val === "system";
}
