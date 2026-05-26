import { getToken, clearToken } from './auth'
import type { EmployeeCreateRequest, Employee } from '../types/Employee'

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

// Employee API endpoints
export const addEmployee = async (employeeData: EmployeeCreateRequest): Promise<Response> => {
    return apiFetch('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
    });
};

export const getEmployees = async (): Promise<Response> => {
    return apiFetch('/employees', {
        method: 'GET',
    });
};

export const updateEmployee = async (id: number, employeeData: Partial<Employee>): Promise<Response> => {
    return apiFetch(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData),
    });
};

export const deleteEmployee = async (id: number): Promise<Response> => {
    return apiFetch(`/employees/${id}`, {
        method: 'DELETE',
    });
};