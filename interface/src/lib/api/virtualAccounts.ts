import api from '../axios';
import type { VirtualAccount, CreateVirtualAccountPayload } from '../../types';

export async function createVirtualAccount(body: CreateVirtualAccountPayload): Promise<VirtualAccount> {
    const { data } = await api.post('/v1/virtual-accounts', body);
    return data;
}

export async function getVirtualAccounts(): Promise<VirtualAccount[]> {
    const { data } = await api.get('/v1/virtual-accounts');
    return data;
}
