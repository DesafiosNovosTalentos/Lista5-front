const API_BASE_URL = "http://localhost:8000/api";

function getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

function handleUnauthorized() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('logged_user_id');
    window.location.href = '/index.html';
}

async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: getAuthHeaders(),
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, finalOptions);

        if (response.status === 204) {
            return { ok: true };
        }

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                handleUnauthorized();
                throw new Error('Não autorizado');
            }
            throw data;
        }

        return data;
    } catch (error) {
        console.error(`Erro na requisição ${endpoint}:`, error);
        throw error;
    }
}

async function validateSession() {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        window.location.href = '/index.html';
        return null;
    }

    return true;
}