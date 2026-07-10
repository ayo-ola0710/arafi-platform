import api from '../axios';
import type { Plan, CreatePlanPayload } from '../../types';

export async function getPlans(): Promise<Plan[]> {
    const { data } = await api.get('/v1/plans');
    return data;
}

export async function createPlan(body: CreatePlanPayload): Promise<Plan> {
    const { data } = await api.post('/v1/plans', body);
    return data;
}
