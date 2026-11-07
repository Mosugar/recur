// Web stub — expo-sqlite is not supported on web.
import type { Subscription } from "./schema";

export async function getAllSubscriptions(): Promise<Subscription[]> {
  return [];
}
export async function getSubscriptionById(_id: string): Promise<Subscription | null> {
  return null;
}
export async function insertSubscription(_sub: Subscription): Promise<void> {}
export async function updateSubscription(_sub: Subscription): Promise<void> {}
export async function deleteSubscription(_id: string): Promise<void> {}
export async function deleteAllSubscriptions(): Promise<void> {}
