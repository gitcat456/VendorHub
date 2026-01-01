import axios from 'axios';

const client = axios.create({
    baseURL: 'https://vendorhub-iuzy.onrender.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Call refresh endpoint
                    const response = await axios.post('https://vendorhub-iuzy.onrender.com/refresh/', {
                        refresh: refreshToken
                    });

                    const newAccess = response.data.access;
                    localStorage.setItem('access_token', newAccess);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return client(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } else {
                // No refresh token, force logout
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
