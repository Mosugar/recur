import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { nextPaymentDate, daysUntil, dueSoonLabel, parseDate, addMonths } from "@/lib/dates";
import { monthlyEquivalentCents, yearlyEquivalentCents, formatMoney } from "@/lib/money";
import { SERVICE_PRESETS } from "@/lib/servicePresets";
import { ServiceLogo } from "@/components/ServiceLogo";

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const remove = useSubscriptionStore((s) => s.remove);
  const update = useSubscriptionStore((s) => s.update);
  const { language } = useSettingsStore();
  const locale = language === "fr" ? "fr-FR" : "en-US";

  const sub = subscriptions.find((s) => s.id === id);

  if (!sub) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950 items-center justify-center">
        <Text className="text-neutral-400">Not found</Text>
      </SafeAreaView>
    );
  }

  const { name, price, currency, cycle, firstPaymentDate, color, active } = sub;
  const preset = SERVICE_PRESETS.find((p) => p.name.toLowerCase() === name.toLowerCase());
  const nextDate = nextPaymentDate(firstPaymentDate, cycle);
  const days = daysUntil(nextDate);
  const dueLabel = dueSoonLabel(days, t);
  const monthlyCents = monthlyEquivalentCents(price, cycle);
  const yearlyCents = yearlyEquivalentCents(price, cycle);

  // Total paid since first payment
  const start = parseDate(firstPaymentDate);
  const now = new Date();
  let totalPaidCents = 0;
  let cursor = new Date(start);
  while (cursor <= now) {
    totalPaidCents += price;
    switch (cycle) {
      case "weekly":
        cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        cursor = addMonths(cursor, 1);
        break;
      case "quarterly":
        cursor = addMonths(cursor, 3);
        break;
      case "yearly":
        cursor = addMonths(cursor, 12);
        break;
    }
  }

  async function togglePause() {
    await Haptics.selectionAsync();
    await update({ ...sub!, active: !active });
  }

  function confirmDelete() {
    Alert.alert(t("detail.deleteConfirmTitle"), t("detail.deleteConfirmMessage", { name }), [
      { text: t("home.cancel"), style: "cancel" },
      {
        text: t("detail.deleteConfirm"),
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await remove(id);
          router.back();
        },
      },
    ]);
  }

  const nextDateStr = nextDate.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      {/* Nav bar */}
      <View className="flex-row items-center px-4 py-3 border-b border-neutral-800">
        <Pressable onPress={() => router.back()} className="p-1">
          <Text className="text-accent text-base">‹ Back</Text>
        </Pressable>
        <View className="flex-1" />
        <Pressable onPress={() => router.push(`/subscription/edit/${id}`)} className="p-1">
          <Text className="text-accent text-base">{t("detail.edit")}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View className="px-4 pt-8 pb-6 items-center">
          <View className="mb-4" style={{ opacity: active ? 1 : 0.5 }}>
            <ServiceLogo preset={preset} initial={name} color={color} size={72} borderRadius={20} />
          </View>
          <Text className="text-white text-2xl font-bold">{name}</Text>
          <Text className="text-neutral-400 text-sm mt-1">
            {formatMoney(price, currency, locale)} · {t(`cycles.${cycle}`)}
          </Text>
          {!active && (
            <View className="mt-2 bg-neutral-800 px-3 py-1 rounded-full">
              <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
                {t("detail.paused")}
              </Text>
            </View>
          )}
        </View>

        {/* Stats grid */}
        <View className="mx-4 rounded-card bg-neutral-900 border border-neutral-800 overflow-hidden">
          {active ? (
            <>
              <StatRow
                label={t("detail.nextPayment")}
                value={dueLabel ?? nextDateStr}
                accent={!!dueLabel}
              />
              <Divider />
            </>
          ) : null}
          <StatRow
            label={t("detail.monthlyEquivalent")}
            value={formatMoney(monthlyCents, currency, locale)}
          />
          <Divider />
          <StatRow
            label={t("detail.yearlyEquivalent")}
            value={formatMoney(yearlyCents, currency, locale)}
          />
          <Divider />
          <StatRow
            label={t("detail.totalPaid")}
            value={formatMoney(totalPaidCents, currency, locale)}
          />
        </View>

        {/* Notes */}
        {sub.notes ? (
          <View className="mx-4 mt-4 rounded-card bg-neutral-900 border border-neutral-800 p-4">
            <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Notes
            </Text>
            <Text className="text-white text-sm leading-5">{sub.notes}</Text>
          </View>
        ) : null}

        {/* Pause / Resume */}
        <Pressable
          onPress={togglePause}
          className="mx-4 mt-6 rounded-card border border-neutral-700 bg-neutral-900 p-4 items-center active:opacity-70"
        >
          <Text className="text-neutral-300 font-semibold">
            {active ? t("detail.pause") : t("detail.resume")}
          </Text>
        </Pressable>

        {/* Delete */}
        <Pressable
          onPress={confirmDelete}
          className="mx-4 mt-3 rounded-card border border-danger/30 bg-danger/10 p-4 items-center active:opacity-70"
        >
          <Text className="text-danger font-semibold">{t("detail.delete")}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Text className="text-neutral-400 text-sm">{label}</Text>
      <Text className={`font-semibold text-sm ${accent ? "text-accent" : "text-white"}`}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-neutral-800 mx-4" />;
}
