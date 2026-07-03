import api from '../axios';
import type { Balance } from '../../types';

export async function getBalance(): Promise<Balance> {
    const { data } = await api.get('/v1/balances');
    return data;
}
