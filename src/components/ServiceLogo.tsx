import { useState } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { logoUrl, type ServicePreset } from "@/lib/servicePresets";

interface Props {
  /** Pass a matched preset to show its real logo; pass null to show the initial fallback. */
  preset: ServicePreset | null | undefined;
  /** First letter fallback when no preset is matched. */
  initial: string;
  /** Background color (brand hex or user-picked color). */
  color: string;
  size: number;
  borderRadius: number;
}

/**
 * Shows a real company logo fetched from Clearbit.
 * Falls back to the preset's emoji, then to the first-letter initial if the
 * network request fails (offline / unknown domain).
 */
export function ServiceLogo({ preset, initial, color, size, borderRadius }: Props) {
  const [logoFailed, setLogoFailed] = useState(false);

  const emojiSize = size * 0.5;
  const textSize = size * 0.4;

  return (
    <View
      style={{ backgroundColor: color, width: size, height: size, borderRadius }}
      className="items-center justify-center overflow-hidden"
    >
      {preset && !logoFailed ? (
        <Image
          source={{ uri: logoUrl(preset) }}
          style={{ width: size * 0.72, height: size * 0.72 }}
          contentFit="contain"
          onError={() => setLogoFailed(true)}
          transition={150}
          cachePolicy="memory-disk"
        />
      ) : preset ? (
        // Network failed — emoji fallback
        <Text style={{ fontSize: emojiSize }}>{preset.emoji}</Text>
      ) : (
        // No preset at all — first-letter initial
        <Text style={{ fontSize: textSize, color: "#fff", fontWeight: "700" }}>
          {initial.toUpperCase()}
        </Text>
      )}
    </View>
  );
}
