import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Subscription } from "@/db/schema";
import { nextPaymentDate } from "./dates";
import { formatMoney } from "./money";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Request permission; returns true if granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/** Check current permission without prompting. */
export async function hasNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

/** Cancel all scheduled notifications and re-schedule for all subscriptions. */
export async function rescheduleAll(
  subscriptions: Subscription[],
  reminderHour: number,
  reminderMinute: number,
  locale: string,
): Promise<void> {
  if (!(await hasNotificationPermission())) return;
  await Notifications.cancelAllScheduledNotificationsAsync();

  const enabled = subscriptions.filter((s) => s.reminderEnabled);
  for (const sub of enabled) {
    await scheduleForSubscription(sub, reminderHour, reminderMinute, locale);
  }
}

async function scheduleForSubscription(
  sub: Subscription,
  hour: number,
  minute: number,
  locale: string,
): Promise<void> {
  const next = nextPaymentDate(sub.firstPaymentDate, sub.cycle);

  // Notify the day before at the user's chosen time
  const triggerDate = new Date(next);
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(hour, minute, 0, 0);

  // Don't schedule if trigger is in the past
  if (triggerDate <= new Date()) return;

  const amount = formatMoney(sub.price, sub.currency, locale);

  await Notifications.scheduleNotificationAsync({
    identifier: `sub-${sub.id}`,
    content: {
      title: "Payment due tomorrow",
      body: `${sub.name} — ${amount}`,
      data: { subscriptionId: sub.id },
    },
    trigger:
      Platform.OS === "web"
        ? null
        : {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
  });
}
