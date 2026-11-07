import { useLocalSearchParams } from "expo-router";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function EditSubscriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const sub = subscriptions.find((s) => s.id === id);

  if (!sub) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950 items-center justify-center">
        <Text className="text-neutral-400">Not found</Text>
      </SafeAreaView>
    );
  }

  return <SubscriptionForm mode="edit" subscription={sub} />;
}
