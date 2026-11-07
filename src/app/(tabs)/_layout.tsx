import { Tabs } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { Colors, Dark, Light } from "@/theme";

export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? Dark : Light;

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color ?? theme.textTertiary} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => <TabIcon name="chart" color={color ?? theme.textTertiary} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <TabIcon name="settings" color={color ?? theme.textTertiary} />
          ),
        }}
      />
    </Tabs>
  );
}

/** Minimal inline icon placeholder — replaced with react-native-svg icons in Step 4 */
function TabIcon({ name, color }: { name: string; color: string | number | object }) {
  const size = 22;
  const shapes: Record<string, string> = { home: "⌂", chart: "◎", settings: "⚙" };
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: color as string, fontSize: 16 }}>{shapes[name]}</Text>
    </View>
  );
}
