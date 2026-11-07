import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Svg, { Circle, Path } from "react-native-svg";

interface Props {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: Props) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-8">
      <EmptyIllustration />
      <Text className="text-white text-xl font-semibold mt-6 text-center">{t("empty.title")}</Text>
      <Text className="text-neutral-400 text-sm mt-2 text-center leading-5">
        {t("empty.subtitle")}
      </Text>
      <Pressable
        onPress={onAdd}
        className="mt-8 bg-accent px-6 py-3 rounded-pill active:opacity-80"
      >
        <Text className="text-white font-semibold text-sm">{t("empty.cta")}</Text>
      </Pressable>
    </View>
  );
}

function EmptyIllustration() {
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96" fill="none">
      {/* Outer ring */}
      <Circle cx={48} cy={48} r={44} stroke="#374151" strokeWidth={2} />
      {/* Inner circle */}
      <Circle cx={48} cy={48} r={28} fill="#1F2937" />
      {/* Credit card icon */}
      <Path
        d="M32 40h32a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H32a2 2 0 0 1-2-2V42a2 2 0 0 1 2-2Z"
        stroke="#6366F1"
        strokeWidth={1.5}
        fill="none"
      />
      <Path d="M30 46h36" stroke="#6366F1" strokeWidth={1.5} />
      <Path d="M34 50h8" stroke="#374151" strokeWidth={2} strokeLinecap="round" />
      {/* Plus badge */}
      <Circle cx={68} cy={28} r={10} fill="#6366F1" />
      <Path d="M68 24v8M64 28h8" stroke="white" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
