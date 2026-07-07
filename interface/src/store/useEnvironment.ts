import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EnvironmentState {
    isLiveMode: boolean;
    toggleMode: () => void;
    setMode: (isLive: boolean) => void;
}

export const useEnvironment = create<EnvironmentState>()(persist((set) => ({
    isLiveMode: false,
    toggleMode: () => set((state) => ({ isLiveMode: !state.isLiveMode })),
    setMode: (isLive) => set({ isLiveMode: isLive }),
}), {
    name: 'arafi-environment',
}));
