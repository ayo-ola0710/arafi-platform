import { create } from 'zustand';
import type { Plan, CreatePlanPayload } from '../types';
import { getPlans, createPlan } from '../lib/api/plans';

interface PlansState {
    plans: Plan[];
    isLoading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    create: (payload: CreatePlanPayload) => Promise<Plan>;
    reset: () => void;
}

export const usePlans = create<PlansState>()((set) => ({
    plans: [],
    isLoading: false,
    error: null,

    fetch: async () => {
        set({ isLoading: true, error: null });
        try {
            const plans = await getPlans();
            set({ plans, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to fetch plans.',
            });
        }
    },

    create: async (payload: CreatePlanPayload) => {
        set({ isLoading: true, error: null });
        try {
            const plan = await createPlan(payload);
            set((state) => ({ plans: [...state.plans, plan], isLoading: false }));
            return plan;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to create plan.',
            });
            throw error;
        }
    },

    reset: () => set({ plans: [], error: null }),
}));
