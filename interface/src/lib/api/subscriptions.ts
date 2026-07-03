import api from '../axios';
import type { Subscription, CreateSubscriptionPayload } from '../../types';

export async function getSubscriptions(): Promise<Subscription[]> {
    const { data } = await api.get('/v1/subscriptions');
    return data;
}

export async function createSubscription(body: CreateSubscriptionPayload): Promise<Subscription> {
    const { data } = await api.post('/v1/subscriptions', body);
    return data;
}
