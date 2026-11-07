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

interface SubscriptionStore {
  subscriptions: Subscription[];
  isLoading: boolean;
  // Actions
  load: () => Promise<void>;
  add: (data: Omit<Subscription, "id" | "createdAt">) => Promise<void>;
  update: (sub: Subscription) => Promise<void>;
  remove: (id: string) => Promise<void>;
  removeAll: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const subscriptions = await getAllSubscriptions();
    set({ subscriptions, isLoading: false });
  },

  add: async (data) => {
    const sub: Subscription = {
      ...data,
      id: Crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await insertSubscription(sub);
    set({ subscriptions: [sub, ...get().subscriptions] });
  },

  update: async (sub) => {
    await updateSubscription(sub);
    set({
      subscriptions: get().subscriptions.map((s) => (s.id === sub.id ? sub : s)),
    });
  },

  remove: async (id) => {
    await deleteSubscription(id);
    set({ subscriptions: get().subscriptions.filter((s) => s.id !== id) });
  },

  removeAll: async () => {
    await deleteAllSubscriptions();
    set({ subscriptions: [] });
  },
}));
