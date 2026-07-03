import api from '../axios';
import type { Workspace } from '../../types';

export interface CreateWorkspacePayload {
    name: string;
}

export async function createWorkspace(body: CreateWorkspacePayload): Promise<Workspace> {
    const { data } = await api.post('/v1/workspaces/create', body);
    return data;
}
