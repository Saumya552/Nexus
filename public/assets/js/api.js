/**
 * API endpoints and HTTP request methods
 */
const API_BASE = 'api';

const api = {
    /**
     * Helper to perform fetch requests
     */
    async request(endpoint, options = {}) {
        // Read CSRF token dynamically from head meta tag for Laravel session validation
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        const url = `${API_BASE}/${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (csrfToken) {
            defaultOptions.headers['X-CSRF-TOKEN'] = csrfToken;
        }

        // Deep merge headers to preserve any custom caller parameters
        const fetchOptions = { 
            ...defaultOptions, 
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        };
        
        try {
            const response = await fetch(url, fetchOptions);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    },

    /**
     * Auth API
     */
    auth: {
        login: async (username, password) => {
            return await api.request('auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
        },
        
        logout: async () => {
            return await api.request('auth/logout', {
                method: 'POST'
            });
        },
        
        check: async () => {
            return await api.request('auth/check', {
                method: 'GET'
            });
        },

        register: async (username, email, password) => {
            return await api.request('auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
        }
    },

    /**
     * Dashboard API
     */
    dashboard: {
        getSummary: async () => {
            return await api.request('dashboard/summary', {
                method: 'GET'
            });
        }
    },

    /**
     * Predictions API
     */
    predictions: {
        getSolar: async (location = null) => {
            let url = 'predictions/solar';
            if (location) url += `?location=${encodeURIComponent(location)}`;
            return await api.request(url, { method: 'GET' });
        },
        
        getWind: async (location = null) => {
            let url = 'predictions/wind';
            if (location) url += `?location=${encodeURIComponent(location)}`;
            return await api.request(url, { method: 'GET' });
        }
    },

    /**
     * Contact API
     */
    contact: {
        submit: async (data) => {
            return await api.request('contact/submit', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
    },

    /**
     * Admin API
     */
    admin: {
        getMessages: async () => {
            return await api.request('admin/messages', { method: 'GET' });
        },
        markMessageRead: async (id) => {
            return await api.request('admin/mark-read', {
                method: 'POST',
                body: JSON.stringify({ id })
            });
        },
        getUsers: async () => {
            // Forward to user-management list for complete statistics
            return await api.request('user-management/list', { method: 'GET' });
        }
    },

    /**
     * Climate Analytics API
     */
    climate: {
        getSummary: async () => api.request('climate/summary', { method: 'GET' }),
        getRegions: async () => api.request('climate/regions', { method: 'GET' }),
        getHistory: async (region = 'Global Avg') =>
            api.request(`climate/history?region=${encodeURIComponent(region)}`, { method: 'GET' })
    },

    /**
     * Live Weather API
     */
    weather: {
        getCurrent: async (city = 'Mumbai') =>
            api.request(`weather/current?city=${encodeURIComponent(city)}`, { method: 'GET' }),
        getForecast: async (city = 'Mumbai') =>
            api.request(`weather/forecast?city=${encodeURIComponent(city)}`, { method: 'GET' })
    },

    /**
     * User Management API (Admin only)
     */
    userManagement: {
        list:         async ()     => api.request('user-management/list',   { method: 'GET' }),
        create:       async (data) => api.request('user-management/create', { method: 'POST', body: JSON.stringify(data) }),
        update:       async (data) => api.request('user-management/update', { method: 'POST', body: JSON.stringify(data) }),
        remove:       async (id)   => api.request('user-management/delete', { method: 'POST', body: JSON.stringify({ id }) }),
        toggleStatus: async (id, status) => api.request('user-management/toggle', { method: 'POST', body: JSON.stringify({ id, status }) }),
        getLogs:      async ()     => api.request('user-management/logs',   { method: 'GET' })
    }
};
