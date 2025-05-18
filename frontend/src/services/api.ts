const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
    data: T;
    status: number;
    ok: boolean;
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        return {
            data: null as any,
            status: 401,
            ok: false,
        };
    }

    const data = await response.json();
    return {
        data,
        status: response.status,
        ok: response.ok,
    };
}

export const api = {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: <T>(endpoint: string, body: any) => 
        apiRequest<T>(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(body) 
        }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put: <T>(endpoint: string, body: any) => 
        apiRequest<T>(endpoint, { 
            method: 'PUT', 
            body: JSON.stringify(body) 
        }),
    delete: <T>(endpoint: string) => 
        apiRequest<T>(endpoint, { method: 'DELETE' }),
}; 