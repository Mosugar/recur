import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-xl font-semibold">Stats</Text>
        <Text className="text-neutral-400 mt-2 text-sm">Coming in Step 8</Text>
      </View>
    </SafeAreaView>
  );
}
