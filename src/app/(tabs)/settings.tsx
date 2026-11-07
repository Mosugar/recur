import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import Constants from "expo-constants";

import { useSettingsStore, type AppTheme } from "@/store/settingsStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { centsToDecimal, decimalToCents } from "@/lib/money";
import type { Currency } from "@/db/schema";

const CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "MAD"];
const THEMES: AppTheme[] = ["system", "light", "dark"];
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const {
    mainCurrency,
    setMainCurrency,
    theme,
    setTheme,
    language,
    setLanguage,
    reminderHour,
    reminderMinute,
    setReminderTime,
    monthlyBudget,
    setMonthlyBudget,
  } = useSettingsStore();
  const removeAll = useSubscriptionStore((s) => s.removeAll);

  const appVersion = Constants.expoConfig?.version ?? "—";

  const [budgetStr, setBudgetStr] = useState(
    monthlyBudget > 0 ? centsToDecimal(monthlyBudget) : "",
  );

  function themeLabel(th: string) {
    if (th === "system") return t("settings.themeSystem");
    if (th === "light") return t("settings.themeLight");
    return t("settings.themeDark");
  }

  function handleBudgetBlur() {
    const trimmed = budgetStr.trim();
    if (!trimmed) {
      setMonthlyBudget(0);
      return;
    }
    const cents = decimalToCents(trimmed);
    if (!isNaN(cents) && cents > 0) {
      setMonthlyBudget(cents);
    } else {
      setBudgetStr(monthlyBudget > 0 ? centsToDecimal(monthlyBudget) : "");
    }
  }

  function confirmDeleteAll() {
    Alert.alert(t("settings.deleteAll"), t("settings.deleteAllConfirm"), [
      { text: t("home.cancel"), style: "cancel" },
      {
        text: t("settings.deleteAllButton"),
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await removeAll();
        },
      },
    ]);
  }

  function cycleReminderTime() {
    const options = [
      [8, 0],
      [9, 0],
      [10, 0],
      [12, 0],
      [18, 0],
      [20, 0],
    ];
    const current = options.findIndex(([h, m]) => h === reminderHour && m === reminderMinute);
    const next = options[(current + 1) % options.length];
    setReminderTime(next[0], next[1]);
  }

  const reminderTimeStr = `${String(reminderHour).padStart(2, "0")}:${String(reminderMinute).padStart(2, "0")}`;

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Title */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-white text-2xl font-bold">{t("settings.title")}</Text>
        </View>

        {/* Currency */}
        <Section label={t("settings.mainCurrency")}>
          <ChipRow
            items={CURRENCIES}
            selected={mainCurrency}
            onSelect={(v) => setMainCurrency(v as Currency)}
          />
        </Section>

        {/* Monthly budget */}
        <Section label={t("settings.monthlyBudget")}>
          <TextInput
            value={budgetStr}
            onChangeText={setBudgetStr}
            onBlur={handleBudgetBlur}
            placeholder={t("settings.monthlyBudgetPlaceholder")}
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
            className="text-white text-base py-2"
            returnKeyType="done"
          />
          <Text className="text-neutral-500 text-xs mt-1">
            {t("settings.monthlyBudgetHint", { currency: mainCurrency })}
          </Text>
        </Section>

        {/* Theme */}
        <Section label={t("settings.theme")}>
          <ChipRow
            items={THEMES}
            selected={theme}
            onSelect={(v) => setTheme(v as AppTheme)}
            label={themeLabel}
          />
        </Section>

        {/* Language */}
        <Section label={t("settings.language")}>
          <View className="flex-row gap-2 flex-wrap">
            {LANGUAGES.map((l) => (
              <Pressable
                key={l.code}
                onPress={() => setLanguage(l.code)}
                className={`px-4 py-2 rounded-pill border ${
                  language === l.code ? "bg-accent border-accent" : "border-neutral-700"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${language === l.code ? "text-white" : "text-neutral-400"}`}
                >
                  {l.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* Reminder time */}
        <Section label={t("settings.reminderTime")}>
          <Pressable
            onPress={cycleReminderTime}
            className="self-start px-4 py-2 rounded-pill border border-neutral-700 active:opacity-70"
          >
            <Text className="text-white font-semibold text-base">{reminderTimeStr}</Text>
          </Pressable>
          <Text className="text-neutral-500 text-xs mt-2">{t("settings.reminderTimeHint")}</Text>
        </Section>

        {/* Danger zone */}
        <View className="mx-4 mt-6">
          <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-3">
            {t("settings.dangerZone")}
          </Text>
          <Pressable
            onPress={confirmDeleteAll}
            className="rounded-card border border-danger/30 bg-danger/10 p-4 items-center active:opacity-70"
          >
            <Text className="text-danger font-semibold">{t("settings.deleteAll")}</Text>
          </Pressable>
        </View>

        {/* Version */}
        <View className="items-center mt-8">
          <Text className="text-neutral-700 text-xs">
            {t("settings.version")} {appVersion}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mx-4 mt-5 pb-5 border-b border-neutral-800">
      <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-3">
        {label}
      </Text>
      {children}
    </View>
  );
}

function ChipRow({
  items,
  selected,
  onSelect,
  label,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  label?: (v: string) => string;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => (
        <Pressable
          key={item}
          onPress={() => onSelect(item)}
          className={`px-4 py-2 rounded-pill border ${
            selected === item ? "bg-accent border-accent" : "border-neutral-700"
          }`}
        >
          <Text
            className={`text-sm font-medium ${selected === item ? "text-white" : "text-neutral-400"}`}
          >
            {label ? label(item) : item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
