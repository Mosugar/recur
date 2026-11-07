import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { detectLanguage } from "@/i18n";
import type { Currency } from "@/db/schema";

export type AppTheme = "system" | "light" | "dark";

interface SettingsState {
  mainCurrency: Currency;
  theme: AppTheme;
  language: string;
  /** Reminder hour in 24h format (0–23) */
  reminderHour: number;
  /** Reminder minute (0–59) */
  reminderMinute: number;
  /** Monthly spending cap in cents; 0 = no limit */
  monthlyBudget: number;
  isLoaded: boolean;
  setMainCurrency: (c: Currency) => void;
  setTheme: (t: AppTheme) => void;
  setLanguage: (l: string) => void;
  setReminderTime: (hour: number, minute: number) => void;
  setMonthlyBudget: (cents: number) => void;
  load: () => Promise<void>;
}

const STORAGE_KEY = "recur_settings";

const defaults = {
  mainCurrency: "EUR" as Currency,
  theme: "system" as AppTheme,
  language: detectLanguage(),
  reminderHour: 9,
  reminderMinute: 0,
  monthlyBudget: 0,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaults,
  isLoaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        set({ ...defaults, ...saved, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
      i18n.changeLanguage(get().language);
    } catch {
      set({ isLoaded: true });
    }
  },

  setMainCurrency: (mainCurrency) => {
    set({ mainCurrency });
    persist(get());
  },

  setTheme: (theme) => {
    set({ theme });
    persist(get());
  },

  setLanguage: (language) => {
    set({ language });
    i18n.changeLanguage(language);
    persist(get());
  },

  setReminderTime: (reminderHour, reminderMinute) => {
    set({ reminderHour, reminderMinute });
    persist(get());
  },

  setMonthlyBudget: (monthlyBudget) => {
    set({ monthlyBudget });
    persist(get());
  },
}));

function persist(state: SettingsState) {
  const { mainCurrency, theme, language, reminderHour, reminderMinute, monthlyBudget } = state;
  AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ mainCurrency, theme, language, reminderHour, reminderMinute, monthlyBudget }),
  ).catch(() => {});
}
