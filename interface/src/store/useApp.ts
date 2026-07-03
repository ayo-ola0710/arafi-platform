import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { App } from '../types';
import { createApp, getApps } from '../lib/api/apps';
import type { CreateAppPayload } from '../lib/api/auth';

interface AppState {
    apps: App[];
    activeApp: App | null;
    isLoading: boolean;
    error: string | null;
    fetchApps: () => Promise<void>;
    createApp: (payload: CreateAppPayload) => Promise<App>;
    setActiveApp: (app: App) => void;
    reset: () => void;
}

export const useApp = create<AppState>()(persist((set, get) => ({
    apps: [],
    activeApp: null,
    isLoading: false,
    error: null,

    fetchApps: async () => {
        set({ isLoading: true, error: null });
        try {
            const apps = await getApps();
            const current = get().activeApp;
            // Keep active app in sync, or default to first
            const activeApp = current
                ? (apps.find(a => a.id === current.id) ?? apps[0] ?? null)
                : (apps[0] ?? null);
            set({ apps, activeApp, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to fetch apps.',
            });
        }
    },

    createApp: async (payload: CreateAppPayload) => {
        set({ isLoading: true, error: null });
        try {
            const newApp = await createApp(payload);
            set((state) => ({
                apps: [...state.apps, newApp],
                activeApp: newApp,
                isLoading: false,
            }));
            return newApp;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to create app.',
            });
            throw error;
        }
    },

    setActiveApp: (app: App) => set({ activeApp: app }),

    reset: () => set({ apps: [], activeApp: null, error: null }),
}), {
    name: 'arafi-app',
}));
