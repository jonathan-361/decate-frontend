import { create } from "zustand";
import { themeModeSchema, type ThemeMode } from "@/modules/core/schemas/theme.schema";

export const THEME_STORAGE_KEY = "dacate-theme";

const DEFAULT_THEME: ThemeMode = "light";

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    const parsed = themeModeSchema.safeParse(raw);
    return parsed.success ? parsed.data : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function persistTheme(theme: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable: the theme still applies for the current session */
  }
}

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    persistTheme(theme);
    set({ theme });
  },
}));