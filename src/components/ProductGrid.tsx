import React from 'react';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';
import type { Product } from '../types/Product';

interface ProductGridProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    loading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <Skeleton className="h-48 w-full mb-4" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-600">
                        Try adjusting your search criteria or add some products to get started.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default ProductGrid;