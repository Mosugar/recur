import { Alert, Pressable, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { nextPaymentDate, daysUntil } from "@/lib/dates";
import { monthlyEquivalentCents, yearlyEquivalentCents, formatMoney } from "@/lib/money";
import { EmptyState } from "@/components/EmptyState";
import { SubscriptionRow } from "@/components/SubscriptionRow";
import type { Subscription } from "@/db/schema";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const remove = useSubscriptionStore((s) => s.remove);
  const { mainCurrency, language } = useSettingsStore();
  const locale = language === "fr" ? "fr-FR" : "en-US";

  // ── Totals ───────────────────────────────────────────────────────────────
  const sameCurrency = subscriptions.filter((s) => s.currency === mainCurrency);
  const hasOtherCurrencies = subscriptions.some((s) => s.currency !== mainCurrency);

  const totalMonthlyCents = sameCurrency.reduce(
    (acc, s) => acc + monthlyEquivalentCents(s.price, s.cycle),
    0,
  );
  const totalYearlyCents = sameCurrency.reduce(
    (acc, s) => acc + yearlyEquivalentCents(s.price, s.cycle),
    0,
  );

  // ── Sections ─────────────────────────────────────────────────────────────
  const upcoming = subscriptions.filter((s) => {
    const days = daysUntil(nextPaymentDate(s.firstPaymentDate, s.cycle));
    return days >= 0 && days <= 7;
  });

  const sorted = [...subscriptions].sort((a, b) => {
    const dA = daysUntil(nextPaymentDate(a.firstPaymentDate, a.cycle));
    const dB = daysUntil(nextPaymentDate(b.firstPaymentDate, b.cycle));
    return dA - dB;
  });

  const sections =
    upcoming.length > 0
      ? [
          { title: t("home.upcomingTitle"), data: upcoming },
          { title: t("home.allTitle"), data: sorted },
        ]
      : [{ title: t("home.allTitle"), data: sorted }];

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
        <Header
          monthly={formatMoney(0, mainCurrency, locale)}
          yearly={formatMoney(0, mainCurrency, locale)}
          t={t}
        />
        <EmptyState onAdd={() => router.push("/subscription/new")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Header
              monthly={formatMoney(totalMonthlyCents, mainCurrency, locale)}
              yearly={formatMoney(totalYearlyCents, mainCurrency, locale)}
              t={t}
            />
            {hasOtherCurrencies && (
              <Text className="text-neutral-500 text-xs px-4 pb-2">
                {t("home.otherCurrenciesNote")}
              </Text>
            )}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View className="px-4 pt-5 pb-2 bg-neutral-950">
            <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SubscriptionRow
            subscription={item}
            onPress={() => router.push(`/subscription/${item.id}`)}
            onLongPress={() => confirmDelete(item)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-neutral-800 ml-14 mr-4" />}
        contentContainerStyle={{ paddingBottom: 100 }}
        stickySectionHeadersEnabled={false}
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/subscription/new")}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-pill bg-accent items-center justify-center shadow-lg active:opacity-80"
        accessibilityLabel={t("home.addButton")}
        accessibilityRole="button"
      >
        <Text className="text-white text-3xl font-light leading-none">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Header({
  monthly,
  yearly,
  t,
}: {
  monthly: string;
  yearly: string;
  t: (k: string) => string;
}) {
  return (
    <View className="px-4 pt-6 pb-4">
      <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-1">
        {t("home.allTitle")}
      </Text>
      <Text className="text-white text-5xl font-bold tracking-tight">{monthly}</Text>
      <Text className="text-neutral-400 text-sm mt-1">
        {t("home.perMonth")} · {yearly} {t("home.perYear")}
      </Text>
    </View>
  );
}
