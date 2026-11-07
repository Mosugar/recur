import { Pressable, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
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
  onDelete: () => void;
}

function DeleteAction({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-danger items-center justify-center active:opacity-80"
      style={{ width: 80 }}
    >
      <Text className="text-white font-semibold text-sm">Delete</Text>
    </Pressable>
  );
}

export function SubscriptionRow({ subscription, onPress, onDelete }: Props) {
  const { t } = useTranslation();
  const { language } = useSettingsStore();
  const locale = language === "fr" ? "fr-FR" : "en-US";
  const { name, price, currency, cycle, firstPaymentDate, color, active } = subscription;

  const nextDate = nextPaymentDate(firstPaymentDate, cycle);
  const days = daysUntil(nextDate);
  const dueLabel = dueSoonLabel(days, t);
  const monthlyCents = monthlyEquivalentCents(price, cycle);

  const preset = SERVICE_PRESETS.find((p) => p.name.toLowerCase() === name.toLowerCase());

  const nextDateStr = nextDate.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });

  return (
    <ReanimatedSwipeable
      renderRightActions={() => <DeleteAction onPress={onDelete} />}
      rightThreshold={40}
      overshootRight={false}
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-center px-4 py-3 bg-neutral-950 active:opacity-70"
        style={{ opacity: active ? 1 : 0.4 }}
      >
        {/* Logo */}
        <View className="mr-3 flex-shrink-0">
          <ServiceLogo preset={preset} initial={name} color={color} size={44} borderRadius={12} />
        </View>

        {/* Name + cycle */}
        <View className="flex-1 mr-2">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {name}
            </Text>
            {!active && (
              <View className="bg-neutral-800 px-1.5 py-0.5 rounded-md">
                <Text className="text-neutral-500 text-xs">{t("home.paused")}</Text>
              </View>
            )}
          </View>
          <Text className="text-neutral-500 text-xs mt-0.5">{t(`cycles.${cycle}`)}</Text>
        </View>

        {/* Amount + due label */}
        <View className="items-end">
          <Text className="text-white font-semibold text-sm">
            {formatMoney(monthlyCents, currency, locale)}
          </Text>
          {active && (
            <Text
              className={`text-xs mt-0.5 ${dueLabel ? "text-accent font-medium" : "text-neutral-500"}`}
            >
              {dueLabel ?? nextDateStr}
            </Text>
          )}
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
}
