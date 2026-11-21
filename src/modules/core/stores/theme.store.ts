import { create } from "zustand";
import {
  themeModeSchema,
  type ResolvedTheme,
  type ThemeMode,
} from "@/modules/core/schemas/theme.schema";
import { idbGet, idbSet } from "@/modules/core/services/indexeddb";

export const THEME_STORAGE_KEY = "dacate-theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

const DEFAULT_THEME: ThemeMode = "light";

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode !== "system") return mode;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
}

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: DEFAULT_THEME,
  setTheme: (theme) => {
    void idbSet(THEME_STORAGE_KEY, theme);
    set({ theme });
  },
}));

/** Lee el tema de IndexedDB y lo aplica antes de que React pinte. */
export async function hydrateTheme() {
  // Usar setTimeout para no bloquear el render
  setTimeout(async () => {
    const stored = await idbGet<string>(THEME_STORAGE_KEY);
    const parsed = themeModeSchema.safeParse(stored);
    const theme = parsed.success ? parsed.data : DEFAULT_THEME;
    applyTheme(resolveTheme(theme));
    useThemeStore.setState({ theme });
  }, 0);
}
