import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-950 dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-xl font-semibold">Recur</Text>
        <Text className="text-neutral-400 mt-2 text-sm">Home — coming in Step 4</Text>
      </View>
    </SafeAreaView>
  );
}
