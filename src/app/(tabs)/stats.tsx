import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { monthlyEquivalentCents, formatMoney } from "@/lib/money";
import { DonutChart, type DonutSlice } from "@/components/DonutChart";
import type { Category } from "@/db/schema";

const CATEGORY_COLORS: Record<Category, string> = {
  streaming: "#6366F1", // indigo
  music: "#F97316",    // orange
  software: "#EC4899", // pink
  gaming: "#EF4444",   // red
  fitness: "#10B981",  // emerald
  cloud: "#06B6D4",    // cyan
  news: "#F59E0B",     // amber
  other: "#9CA3AF",    // neutral
};

export default function StatsScreen() {
  const { t } = useTranslation();
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const { mainCurrency, language } = useSettingsStore();
  const locale = language === "fr" ? "fr-FR" : "en-US";

  const sameCurrency = subscriptions.filter((s) => s.currency === mainCurrency && s.active);

  if (sameCurrency.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950 items-center justify-center">
        <Text className="text-white text-xl font-semibold">{t("stats.title")}</Text>
        <Text className="text-neutral-400 text-sm mt-2 text-center px-8">{t("stats.noData")}</Text>
      </SafeAreaView>
    );
  }

  // ── Category breakdown ───────────────────────────────────────────────────
  const byCategory: Partial<Record<Category, number>> = {};
  for (const sub of sameCurrency) {
    const cents = monthlyEquivalentCents(sub.price, sub.cycle);
    byCategory[sub.category] = (byCategory[sub.category] ?? 0) + cents;
  }

  const totalCents = Object.values(byCategory).reduce((a, b) => a + (b ?? 0), 0);

  const slices: (DonutSlice & { category: Category; cents: number })[] = (
    Object.entries(byCategory) as [Category, number][]
  )
    .sort((a, b) => b[1] - a[1])
    .map(([category, cents]) => ({
      category,
      cents,
      value: cents,
      color: CATEGORY_COLORS[category],
    }));

  // ── Top 3 ────────────────────────────────────────────────────────────────
  const top3 = [...sameCurrency]
    .sort(
      (a, b) => monthlyEquivalentCents(b.price, b.cycle) - monthlyEquivalentCents(a.price, a.cycle),
    )
    .slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Title */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-white text-2xl font-bold">{t("stats.title")}</Text>
          <Text className="text-neutral-400 text-sm mt-1">
            {t(sameCurrency.length === 1 ? "stats.activeCount" : "stats.activeCount_other", {
              count: sameCurrency.length,
            })}
          </Text>
        </View>

        {/* Donut + Legend */}
        <View className="items-center mt-6">
          <DonutChart slices={slices} size={200} strokeWidth={32} />
        </View>

        {/* Legend */}
        <View className="mx-4 mt-6 rounded-card bg-neutral-900 border border-neutral-800 overflow-hidden">
          <View className="px-4 py-3 border-b border-neutral-800">
            <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
              {t("stats.byCategory")}
            </Text>
          </View>
          {slices.map((sl) => {
            const pct = totalCents > 0 ? Math.round((sl.cents / totalCents) * 100) : 0;
            return (
              <View
                key={sl.category}
                className="flex-row items-center px-4 py-3 border-b border-neutral-800 last:border-0"
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: sl.color,
                  }}
                  className="mr-3"
                />
                <Text className="text-white text-sm flex-1">{t(`categories.${sl.category}`)}</Text>
                <Text className="text-neutral-400 text-sm mr-3">{pct}%</Text>
                <Text className="text-white font-semibold text-sm">
                  {formatMoney(sl.cents, mainCurrency, locale)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Top 3 */}
        <View className="mx-4 mt-4 rounded-card bg-neutral-900 border border-neutral-800 overflow-hidden">
          <View className="px-4 py-3 border-b border-neutral-800">
            <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
              {t("stats.topSubscriptions")}
            </Text>
          </View>
          {top3.map((sub, i) => (
            <View
              key={sub.id}
              className="flex-row items-center px-4 py-3 border-b border-neutral-800 last:border-0"
            >
              <Text className="text-neutral-600 font-bold w-5 text-sm mr-3">{i + 1}</Text>
              <View
                style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: sub.color }}
                className="mr-3"
              />
              <Text className="text-white text-sm flex-1" numberOfLines={1}>
                {sub.name}
              </Text>
              <Text className="text-white font-semibold text-sm">
                {formatMoney(monthlyEquivalentCents(sub.price, sub.cycle), mainCurrency, locale)}
                <Text className="text-neutral-500 font-normal">{t("home.perMonth")}</Text>
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
