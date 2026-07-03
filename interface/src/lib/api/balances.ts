import api from '../axios';
import type { Balance } from '../../types';
import { useWorkspace } from '../../store/useWorkspace';

export async function getBalance(): Promise<Balance> {
    const active = useWorkspace.getState().activeWorkspace;
    const key = active?.sandbox_key;
    
    const { data } = await api.get('/v1/balances', {
        headers: key ? { Authorization: `Bearer ${key}` } : {}
    });
    return data;
}
