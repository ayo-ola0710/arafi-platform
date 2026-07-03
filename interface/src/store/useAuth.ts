import { create } from "zustand";
import { persist } from 'zustand/middleware';
import type { User } from "../types";
import { register as registerApi, login as loginApi, type Register, type Login } from "../lib/api/auth";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: Login) => Promise<User>;
    register: (credentials: Register) => Promise<User>;
    logout: () => void;
    clearError: () => void;
}

export const useAuth = create<AuthState>()(persist((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (credentials: Login) => {
        set({ isLoading: true, error: null });
        try {
            const { accessToken, refreshToken, user } = await loginApi(credentials);
            set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
            return user;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || "Failed to login. Please check your credentials.",
            });
            throw error;
        }
    },

    register: async (credentials: Register) => {
        set({ isLoading: true, error: null });
        try {
            const { accessToken, refreshToken, user } = await registerApi(credentials);
            set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
            return user;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || "Failed to register account.",
            });
            throw error;
        }
    },

    logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, error: null }),
    clearError: () => set({ error: null }),
}), {
    name: 'auth',
}))