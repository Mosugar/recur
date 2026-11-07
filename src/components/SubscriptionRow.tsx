import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Subscription } from "@/db/schema";
import { nextPaymentDate, daysUntil, dueSoonLabel } from "@/lib/dates";
import { monthlyEquivalentCents } from "@/lib/money";
import { AmountText } from "./AmountText";

interface Props {
  subscription: Subscription;
  onPress: () => void;
  onLongPress?: () => void;
}

export function SubscriptionRow({ subscription, onPress, onLongPress }: Props) {
  const { t } = useTranslation();
  const { name, price, currency, cycle, firstPaymentDate, color } = subscription;

  const nextDate = nextPaymentDate(firstPaymentDate, cycle);
  const days = daysUntil(nextDate);
  const label = dueSoonLabel(days, t);
  const monthlyCents = monthlyEquivalentCents(price, cycle);

  const nextDateStr = nextDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-row items-center px-4 py-3 active:opacity-70"
    >
      {/* Colour dot */}
      <View
        style={{ backgroundColor: color, width: 10, height: 10, borderRadius: 5 }}
        className="mr-3 flex-shrink-0"
      />

      {/* Name + cycle */}
      <View className="flex-1 mr-2">
        <Text className="text-white font-medium text-base" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-neutral-500 text-xs mt-0.5">{t(`cycles.${cycle}`)}</Text>
      </View>

      {/* Amount + next date */}
      <View className="items-end">
        <AmountText
          cents={monthlyCents}
          currency={currency}
          className="text-white font-semibold text-sm"
        />
        <Text className={`text-xs mt-0.5 ${label ? "text-accent" : "text-neutral-500"}`}>
          {label ?? nextDateStr}
        </Text>
      </View>
    </Pressable>
  );
}
