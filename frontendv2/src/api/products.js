import client from './client';

export const getCategories = async () => {
    const response = await client.get('api/categories/');
    return response.data;
};

export const getProducts = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await client.get(`api/products/?${params}`);
    return response.data;
};

export const getProduct = async (id) => {
    const response = await client.get(`api/products/${id}/`);
    return response.data;
};

export const createProduct = async (productData) => {
    // Use FormData for file uploads if needed, or JSON
    const response = await client.post('api/products/', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await client.put(`api/products/${id}/`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await client.delete(`api/products/${id}/`);
    return response.data;
};
