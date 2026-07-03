import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Workspace } from '../types';
import { createWorkspace, type CreateWorkspacePayload } from '../lib/api/workspaces';

interface WorkspaceState {
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    isLoading: boolean;
    error: string | null;
    create: (payload: CreateWorkspacePayload) => Promise<Workspace>;
    setActiveWorkspace: (workspace: Workspace) => void;
    reset: () => void;
}

export const useWorkspace = create<WorkspaceState>()(persist((set, get) => ({
    workspaces: [],
    activeWorkspace: null,
    isLoading: false,
    error: null,

    create: async (payload: CreateWorkspacePayload) => {
        set({ isLoading: true, error: null });
        try {
            const workspace = await createWorkspace(payload);
            set((state) => ({
                workspaces: [...state.workspaces, workspace],
                activeWorkspace: get().activeWorkspace ?? workspace,
                isLoading: false,
            }));
            return workspace;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to create workspace.',
            });
            throw error;
        }
    },

    setActiveWorkspace: (workspace: Workspace) => set({ activeWorkspace: workspace }),

    reset: () => set({ workspaces: [], activeWorkspace: null, error: null }),
}), {
    name: 'arafi-workspace',
}));
