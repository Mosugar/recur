/**
 * Design tokens for Recur.
 * Single source of truth — mirrors tailwind.config.js for use in
 * StyleSheet-based code and dynamic styles.
 */

export const Colors = {
  accent: "#6366F1",
  accentLight: "#818CF8",
  accentDark: "#4F46E5",

  // Neutrals
  white: "#FFFFFF",
  neutral50: "#F9FAFB",
  neutral100: "#F3F4F6",
  neutral200: "#E5E7EB",
  neutral300: "#D1D5DB",
  neutral400: "#9CA3AF",
  neutral500: "#6B7280",
  neutral600: "#4B5563",
  neutral700: "#374151",
  neutral800: "#1F2937",
  neutral850: "#18212F",
  neutral900: "#111827",
  neutral950: "#0D1117",

  // Semantic
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
} as const;

/** Light mode surface/text colours */
export const Light = {
  background: Colors.neutral50,
  surface: Colors.white,
  surfaceBorder: Colors.neutral200,
  textPrimary: Colors.neutral900,
  textSecondary: Colors.neutral500,
  textTertiary: Colors.neutral400,
} as const;

/** Dark mode surface/text colours */
export const Dark = {
  background: Colors.neutral950,
  surface: Colors.neutral900,
  surfaceBorder: Colors.neutral800,
  textPrimary: Colors.white,
  textSecondary: Colors.neutral400,
  textTertiary: Colors.neutral600,
} as const;

/** 8-point spacing grid */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radii = {
  sm: 8,
  md: 12,
  card: 16,
  pill: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
} as const;

/** Subscription colour palette (predefined choices in Add screen) */
export const SubscriptionColors = [
  "#6366F1", // Indigo (accent)
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#14B8A6", // Teal
  "#F97316", // Orange
] as const;

export type SubscriptionColor = (typeof SubscriptionColors)[number];
