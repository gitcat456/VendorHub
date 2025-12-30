import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCategories, getProducts, createProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '../api/products';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                getProducts(),
                getCategories()
            ]);
            setProducts(prodRes);
            setCategories(catRes);
        } catch (error) {
            console.error("Failed to refresh data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const addProduct = async (productData) => {
        const newProduct = await createProduct(productData);
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
    };

    const deleteProduct = async (id) => {
        await apiDeleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateProduct = async (id, productData) => {
        // Optimistic update or refresh could work here. Let's refresh for consistency or update local state if returns full object
        // Assuming API returns updated object:
        const updated = await apiUpdateProduct(id, productData);
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
        return updated;
    };

    return (
        <ProductContext.Provider value={{ products, categories, loading, refreshData, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
