import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import * as Haptics from "expo-haptics";

import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useSettingsStore } from "@/store/settingsStore";
import { requestNotificationPermission, hasNotificationPermission } from "@/lib/notifications";
import { decimalToCents, centsToDecimal } from "@/lib/money";
import { formatIso, parseDate } from "@/lib/dates";
import { SubscriptionColors } from "@/theme";
import type { Subscription, BillingCycle, Currency, Category } from "@/db/schema";

const CYCLES: BillingCycle[] = ["weekly", "monthly", "quarterly", "yearly"];
const CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "MAD"];
const CATEGORIES: Category[] = [
  "streaming",
  "music",
  "software",
  "gaming",
  "fitness",
  "cloud",
  "news",
  "other",
];

interface Props {
  mode: "new";
}
interface EditProps {
  mode: "edit";
  subscription: Subscription;
}

export function SubscriptionForm({ mode, ...rest }: Props | EditProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const add = useSubscriptionStore((s) => s.add);
  const update = useSubscriptionStore((s) => s.update);
  const { mainCurrency } = useSettingsStore();

  const existing = mode === "edit" ? (rest as EditProps).subscription : null;

  const [name, setName] = useState(existing?.name ?? "");
  const [priceStr, setPriceStr] = useState(existing ? centsToDecimal(existing.price) : "");
  const [currency, setCurrency] = useState<Currency>(existing?.currency ?? mainCurrency);
  const [cycle, setCycle] = useState<BillingCycle>(existing?.cycle ?? "monthly");
  const [dateStr, setDateStr] = useState(existing?.firstPaymentDate ?? formatIso(new Date()));
  const [category, setCategory] = useState<Category>(existing?.category ?? "other");
  const [color, setColor] = useState(existing?.color ?? SubscriptionColors[0]);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [reminderEnabled, setReminderEnabled] = useState(existing?.reminderEnabled ?? true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("form.errors.nameRequired");
    if (!priceStr.trim()) e.price = t("form.errors.priceRequired");
    else if (isNaN(decimalToCents(priceStr))) e.price = t("form.errors.priceInvalid");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const price = decimalToCents(priceStr);
      // Ensure dateStr is a valid date
      let firstPaymentDate = dateStr;
      try {
        parseDate(dateStr);
      } catch {
        firstPaymentDate = formatIso(new Date());
      }

      if (mode === "new") {
        await add({
          name: name.trim(),
          price,
          currency,
          cycle,
          firstPaymentDate,
          category,
          color,
          notes,
          reminderEnabled,
        });
      } else {
        await update({
          ...existing!,
          name: name.trim(),
          price,
          currency,
          cycle,
          firstPaymentDate,
          category,
          color,
          notes,
          reminderEnabled,
        });
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save subscription.");
      setSaving(false);
    }
  }

  const isValid = name.trim().length > 0 && !isNaN(decimalToCents(priceStr));

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-neutral-800">
          <Pressable onPress={() => router.back()} className="p-1 mr-3">
            <Text className="text-accent text-base">{t("home.cancel")}</Text>
          </Pressable>
          <Text className="flex-1 text-white font-semibold text-base text-center">
            {mode === "new" ? t("form.newTitle") : t("form.editTitle")}
          </Text>
          <Pressable
            onPress={handleSave}
            disabled={!isValid || saving}
            className={`p-1 ${!isValid || saving ? "opacity-40" : ""}`}
          >
            <Text className="text-accent font-semibold text-base">
              {saving ? t("form.saving") : t("form.save")}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Name */}
          <FormSection>
            <FieldLabel>{t("form.name")}</FieldLabel>
            <TextInput
              value={name}
              onChangeText={(v) => {
                setName(v);
                setErrors((e) => ({ ...e, name: "" }));
              }}
              placeholder={t("form.namePlaceholder")}
              placeholderTextColor="#6B7280"
              className="text-white text-base py-2"
              autoFocus={mode === "new"}
              returnKeyType="next"
            />
            {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
          </FormSection>

          {/* Price + Currency */}
          <FormSection>
            <FieldLabel>{t("form.price")}</FieldLabel>
            <View className="flex-row items-center gap-3">
              <TextInput
                value={priceStr}
                onChangeText={(v) => {
                  setPriceStr(v);
                  setErrors((e) => ({ ...e, price: "" }));
                }}
                placeholder="0.00"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
                className="flex-1 text-white text-base py-2"
              />
              <ChipRow
                items={CURRENCIES}
                selected={currency}
                onSelect={(v) => setCurrency(v as Currency)}
                small
              />
            </View>
            {errors.price ? <ErrorText>{errors.price}</ErrorText> : null}
          </FormSection>

          {/* Cycle */}
          <FormSection>
            <FieldLabel>{t("form.cycle")}</FieldLabel>
            <ChipRow
              items={CYCLES}
              selected={cycle}
              onSelect={(v) => setCycle(v as BillingCycle)}
              label={(v) => t(`cycles.${v}`)}
            />
          </FormSection>

          {/* First payment date */}
          <FormSection>
            <FieldLabel>{t("form.firstPaymentDate")}</FieldLabel>
            <TextInput
              value={dateStr}
              onChangeText={setDateStr}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#6B7280"
              className="text-white text-base py-2"
              keyboardType="numbers-and-punctuation"
            />
          </FormSection>

          {/* Category */}
          <FormSection>
            <FieldLabel>{t("form.category")}</FieldLabel>
            <View className="flex-row flex-wrap gap-2 mt-1">
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-pill border ${
                    category === c ? "bg-accent border-accent" : "border-neutral-700"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${category === c ? "text-white" : "text-neutral-400"}`}
                  >
                    {t(`categories.${c}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </FormSection>

          {/* Color */}
          <FormSection>
            <FieldLabel>{t("form.color")}</FieldLabel>
            <View className="flex-row flex-wrap gap-3 mt-2">
              {SubscriptionColors.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full items-center justify-center`}
                >
                  {color === c && <View className="w-3 h-3 rounded-full bg-white opacity-90" />}
                </Pressable>
              ))}
            </View>
          </FormSection>

          {/* Notes */}
          <FormSection>
            <FieldLabel>{t("form.notes")}</FieldLabel>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={t("form.notesPlaceholder")}
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
              className="text-white text-base py-2"
              textAlignVertical="top"
            />
          </FormSection>

          {/* Reminder toggle */}
          <FormSection>
            <View className="flex-row items-center justify-between">
              <FieldLabel>{t("form.reminder")}</FieldLabel>
              <Switch
                value={reminderEnabled}
                onValueChange={async (val) => {
                  if (val) {
                    const granted = await hasNotificationPermission();
                    if (!granted) await requestNotificationPermission();
                  }
                  setReminderEnabled(val);
                }}
                trackColor={{ false: "#374151", true: "#6366F1" }}
                thumbColor="#ffffff"
              />
            </View>
          </FormSection>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Small helpers ────────────────────────────────────────────────────────────

function FormSection({ children }: { children: React.ReactNode }) {
  return <View className="mx-4 mt-5 pb-5 border-b border-neutral-800">{children}</View>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest mb-2">
      {children}
    </Text>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <Text className="text-danger text-xs mt-1">{children}</Text>;
}

function ChipRow({
  items,
  selected,
  onSelect,
  label,
  small,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  label?: (v: string) => string;
  small?: boolean;
}) {
  return (
    <View className="flex-row flex-wrap gap-2 mt-1">
      {items.map((item) => (
        <Pressable
          key={item}
          onPress={() => onSelect(item)}
          className={`${small ? "px-2 py-1" : "px-3 py-1.5"} rounded-pill border ${
            selected === item ? "bg-accent border-accent" : "border-neutral-700"
          }`}
        >
          <Text
            className={`${small ? "text-xs" : "text-xs"} font-medium ${
              selected === item ? "text-white" : "text-neutral-400"
            }`}
          >
            {label ? label(item) : item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
