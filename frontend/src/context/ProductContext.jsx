import React, { createContext, useContext, useState, useEffect } from 'react';
import { LISTINGS } from '../data/mockData';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Load initial products from mock data, or localStorage if we want persistence across reloads for new items
        // For this demo, let's merge mock data with any local storage revisions
        const storedProducts = localStorage.getItem('marketplace_products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            setProducts(LISTINGS);
        }
    }, []);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now().toString(),
            postedAt: 'Just now'
        };
        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);
        localStorage.setItem('marketplace_products', JSON.stringify(updatedProducts));
    };

    const deleteProduct = (id) => {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        localStorage.setItem('marketplace_products', JSON.stringify(updatedProducts));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
