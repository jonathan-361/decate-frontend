import { create } from "zustand";
import { idbGet, idbSet } from "@/modules/core/services/indexeddb";

export const SETTINGS_KEY = "dacate-settings";

export interface SettingsState {
  weekStart: string;
  timeFormat: string;
  defaultCalendarView: string;
  notifyEmail: boolean;
  soundEnabled: boolean;
  autoSync: boolean;
  lastSyncTime: string;
  setWeekStart: (value: string) => void;
  setTimeFormat: (value: string) => void;
  setDefaultCalendarView: (value: string) => void;
  setNotifyEmail: (value: boolean) => void;
  setSoundEnabled: (value: boolean) => void;
  setAutoSync: (value: boolean) => void;
  setLastSyncTime: (value: string) => void;
  hydrateSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  weekStart: "lunes",
  timeFormat: "24h",
  defaultCalendarView: "mes",
  notifyEmail: false,
  soundEnabled: true,
  autoSync: true,
  lastSyncTime: "Hoy a las 10:04 AM",

  setWeekStart: (weekStart) => {
    set({ weekStart });
    void idbSet(SETTINGS_KEY, { ...get(), weekStart });
  },
  setTimeFormat: (timeFormat) => {
    set({ timeFormat });
    void idbSet(SETTINGS_KEY, { ...get(), timeFormat });
  },
  setDefaultCalendarView: (defaultCalendarView) => {
    set({ defaultCalendarView });
    void idbSet(SETTINGS_KEY, { ...get(), defaultCalendarView });
  },
  setNotifyEmail: (notifyEmail) => {
    set({ notifyEmail });
    void idbSet(SETTINGS_KEY, { ...get(), notifyEmail });
  },
  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    void idbSet(SETTINGS_KEY, { ...get(), soundEnabled });
  },
  setAutoSync: (autoSync) => {
    set({ autoSync });
    void idbSet(SETTINGS_KEY, { ...get(), autoSync });
  },
  setLastSyncTime: (lastSyncTime) => {
    set({ lastSyncTime });
    void idbSet(SETTINGS_KEY, { ...get(), lastSyncTime });
  },
  hydrateSettings: async () => {
    const saved = await idbGet<Partial<SettingsState>>(SETTINGS_KEY);
    if (saved) {
      set({
        weekStart: saved.weekStart ?? "lunes",
        timeFormat: saved.timeFormat ?? "24h",
        defaultCalendarView: saved.defaultCalendarView ?? "mes",
        notifyEmail: saved.notifyEmail ?? false,
        soundEnabled: saved.soundEnabled ?? true,
        autoSync: saved.autoSync ?? true,
        lastSyncTime: saved.lastSyncTime ?? "Hoy a las 10:04 AM",
      });
    }
  },
}));

void useSettingsStore.getState().hydrateSettings();
