import { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface DonutSlice {
  value: number;
  color: string;
}

interface Props {
  slices: DonutSlice[];
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({ slices, size = 180, strokeWidth = 28 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const total = slices.reduce((s, sl) => s + sl.value, 0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [slices.length, progress]);

  // Build cumulative offsets (pure derivation, no mutation after first assignment)
  const segments = buildSegments(slices, total);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background ring */}
        <Circle cx={cx} cy={cy} r={radius} stroke="#1F2937" strokeWidth={strokeWidth} fill="none" />
        {/* Animated slices */}
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          {segments.map((seg, i) => (
            <AnimatedSlice
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              circumference={circumference}
              color={seg.color}
              pct={seg.pct}
              startOffset={seg.startOffset}
              progress={progress}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
}

interface SliceProps {
  cx: number;
  cy: number;
  r: number;
  circumference: number;
  color: string;
  pct: number;
  startOffset: number;
  progress: ReturnType<typeof useSharedValue<number>>;
}

function AnimatedSlice({
  cx,
  cy,
  r,
  circumference,
  color,
  pct,
  startOffset,
  progress,
}: SliceProps) {
  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    const dashLength = circumference * pct * p;
    const gapLength = circumference - dashLength;
    const dashOffset = circumference * (1 - startOffset * p);
    return {
      strokeDasharray: `${dashLength} ${gapLength}`,
      strokeDashoffset: dashOffset,
    };
  });

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      r={r}
      stroke={color}
      strokeWidth={28}
      fill="none"
      strokeLinecap="butt"
      animatedProps={animatedProps}
    />
  );
}

function buildSegments(slices: DonutSlice[], total: number) {
  let acc = 0;
  return slices.map((sl) => {
    const pct = total > 0 ? sl.value / total : 0;
    const startOffset = acc;
    acc = acc + pct;
    return { ...sl, pct, startOffset };
  });
}
