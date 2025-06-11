export const validateProduct = (product: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!product.name || product.name.trim().length === 0) {
        errors.name = 'Product name is required';
    } else if (product.name.trim().length < 3) {
        errors.name = 'Product name must be at least 3 characters';
    } else if (product.name.trim().length > 50) {
        errors.name = 'Product name must not exceed 50 characters';
    }

    // Price validation
    if (product.price === undefined || product.price === null || product.price === '') {
        errors.price = 'Price is required';
    } else if (isNaN(product.price) || product.price <= 0) {
        errors.price = 'Price must be a positive number';
    } else if (!/^\d+(\.\d{1,2})?$/.test(product.price.toString())) {
        errors.price = 'Price must have at most 2 decimal places';
    }

    // Category validation
    if (!product.category || product.category.trim().length === 0) {
        errors.category = 'Category is required';
    }

    // Stock validation
    if (product.stock === undefined || product.stock === null || product.stock === '') {
        errors.stock = 'Stock quantity is required';
    } else if (isNaN(product.stock) || product.stock < 0 || !Number.isInteger(Number(product.stock))) {
        errors.stock = 'Stock must be a non-negative integer';
    }

    // Description validation
    if (product.description && product.description.length > 200) {
        errors.description = 'Description must not exceed 200 characters';
    }

    // Image URL validation
    if (product.imageUrl && product.imageUrl.trim().length > 0) {
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(product.imageUrl)) {
            errors.imageUrl = 'Please enter a valid URL starting with http:// or https://';
        }
    }

    return errors;
};