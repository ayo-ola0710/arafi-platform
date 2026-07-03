import { create } from 'zustand';
import type { Balance } from '../types';
import { getBalance } from '../lib/api/balances';

interface BalanceState {
    balance: Balance | null;
    isLoading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    reset: () => void;
}

export const useBalance = create<BalanceState>()((set) => ({
    balance: null,
    isLoading: false,
    error: null,

    fetch: async () => {
        set({ isLoading: true, error: null });
        try {
            const balance = await getBalance();
            set({ balance, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to fetch balance.',
            });
        }
    },

    reset: () => set({ balance: null, error: null }),
}));
