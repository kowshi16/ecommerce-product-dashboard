import React, { useCallback } from 'react';
import { Search, X, Filter, Sparkles } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import type { ProductFilters } from '../types/Product';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface SearchFiltersProps {
    filters: ProductFilters;
    onFiltersChange: (filters: Partial<ProductFilters>) => void;
    onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, onClearFilters }) => {
    const debouncedSearchChange = useDebounce((value: string) => {
        onFiltersChange({ search: value });
    }, 300);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearchChange(e.target.value);
    }, [debouncedSearchChange]);

    const categories = ['All Categories', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];
    const stockStatuses = [
        { value: 'all', label: 'All Products', icon: '📦' },
        { value: 'inStock', label: 'In Stock', icon: '✅' },
        { value: 'outOfStock', label: 'Out of Stock', icon: '❌' },
        { value: 'lowStock', label: 'Low Stock (<5)', icon: '⚠️' },
    ];

    const hasActiveFilters =
        filters.search ||
        filters.category !== 'All Categories' ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.stockStatus !== 'all';

    return (
        <Card className="sticky top-32 bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Filters
                        </span>
                    </CardTitle>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
                {hasActiveFilters && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Sparkles className="w-3 h-3" />
                        <span>Active filters applied</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                {/* Search */}
                <div className="space-y-3">
                    <Label htmlFor="search" className="text-sm font-semibold text-gray-700">
                        Search Products
                    </Label>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            id="search"
                            placeholder="Search by name or description..."
                            defaultValue={filters.search}
                            onChange={handleSearchChange}
                            className="pl-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 bg-white/50"
                        />
                    </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Category</Label>
                    <Select
                        value={filters.category}
                        onValueChange={(value) => onFiltersChange({ category: value })}
                    >
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-xl">
                            {categories.map((category) => (
                                <SelectItem
                                    key={category}
                                    value={category}
                                    className="rounded-lg hover:bg-blue-50"
                                >
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Price Range</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Min Price</Label>
                            <Input
                                placeholder="$0"
                                type="number"
                                min="0"
                                step="0.01"
                                value={filters.minPrice}
                                onChange={(e) => onFiltersChange({ minPrice: e.target.value })}
                                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Max Price</Label>
                            <Input
                                placeholder="$999"
                                type="number"
                                min="0"
                                step="0.01"
                                value={filters.maxPrice}
                                onChange={(e) => onFiltersChange({ maxPrice: e.target.value })}
                                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Stock Status */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Stock Status</Label>
                    <Select
                        value={filters.stockStatus}
                        onValueChange={(value) => onFiltersChange({ stockStatus: value })}
                    >
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-xl">
                            {stockStatuses.map((status) => (
                                <SelectItem
                                    key={status.value}
                                    value={status.value}
                                    className="rounded-lg hover:bg-blue-50"
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{status.icon}</span>
                                        {status.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                        <Label className="text-sm font-semibold text-gray-700">Active Filters</Label>
                        <div className="flex flex-wrap gap-2">
                            {filters.search && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 rounded-full">
                                    Search: {filters.search}
                                </Badge>
                            )}
                            {filters.category !== 'All Categories' && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 rounded-full">
                                    {filters.category}
                                </Badge>
                            )}
                            {filters.minPrice && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 rounded-full">
                                    Min: ${filters.minPrice}
                                </Badge>
                            )}
                            {filters.maxPrice && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 rounded-full">
                                    Max: ${filters.maxPrice}
                                </Badge>
                            )}
                            {filters.stockStatus !== 'all' && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 rounded-full">
                                    {stockStatuses.find(s => s.value === filters.stockStatus)?.label}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SearchFilters;