import { Text } from "react-native";
import { formatMoney } from "@/lib/money";
import { useSettingsStore } from "@/store/settingsStore";
import type { Currency } from "@/db/schema";

interface Props {
  cents: number;
  currency: Currency;
  className?: string;
}

export function AmountText({ cents, currency, className }: Props) {
  const language = useSettingsStore((s) => s.language);
  const locale = language === "fr" ? "fr-FR" : "en-US";
  return <Text className={className}>{formatMoney(cents, currency, locale)}</Text>;
}
