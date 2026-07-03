import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Workspace } from '../types';
import { createWorkspace, getWorkspaces, type CreateWorkspacePayload } from '../lib/api/workspaces';

interface WorkspaceState {
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    isLoading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
    create: (payload: CreateWorkspacePayload) => Promise<Workspace>;
    setActiveWorkspace: (workspace: Workspace) => void;
    reset: () => void;
}

export const useWorkspace = create<WorkspaceState>()(persist((set, get) => ({
    workspaces: [],
    activeWorkspace: null,
    isLoading: false,
    error: null,

    fetch: async () => {
        set({ isLoading: true, error: null });
        try {
            const workspaces = await getWorkspaces();
            const current = get().activeWorkspace;
            const activeWorkspace = current
                ? (workspaces.find(w => w.app_id === current.app_id) ?? workspaces[0] ?? null)
                : (workspaces[0] ?? null);
            set({ workspaces, activeWorkspace, isLoading: false });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.response?.data?.message || 'Failed to fetch workspaces.',
            });
        }
    },

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
