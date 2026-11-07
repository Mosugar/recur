import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSubscriptionStore } from "@/store/subscriptionStore";

SplashScreen.preventAutoHideAsync();

// Tell NativeWind's web runtime to use class-based dark mode so it doesn't
// conflict with expo-router's document class management.
// StyleSheet.setFlag is patched onto StyleSheet by react-native-css-interop.
if (Platform.OS === "web") {
  (StyleSheet as any).setFlag?.("darkMode", "class");
}

/** Syncs the system colour scheme → `dark` CSS class on <html> for web. */
function useWebDarkMode() {
  const scheme = useColorScheme();
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", scheme === "dark");
  }, [scheme]);
}

export default function RootLayout() {
  useWebDarkMode();
  const load = useSubscriptionStore((s) => s.load);

  useEffect(() => {
    load().finally(() => SplashScreen.hideAsync());
  }, [load]);

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
      </Stack>
    </GestureHandlerRootView>
  );
}
