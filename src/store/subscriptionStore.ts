import { create } from "zustand";
import * as Crypto from "expo-crypto";
import {
  getAllSubscriptions,
  insertSubscription,
  updateSubscription,
  deleteSubscription,
  deleteAllSubscriptions,
} from "@/db/queries";
import type { Subscription } from "@/db/schema";
import { rescheduleAll } from "@/lib/notifications";
import { useSettingsStore } from "./settingsStore";

interface SubscriptionStore {
  subscriptions: Subscription[];
  isLoading: boolean;
  load: () => Promise<void>;
  add: (data: Omit<Subscription, "id" | "createdAt">) => Promise<void>;
  update: (sub: Subscription) => Promise<void>;
  remove: (id: string) => Promise<void>;
  removeAll: () => Promise<void>;
}

function getLocale() {
  const { language } = useSettingsStore.getState();
  return language === "fr" ? "fr-FR" : "en-US";
}

async function renotify(subscriptions: Subscription[]) {
  const { reminderHour, reminderMinute } = useSettingsStore.getState();
  await rescheduleAll(subscriptions, reminderHour, reminderMinute, getLocale());
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const subscriptions = await getAllSubscriptions();
    set({ subscriptions, isLoading: false });
    await renotify(subscriptions);
  },

  add: async (data) => {
    const sub: Subscription = {
      ...data,
      id: Crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await insertSubscription(sub);
    const subscriptions = [sub, ...get().subscriptions];
    set({ subscriptions });
    await renotify(subscriptions);
  },

  update: async (sub) => {
    await updateSubscription(sub);
    const subscriptions = get().subscriptions.map((s) => (s.id === sub.id ? sub : s));
    set({ subscriptions });
    await renotify(subscriptions);
  },

  remove: async (id) => {
    await deleteSubscription(id);
    const subscriptions = get().subscriptions.filter((s) => s.id !== id);
    set({ subscriptions });
    await renotify(subscriptions);
  },

  removeAll: async () => {
    await deleteAllSubscriptions();
    set({ subscriptions: [] });
    await renotify([]);
  },
}));
