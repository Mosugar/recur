import { Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SERVICE_PRESETS, type ServicePreset } from "@/lib/servicePresets";

interface Props {
  onSelect: (preset: ServicePreset) => void;
}

export function ServicePicker({ onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <View className="mt-4 mb-2">
      <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-widest px-4 mb-3">
        {t("form.quickPick")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {SERVICE_PRESETS.map((preset) => (
          <Pressable
            key={preset.name}
            onPress={() => onSelect(preset)}
            className="items-center active:opacity-70"
            style={{ width: 64 }}
          >
            {/* Logo circle */}
            <View
              style={{ backgroundColor: preset.color }}
              className="w-12 h-12 rounded-2xl items-center justify-center mb-1.5"
            >
              <Text style={{ fontSize: 22 }}>{preset.emoji}</Text>
            </View>
            <Text
              className="text-neutral-400 text-xs text-center"
              numberOfLines={2}
              style={{ lineHeight: 14 }}
            >
              {preset.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
