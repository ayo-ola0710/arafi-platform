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

export interface PublicVerificationResponse {
    success: boolean;
    status: string;
    message: string;
    appName: string;
    planName: string;
    amount: string;
    orderReference: string;
    transactionId?: string;
    redirectUrl?: string | null;
}

export async function verifyPublicSubscription(orderReference: string): Promise<PublicVerificationResponse> {
    const { data } = await api.get(`/v1/subscriptions/public/verify?orderReference=${orderReference}`);
    return data;
}

export interface PublicSubscriptionDetails {
    id: string;
    appName: string;
    planName: string;
    baseAmount: string;
    finalAmount: string;
    discountAmount: string;
    appliedCouponCode: string | null;
    interval: string;
    customerEmail: string;
    virtualAccountNumber: string | null;
    status: string;
    mode: string;
}

export async function getPublicSubscriptionDetails(id: string): Promise<PublicSubscriptionDetails> {
    const { data } = await api.get(`/v1/subscriptions/public/${id}`);
    return data;
}

export async function generatePublicCardCheckout(id: string): Promise<{ checkoutLink: string }> {
    const { data } = await api.post(`/v1/subscriptions/public/${id}/card-checkout`);
    return data;
}

export async function provisionPublicBankTransfer(id: string): Promise<{ bankAccountNumber: string; bankName: string; bankAccountName: string }> {
    const { data } = await api.post(`/v1/subscriptions/public/${id}/bank-transfer`);
    return data;
}

export async function simulatePublicBankTransfer(virtualAccountNumber: string, amount: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.post(`/v1/subscriptions/public/simulate-transfer`, { virtualAccountNumber, amount });
    return data;
}
