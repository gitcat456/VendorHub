import client from './client';

export const login = async (username, password) => {
    const response = await client.post('api/users/login/', { username, password });
    return response.data;
};

export const signup = async (userData) => {
    const response = await client.post('api/users/signup/', userData);
    return response.data;
};

export const getProfile = async () => {
    const response = await client.get('api/users/profile/');
    return response.data;
};

export const updateProfile = async (formData) => {
    const response = await client.patch('api/users/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};
