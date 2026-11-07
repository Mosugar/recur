import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Subscription } from "@/db/schema";
import { nextPaymentDate, daysUntil, dueSoonLabel } from "@/lib/dates";
import { monthlyEquivalentCents, formatMoney } from "@/lib/money";
import { useSettingsStore } from "@/store/settingsStore";
import { SERVICE_PRESETS } from "@/lib/servicePresets";
import { ServiceLogo } from "./ServiceLogo";

interface Props {
  subscription: Subscription;
  onPress: () => void;
  onLongPress?: () => void;
}

export function SubscriptionRow({ subscription, onPress, onLongPress }: Props) {
  const { t } = useTranslation();
  const { language } = useSettingsStore();
  const locale = language === "fr" ? "fr-FR" : "en-US";
  const { name, price, currency, cycle, firstPaymentDate, color } = subscription;

  const nextDate = nextPaymentDate(firstPaymentDate, cycle);
  const days = daysUntil(nextDate);
  const dueLabel = dueSoonLabel(days, t);
  const monthlyCents = monthlyEquivalentCents(price, cycle);

  // Find emoji from service presets if available
  const preset = SERVICE_PRESETS.find((p) => p.name.toLowerCase() === name.toLowerCase());

  const nextDateStr = nextDate.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-row items-center px-4 py-3 active:opacity-70"
    >
      {/* Logo */}
      <View className="mr-3 flex-shrink-0">
        <ServiceLogo preset={preset} initial={name} color={color} size={44} borderRadius={12} />
      </View>

      {/* Name + cycle */}
      <View className="flex-1 mr-2">
        <Text className="text-white font-semibold text-sm" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-neutral-500 text-xs mt-0.5">{t(`cycles.${cycle}`)}</Text>
      </View>

      {/* Amount + due label */}
      <View className="items-end">
        <Text className="text-white font-semibold text-sm">
          {formatMoney(monthlyCents, currency, locale)}
        </Text>
        <Text
          className={`text-xs mt-0.5 ${dueLabel ? "text-accent font-medium" : "text-neutral-500"}`}
        >
          {dueLabel ?? nextDateStr}
        </Text>
      </View>
    </Pressable>
  );
}
