import "../global.css";
import "@/i18n"; // initialise i18next before any screen renders

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Appearance, Platform, StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useSettingsStore } from "@/store/settingsStore";

SplashScreen.preventAutoHideAsync();

// Tell NativeWind's web runtime to use class-based dark mode.
if (Platform.OS === "web") {
  (StyleSheet as any).setFlag?.("darkMode", "class");
}

/**
 * Applies the user's stored theme preference.
 * - Native: drives Appearance.setColorScheme so useColorScheme() reflects it.
 * - Web:    adds/removes the `dark` class on <html>.
 */
function useAppTheme() {
  const theme = useSettingsStore((s) => s.theme);
  const systemScheme = useColorScheme();

  useEffect(() => {
    // Native override
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(theme === "system" ? "auto" : (theme as "light" | "dark"));
    }
  }, [theme]);

  useEffect(() => {
    // Web override
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const resolved = theme === "system" ? systemScheme : theme;
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [theme, systemScheme]);
}

export default function RootLayout() {
  useAppTheme();
  const loadSubs = useSubscriptionStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);

  useEffect(() => {
    Promise.all([loadSubs(), loadSettings()]).finally(() => {
      SplashScreen.hideAsync();
    });
  }, [loadSubs, loadSettings]);

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="subscription/new"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="subscription/[id]"
          options={{ presentation: "card", headerShown: false }}
        />
        <Stack.Screen
          name="subscription/edit/[id]"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
