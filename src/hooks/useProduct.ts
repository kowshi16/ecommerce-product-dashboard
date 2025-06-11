import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Product } from '../types/Product';
import { generateId } from '../utils/helpers';

export const useProducts = () => {
    const [products, setProducts] = useLocalStorage<Product[]>('products', []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...productData,
            id: generateId(),
        };
        setProducts(prev => [...prev, newProduct]);
    }, [setProducts]);

    const updateProduct = useCallback((id: string, productData: Omit<Product, 'id'>) => {
        setProducts(prev =>
            prev.map(product =>
                product.id === id ? { ...productData, id } : product
            )
        );
    }, [setProducts]);

    const deleteProduct = useCallback((id: string) => {
        setProducts(prev => prev.filter(product => product.id !== id));
    }, [setProducts]);

    const deleteProducts = useCallback((ids: string[]) => {
        setProducts(prev => prev.filter(product => !ids.includes(product.id)));
    }, [setProducts]);

    return {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProducts,
        loading,
    };
};