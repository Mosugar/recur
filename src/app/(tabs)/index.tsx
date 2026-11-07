import { Alert, Pressable, SectionList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { nextPaymentDate, daysUntil } from "@/lib/dates";
import { monthlyEquivalentCents, yearlyEquivalentCents, formatMoney } from "@/lib/money";
import { EmptyState } from "@/components/EmptyState";
import { SubscriptionRow } from "@/components/SubscriptionRow";
import type { Subscription } from "@/db/schema";

type SortKey = "dueDate" | "priceDesc" | "priceAsc" | "name";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const remove = useSubscriptionStore((s) => s.remove);
  const { mainCurrency, language, monthlyBudget } = useSettingsStore();
  const locale = language === "fr" ? "fr-FR" : "en-US";

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");

  // ── Split active / paused ────────────────────────────────────────────────
  const activeSubs = subscriptions.filter((s) => s.active);
  const pausedSubs = subscriptions.filter((s) => !s.active);

  // ── Totals (active + same currency only) ─────────────────────────────────
  const sameCurrency = activeSubs.filter((s) => s.currency === mainCurrency);
  const hasOtherCurrencies = activeSubs.some((s) => s.currency !== mainCurrency);

  const totalMonthlyCents = sameCurrency.reduce(
    (acc, s) => acc + monthlyEquivalentCents(s.price, s.cycle),
    0,
  );
  const totalYearlyCents = sameCurrency.reduce(
    (acc, s) => acc + yearlyEquivalentCents(s.price, s.cycle),
    0,
  );

  // ── Budget ───────────────────────────────────────────────────────────────
  const budgetProgress = monthlyBudget > 0 ? totalMonthlyCents / monthlyBudget : 0;
  const budgetLabel =
    monthlyBudget > 0
      ? `${formatMoney(totalMonthlyCents, mainCurrency, locale)} ${t("home.budgetOf")} ${formatMoney(monthlyBudget, mainCurrency, locale)}`
      : undefined;

  // ── Filter + Sort ────────────────────────────────────────────────────────
  const filtered = activeSubs.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case "priceDesc":
        return monthlyEquivalentCents(b.price, b.cycle) - monthlyEquivalentCents(a.price, a.cycle);
      case "priceAsc":
        return monthlyEquivalentCents(a.price, a.cycle) - monthlyEquivalentCents(b.price, b.cycle);
      case "name":
        return a.name.localeCompare(b.name);
      default: {
        const dA = daysUntil(nextPaymentDate(a.firstPaymentDate, a.cycle));
        const dB = daysUntil(nextPaymentDate(b.firstPaymentDate, b.cycle));
        return dA - dB;
      }
    }
  });

  // ── Sections ─────────────────────────────────────────────────────────────
  const upcoming = sorted.filter((s) => {
    const days = daysUntil(nextPaymentDate(s.firstPaymentDate, s.cycle));
    return days >= 0 && days <= 7;
  });

  const showUpcoming = upcoming.length > 0 && sortKey === "dueDate";
  const upcomingIds = showUpcoming ? new Set(upcoming.map((s) => s.id)) : null;
  const allSubs = upcomingIds ? sorted.filter((s) => !upcomingIds.has(s.id)) : sorted;

  const sections: { title: string; data: Subscription[]; paused?: boolean }[] = [];
  if (showUpcoming) {
    sections.push({ title: t("home.upcomingTitle"), data: upcoming });
  }
  if (allSubs.length > 0) {
    sections.push({ title: t("home.allTitle"), data: allSubs });
  }
  if (pausedSubs.length > 0) {
    sections.push({ title: t("home.pausedTitle"), data: pausedSubs, paused: true });
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  function confirmDelete(sub: Subscription) {
    Alert.alert(t("home.deleteConfirmTitle"), t("home.deleteConfirmMessage", { name: sub.name }), [
      { text: t("home.cancel"), style: "cancel" },
      {
        text: t("home.deleteConfirm"),
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await remove(sub.id);
        },
      },
    ]);
  }

  if (subscriptions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <HomeHeader
          monthly={formatMoney(0, mainCurrency, locale)}
          yearly={formatMoney(0, mainCurrency, locale)}
        />
        <EmptyState onAdd={() => router.push("/subscription/new")} />
      </SafeAreaView>
    );
  }

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "dueDate", label: t("home.sortDueDate") },
    { key: "priceDesc", label: t("home.sortPriceHigh") },
    { key: "priceAsc", label: t("home.sortPriceLow") },
    { key: "name", label: t("home.sortName") },
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <HomeHeader
              monthly={formatMoney(totalMonthlyCents, mainCurrency, locale)}
              yearly={formatMoney(totalYearlyCents, mainCurrency, locale)}
              budgetProgress={budgetProgress}
              budgetLabel={budgetLabel}
            />
            {hasOtherCurrencies && (
              <Text className="text-neutral-500 text-xs px-4 pb-3 -mt-2">
                {t("home.otherCurrenciesNote")}
              </Text>
            )}

            {/* Search bar */}
            <View className="mx-4 mb-3 flex-row items-center bg-neutral-900 rounded-xl px-3 py-2.5 border border-neutral-800">
              <Text className="text-neutral-500 mr-2">🔍</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t("home.searchPlaceholder")}
                placeholderTextColor="#6B7280"
                className="flex-1 text-white text-sm"
                clearButtonMode="while-editing"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")} className="ml-2 p-1">
                  <Text className="text-neutral-500 text-base">✕</Text>
                </Pressable>
              )}
            </View>

            {/* Sort chips */}
            <View className="flex-row gap-2 px-4 mb-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => setSortKey(opt.key)}
                  className={`px-3 py-1 rounded-pill border ${
                    sortKey === opt.key ? "bg-accent/20 border-accent/60" : "border-neutral-800"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${sortKey === opt.key ? "text-accent" : "text-neutral-500"}`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View className="px-4 pt-5 pb-2 bg-neutral-950">
            <Text
              className={`text-xs font-semibold uppercase tracking-widest ${section.paused ? "text-neutral-600" : "text-neutral-500"}`}
            >
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SubscriptionRow
            subscription={item}
            onPress={() => router.push(`/subscription/${item.id}`)}
            onDelete={() => confirmDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-neutral-800/60 ml-20 mr-4" />}
        contentContainerStyle={{ paddingBottom: 120 }}
        stickySectionHeadersEnabled={false}
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/subscription/new")}
        className="absolute bottom-8 right-5 w-14 h-14 rounded-pill bg-accent items-center justify-center active:opacity-80"
        style={{
          shadowColor: "#6366F1",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 8,
        }}
        accessibilityLabel={t("home.addButton")}
        accessibilityRole="button"
      >
        <Text className="text-white text-3xl font-light leading-none mt-0.5">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function HomeHeader({
  monthly,
  yearly,
  budgetProgress,
  budgetLabel,
}: {
  monthly: string;
  yearly: string;
  budgetProgress?: number;
  budgetLabel?: string;
}) {
  const barColor =
    !budgetProgress || budgetProgress < 0.8
      ? "#6366F1"
      : budgetProgress < 1
        ? "#F59E0B"
        : "#EF4444";

  return (
    <View className="px-4 pt-8 pb-4">
      <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-2">
        Total per month
      </Text>
      <Text
        className="text-white font-bold tracking-tight"
        style={{ fontSize: 48, lineHeight: 54 }}
      >
        {monthly}
      </Text>
      <View className="flex-row items-center mt-2 gap-1">
        <Text className="text-neutral-500 text-sm">{yearly}</Text>
        <Text className="text-neutral-600 text-sm">/ yr</Text>
      </View>

      {/* Budget progress bar */}
      {budgetProgress !== undefined && budgetProgress > 0 && budgetLabel && (
        <View className="mt-4">
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-neutral-500 text-xs">{budgetLabel}</Text>
            <Text style={{ color: barColor }} className="text-xs font-semibold">
              {Math.round(budgetProgress * 100)}%
            </Text>
          </View>
          <View
            className="rounded-full overflow-hidden"
            style={{ height: 4, backgroundColor: "#1F2937" }}
          >
            <View
              style={{
                height: 4,
                width: `${Math.min(budgetProgress * 100, 100)}%`,
                backgroundColor: barColor,
                borderRadius: 2,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
