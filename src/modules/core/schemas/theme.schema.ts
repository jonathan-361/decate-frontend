import { z } from "zod";

export const themeModeSchema = z.enum(["light", "dark", "system"]);
export type ThemeMode = z.infer<typeof themeModeSchema>;

export const resolvedThemeSchema = z.enum(["light", "dark"]);
export type ResolvedTheme = z.infer<typeof resolvedThemeSchema>;