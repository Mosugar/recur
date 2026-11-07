import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { Colors, Dark, Light } from "@/theme";
import { TabIcon } from "@/components/TabIcon";

export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? Dark : Light;
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.surfaceBorder,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color as string} size={22} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t("tabs.stats"),
          tabBarIcon: ({ color }) => <TabIcon name="stats" color={color as string} size={22} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color as string} size={22} />,
        }}
      />
    </Tabs>
  );
}
