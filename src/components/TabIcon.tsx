import Svg, { Path, Circle } from "react-native-svg";

interface Props {
  name: "home" | "stats" | "settings";
  color: string;
  size?: number;
}

export function TabIcon({ name, color, size = 24 }: Props) {
  switch (name) {
    case "home":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H15v-5h-6v5H4a1 1 0 0 1-1-1V9.5Z"
            stroke={color}
            strokeWidth={1.75}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case "stats":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.75} />
          <Path d="M12 12 L12 3" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
          <Path d="M12 12 L19.5 15.5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
        </Svg>
      );
    case "settings":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.75} />
          <Path
            d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke={color}
            strokeWidth={1.75}
            strokeLinecap="round"
          />
        </Svg>
      );
  }
}
