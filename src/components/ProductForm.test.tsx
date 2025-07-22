import { render, screen } from '@testing-library/react';
import ProductForm from './ProductForm';
import { jest } from '@jest/globals';

// Mock the validateProduct function
jest.mock('../utils/validation', () => ({
  validateProduct: jest.fn((data) => {
    const product = data as {
      name?: string;
      price?: number;
      category?: string;
      stock?: number;
      imageUrl?: string;
      description?: string;
    };
    const errors: Record<string, string> = {};
    if (!product.name) errors.name = 'Name is required';
    if (isNaN(product.price as number) || (product.price as number) <= 0) errors.price = 'Price must be a positive number';
    if (!product.category) errors.category = 'Category is required';
    if (isNaN(product.stock as number) || (product.stock as number) < 0) errors.stock = 'Stock must be a non-negative number';
    if (product.imageUrl && !/^(https?:\/\/)/.test(product.imageUrl)) errors.imageUrl = 'Invalid URL format';
    if (product.description && product.description.length > 200) errors.description = 'Description exceeds 200 characters';
    return errors;
  }),
}));

describe('ProductForm Tests', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should render form with all required fields', () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument(); // Should now work
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });
});