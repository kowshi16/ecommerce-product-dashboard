export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    description?: string;
    imageUrl?: string;
}

export interface ProductFilters {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    stockStatus: string;
}
