import api from '../axios';
import type { Product, CreateProductPayload } from '../../types';
import { useWorkspace } from '../../store/useWorkspace';

export async function getProducts(): Promise<Product[]> {
    const active = useWorkspace.getState().activeWorkspace;
    const key = active?.sandbox_key;
    const { data } = await api.get('/v1/products', {
        headers: key ? { Authorization: `Bearer ${key}` } : {}
    });
    return data;
}

export async function createProduct(body: CreateProductPayload): Promise<Product> {
    const active = useWorkspace.getState().activeWorkspace;
    const key = active?.sandbox_key;
    const { data } = await api.post('/v1/products', body, {
        headers: key ? { Authorization: `Bearer ${key}` } : {}
    });
    return data;
}

export async function deleteProduct(productId: string): Promise<void> {
    const active = useWorkspace.getState().activeWorkspace;
    const key = active?.sandbox_key;
    await api.delete(`/v1/products/${productId}`, {
        headers: key ? { Authorization: `Bearer ${key}` } : {}
    });
}

export async function createProductCheckout(
    productId: string, 
    body: { customerEmail: string; customerName: string; paymentMethod: string; redirectUrl: string }
): Promise<{ checkoutId: string; checkoutUrl: string }> {
    const active = useWorkspace.getState().activeWorkspace;
    const key = active?.sandbox_key;
    const { data } = await api.post(`/v1/products/${productId}/checkout`, body, {
        headers: key ? { Authorization: `Bearer ${key}` } : {}
    });
    return data;
}

// Public Checkouts
export async function getPublicProductCheckoutDetails(checkoutId: string): Promise<any> {
    const { data } = await api.get(`/v1/products/public/checkout/${checkoutId}`);
    return data;
}

export async function provisionPublicProductBankTransfer(checkoutId: string): Promise<any> {
    const { data } = await api.post(`/v1/products/public/checkout/${checkoutId}/bank-transfer`);
    return data;
}

export async function verifyPublicProductPayment(checkoutId: string): Promise<any> {
    const { data } = await api.get(`/v1/products/public/checkout/${checkoutId}/verify`);
    return data;
}

export async function simulateProductTransfer(virtualAccountNumber: string, amount: string): Promise<any> {
    const { data } = await api.post(
        `/v1/products/public/simulate-transfer?virtualAccountNumber=${virtualAccountNumber}&amount=${amount}`
    );
    return data;
}
