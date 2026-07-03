import api from '../axios';
import type { AuthResponse, User } from '../../types';

export interface Register {
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface CreateAppPayload {
    name: string;
    environment: 'live' | 'test';
}

export async function register(body: Register): Promise<AuthResponse> {
    const { data } = await api.post('/v1/auth/signup', body);
    return data;
}

export async function login(body: Login): Promise<AuthResponse> {
    const { data } = await api.post('/v1/auth/login', body);
    return data;
}

export async function refreshToken(token: string): Promise<{ accessToken: string }> {
    const { data } = await api.post('/v1/auth/refresh', { refreshToken: token });
    return data;
}

export async function getMe(): Promise<User> {
    const { data } = await api.get('/v1/auth/me');
    return data;
}