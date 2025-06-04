const API_BASE_URL = 'http://localhost:5000/api';

export class ApiError extends Error {
    constructor(public status: number, public message: string, public data: unknown) {
        super(message);
    }
}

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

    const data = await response.json();
    if(!response.ok) {
        throw new ApiError(response.status, data.message, data);
    }

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