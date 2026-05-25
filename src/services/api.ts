import { getToken, clearToken } from './auth'

const API_BASE_URL = 'https://localhost:7084/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        clearToken();
        window.location.href = '/login';
    }

    return response;
};