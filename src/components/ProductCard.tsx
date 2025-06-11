import React, { useState } from "react";
import { Edit, Trash2, Eye, Heart } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import type { Product } from "../types/Product";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    selected: boolean;
    onToggleSelection: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(
    ({ product, onEdit, onDelete, selected, onToggleSelection }) => {
        const [imageError, setImageError] = useState(false);
        const [isHovered, setIsHovered] = useState(false);
        const placeholderImage = "/image-placeholder.jpg";

        const getStockStatus = () => {
            if (product.stock === 0)
                return {
                    label: "Out of Stock",
                    variant: "destructive" as const,
                    color: "from-red-500 to-red-600",
                };
            if (product.stock < 5)
                return {
                    label: "Low Stock",
                    variant: "secondary" as const,
                    color: "from-amber-500 to-orange-500",
                };
            return {
                label: "In Stock",
                variant: "default" as const,
                color: "from-green-500 to-emerald-500",
            };
        };

        const stockStatus = getStockStatus();

        const truncateDescription = (text: string, maxLength: number = 50) => {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + "...";
        };

        const getCategoryGradient = (category: string) => {
            const gradients = {
                Electronics: "from-blue-500 to-cyan-500",
                Clothing: "from-pink-500 to-rose-500",
                Books: "from-amber-500 to-yellow-500",
                Home: "from-green-500 to-emerald-500",
                Sports: "from-orange-500 to-red-500",
                Other: "from-purple-500 to-indigo-500",
            };
            return (
                gradients[category as keyof typeof gradients] ||
                "from-gray-500 to-gray-600"
            );
        };

        return (
            <div
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={
                            imageError
                                ? placeholderImage
                                : product.imageUrl || placeholderImage
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImageError(true)}
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Stock status badge */}
                    <div className="absolute top-4 right-4">
                        <div
                            className={`bg-gradient-to-r ${stockStatus.color} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
                        >
                            {stockStatus.label}
                        </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                        <div
                            className={`bg-gradient-to-r ${getCategoryGradient(
                                product.category
                            )} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}
                        >
                            {product.category}
                        </div>
                    </div>

                    {/* Hover actions */}
                    <div
                        className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
                            onClick={() => onEdit(product)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white text-gray-800 shadow-lg backdrop-blur-sm"
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                            {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {formatCurrency(product.price)}
                            </div>
                            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {product.stock} units
                            </div>
                        </div>
                    </div>

                    {product.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {truncateDescription(product.description)}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(product)}
                            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(product.id)}
                            className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                    <div className="flex gap-2 items-center border border-gray-100 bg-white rounded-lg shadow-sm p-2">
                        <div className="flex-1 flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md hover:bg-red-50 hover:border-red-300 transition-all duration-200 group">
                            <div className="flex items-center">
                                <Trash2 className="w-5 h-5 mr-3 text-red-600 group-hover:text-red-700 transition-colors duration-200" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Multiple Delete</span>
                            </div>
                            <Checkbox
                                checked={selected}
                                onCheckedChange={(checked) => checked !== undefined && onToggleSelection(product.id)}
                                className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 rounded transition-all duration-200 hover:bg-blue-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full" />
            </div>
        );
    }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
