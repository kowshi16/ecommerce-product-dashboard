import { useState, useMemo } from 'react';
import type { Product, ProductFilters } from '../types/Product';

const initialFilters: ProductFilters = {
    search: '',
    category: 'All Categories',
    minPrice: '',
    maxPrice: '',
    stockStatus: 'all',
};

export const useProductFilters = (products: Product[]) => {
    const [filters, setFilters] = useState<ProductFilters>(initialFilters);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search filter
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const matchesName = product.name.toLowerCase().includes(searchTerm);
                const matchesDescription = product.description?.toLowerCase().includes(searchTerm);
                if (!matchesName && !matchesDescription) {
                    return false;
                }
            }

            // Category filter
            if (filters.category && filters.category !== 'All Categories') {
                if (product.category !== filters.category) {
                    return false;
                }
            }

            // Price range filter
            if (filters.minPrice) {
                const minPrice = parseFloat(filters.minPrice);
                if (product.price < minPrice) {
                    return false;
                }
            }

            if (filters.maxPrice) {
                const maxPrice = parseFloat(filters.maxPrice);
                if (product.price > maxPrice) {
                    return false;
                }
            }

            // Stock status filter
            if (filters.stockStatus !== 'all') {
                switch (filters.stockStatus) {
                    case 'inStock':
                        if (product.stock === 0) return false;
                        break;
                    case 'outOfStock':
                        if (product.stock > 0) return false;
                        break;
                    case 'lowStock':
                        if (product.stock >= 5) return false;
                        break;
                }
            }

            return true;
        });
    }, [products, filters]);

    const updateFilters = (newFilters: Partial<ProductFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    return {
        filteredProducts,
        filters,
        updateFilters,
        clearFilters,
    };
};