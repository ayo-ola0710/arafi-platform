import api from '../axios';
import type { Product, CreateProductPayload } from '../../types';

export async function getProducts(): Promise<Product[]> {
    const { data } = await api.get('/v1/products');
    return data;
}

export async function createProduct(body: CreateProductPayload): Promise<Product> {
    const { data } = await api.post('/v1/products', body);
    return data;
}

export async function deleteProduct(productId: string): Promise<void> {
    await api.delete(`/v1/products/${productId}`);
}

export async function createProductCheckout(
    productId: string, 
    body: { customerEmail: string; customerName: string; paymentMethod: string; redirectUrl: string }
): Promise<{ checkoutId: string; checkoutUrl: string }> {
    const { data } = await api.post(`/v1/products/${productId}/checkout`, body);
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
