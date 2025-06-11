import React, { useState, useEffect } from 'react';
import { validateProduct } from '../utils/validation';
import type { Product } from '../types/Product';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface ProductFormProps {
    onSubmit: (product: Omit<Product, 'id'>) => void;
    initialData?: Product;
    isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: '',
        imageUrl: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: initialData.price.toString(),
                category: initialData.category,
                stock: initialData.stock.toString(),
                description: initialData.description || '',
                imageUrl: initialData.imageUrl || '',
            });
        }
    }, [initialData]);

    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const productData = {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            category: formData.category,
            stock: parseInt(formData.stock),
            description: formData.description.trim() || undefined,
            imageUrl: formData.imageUrl.trim() || undefined,
        };

        const validationErrors = validateProduct(productData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            onSubmit(productData);
            if (!isEditing) {
                setFormData({
                    name: '',
                    price: '',
                    category: '',
                    stock: '',
                    description: '',
                    imageUrl: '',
                });
            }
            setErrors({});
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            price: '',
            category: '',
            stock: '',
            description: '',
            imageUrl: '',
        });
        setErrors({});
    };

    const descriptionLength = formData.description.length;
    const maxDescriptionLength = 200;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        placeholder="0"
                        className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={errors.imageUrl ? 'border-red-500' : ''}
                />
                {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description
                    <span className="text-sm text-gray-500 ml-2">
                        ({descriptionLength}/{maxDescriptionLength})
                    </span>
                </Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description (optional)"
                    maxLength={maxDescriptionLength}
                    rows={3}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
                </Button>
                {!isEditing && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        disabled={isSubmitting}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </form>
    );
};

export default ProductForm;