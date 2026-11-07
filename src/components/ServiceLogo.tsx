import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import * as SimpleIcons from "simple-icons";
import type { ServicePreset } from "@/lib/servicePresets";

interface Props {
  preset: ServicePreset | null | undefined;
  initial: string;
  color: string;
  size: number;
  borderRadius: number;
}

function getIcon(siKey: string): { path: string; hex: string } | null {
  const icon = (SimpleIcons as Record<string, { path: string; hex: string } | undefined>)[siKey];
  return icon ?? null;
}

/**
 * Renders a brand logo tile.
 * - If the preset has a simple-icons key → crisp offline SVG in brand color on white/dark bg
 * - If not → emoji centered on the brand color background
 * - No preset → first-letter initial
 */
export function ServiceLogo({ preset, initial, color, size, borderRadius }: Props) {
  const iconSize = size * 0.58;
  const emojiSize = size * 0.5;
  const textSize = size * 0.4;

  const icon = preset?.siKey ? getIcon(preset.siKey) : null;

  return (
    <View
      style={{ backgroundColor: color, width: size, height: size, borderRadius }}
      className="items-center justify-center overflow-hidden"
    >
      {icon ? (
        <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24">
          <Path d={icon.path} fill="#ffffff" />
        </Svg>
      ) : preset ? (
        <Text style={{ fontSize: emojiSize }}>{preset.emoji}</Text>
      ) : (
        <Text style={{ fontSize: textSize, color: "#fff", fontWeight: "700" }}>
          {initial.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}
