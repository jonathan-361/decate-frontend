import { z } from "zod";

export const themeModeSchema = z.enum(["light", "dark", "system"]);
export type ThemeMode = z.infer<typeof themeModeSchema>;

export const settingsSchema = z.object({
  theme: themeModeSchema.default("light"),
  weekStart: z.enum(["lunes", "domingo"]).default("lunes"),
  timeFormat: z.enum(["12h", "24h"]).default("24h"),
  defaultCalendarView: z.enum(["mes", "semana", "dia"]).default("mes"),

  notifyTasks: z.boolean().default(true),
  notifyExams: z.boolean().default(true),
  notifyClasses: z.boolean().default(true),
  notifyEmail: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),

  taskLeadTime: z.enum(["6h", "12h", "24h", "48h"]).default("24h"),
  examLeadTime: z.enum(["1d", "3d", "5d", "1w"]).default("3d"),
  classLeadTime: z.enum(["5m", "10m", "15m", "30m"]).default("15m"),

  autoSync: z.boolean().default(true),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

