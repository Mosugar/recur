import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-xl font-semibold">Subscription Detail</Text>
        <Text className="text-neutral-400 mt-2 text-sm">id: {id} — Coming in Step 6</Text>
      </View>
    </SafeAreaView>
  );
}
