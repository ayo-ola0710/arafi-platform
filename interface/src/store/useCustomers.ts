import { create } from 'zustand';
import type { Customer, CreateCustomerPayload } from '../types';
import { getCustomers, createCustomer } from '../lib/api/customers';

interface CustomersState {
    customers: Customer[];
    isLoading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    create: (payload: CreateCustomerPayload) => Promise<Customer>;
    reset: () => void;
}

export const useCustomers = create<CustomersState>()((set) => ({
    customers: [],
    isLoading: false,
    error: null,

    fetch: async () => {
        set({ isLoading: true, error: null });
        try {
            const customers = await getCustomers();
            set({ customers, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to fetch customers.',
            });
        }
    },

    create: async (payload: CreateCustomerPayload) => {
        set({ isLoading: true, error: null });
        try {
            const customer = await createCustomer(payload);
            set((state) => ({ customers: [...state.customers, customer], isLoading: false }));
            return customer;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to create customer.',
            });
            throw error;
        }
    },

    reset: () => set({ customers: [], error: null }),
}));
