import { create } from 'zustand';
import type { Subscription, CreateSubscriptionPayload } from '../types';
import { getSubscriptions, createSubscription } from '../lib/api/subscriptions';

interface SubscriptionsState {
    subscriptions: Subscription[];
    isLoading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    create: (payload: CreateSubscriptionPayload) => Promise<Subscription>;
    reset: () => void;
}

export const useSubscriptions = create<SubscriptionsState>()((set) => ({
    subscriptions: [],
    isLoading: false,
    error: null,

    fetch: async () => {
        set({ isLoading: true, error: null });
        try {
            const subscriptions = await getSubscriptions();
            set({ subscriptions, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to fetch subscriptions.',
            });
        }
    },

    create: async (payload: CreateSubscriptionPayload) => {
        set({ isLoading: true, error: null });
        try {
            const subscription = await createSubscription(payload);
            set((state) => ({
                subscriptions: [...state.subscriptions, subscription],
                isLoading: false,
            }));
            return subscription;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to create subscription.',
            });
            throw error;
        }
    },

    reset: () => set({ subscriptions: [], error: null }),
}));
