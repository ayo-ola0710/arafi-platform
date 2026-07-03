import api from '../axios';
import type { Customer, CreateCustomerPayload } from '../../types';

export async function getCustomers(): Promise<Customer[]> {
    const { data } = await api.get('/v1/customers');
    return data;
}

export async function createCustomer(body: CreateCustomerPayload): Promise<Customer> {
    const { data } = await api.post('/v1/customers', body);
    return data;
}
