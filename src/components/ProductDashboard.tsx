import { useState } from "react";
import { Plus, Package, TrendingUp, Users, ShoppingCart } from "lucide-react";
import { useProducts } from "../hooks/useProduct";
import { useProductFilters } from "../hooks/useProductFilter";
import type { Product } from "../types/Product";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import ProductForm from "./ProductForm";
import ProductGrid from "./ProductGrid";
import SearchFilters from "./SearchFilters";
import { Filter, Trash2 } from "lucide-react";

const ProductDashboard = () => {
    const {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProducts,
        loading,
    } = useProducts();
    const { filteredProducts, filters, updateFilters, clearFilters } =
        useProductFilters(products);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
        new Set()
    );
    const [undoBuffer, setUndoBuffer] = useState<Product[]>([]);
    const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleAddProduct = (productData: Omit<Product, "id">) => {
        addProduct(productData);
        setIsFormOpen(false);
    };

    const handleEditProduct = (productData: Omit<Product, "id">) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
            setEditingProduct(null);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleDelete = (id: string) => {
        setProductToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            const productToRemove = products.find((p) => p.id === productToDelete);
            if (productToRemove) {
                setUndoBuffer((prev) => [productToRemove, ...prev.slice(0, 4)]);
                deleteProduct(productToDelete);
            }
        }
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
        startUndoTimeout();
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
    };

    const handleBulkDelete = async () => {
        // setDeleteConfirmOpen(true);
        const productsToRemove = products.filter((p) => selectedProducts.has(p.id));
        console.log(
            "Products to remove:",
            productsToRemove.map((p) => p.id)
        );
        setUndoBuffer((prev) => [...productsToRemove, ...prev.slice(0, 4)]);
        deleteProducts(Array.from(selectedProducts));
        setSelectedProducts(new Set());
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
        startUndoTimeout();
    };

    const toggleProductSelection = (id: string) => {
        setSelectedProducts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            console.log("Selected Products:", newSet);
            return newSet;
        });
    };

    const undoDelete = () => {
        if (undoBuffer.length > 0) {
            const lastDeleted = undoBuffer[0];
            addProduct(lastDeleted);
            setUndoBuffer((prev) => prev.slice(1));
            if (undoTimeout) {
                clearTimeout(undoTimeout);
                startUndoTimeout();
            }
        }
    };

    const startUndoTimeout = () => {
        if (undoTimeout) clearTimeout(undoTimeout);
        const timeout = setTimeout(() => {
            setUndoBuffer([]);
            setUndoTimeout(null);
        }, 5000);
        setUndoTimeout(timeout);
    };

    // Calculate stats
    const totalValue = products.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
    );
    const lowStockCount = products.filter(
        (product) => product.stock < 5 && product.stock > 0
    ).length;
    const outOfStockCount = products.filter(
        (product) => product.stock === 0
    ).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                        <div className="space-y-1 lg:space-y-2">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Product Dashboard
                            </h1>
                            <p className="text-sm lg:text-base text-muted-foreground">
                                Manage your inventory with style and efficiency
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-white shadow-lg">
                                <div className="flex items-center gap-1 lg:gap-2">
                                    <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                    <div>
                                        <p className="text-xs opacity-90">Total Products</p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                            {products.length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-white shadow-lg">
                                <div className="flex items-center gap-1 lg:gap-2">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                    <div>
                                        <p className="text-xs opacity-90">Total Value</p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                            ${totalValue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-white shadow-lg">
                                <div className="flex items-center gap-1 lg:gap-2">
                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                    <div>
                                        <p className="text-xs opacity-90">Low Stock</p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                            {lowStockCount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-white shadow-lg">
                                <div className="flex items-center gap-1 lg:gap-2">
                                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                    <div>
                                        <p className="text-xs opacity-90">Out of Stock</p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                                            {outOfStockCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-sm lg:text-base">
                                        <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                                        <span className="hidden sm:inline">Add Product</span>
                                        <span className="sm:hidden">Add</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            Add New Product
                                        </DialogTitle>
                                    </DialogHeader>
                                    <ProductForm onSubmit={handleAddProduct} />
                                </DialogContent>
                            </Dialog>

                            {selectedProducts.size > 0 && (
                                <Button
                                    variant="destructive"
                                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-sm lg:text-base"
                                    onClick={async () => await handleBulkDelete()} // Ensure async handling
                                >
                                    <Trash2 className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                                    <span className="hidden sm:inline">Delete Selected</span>
                                    <span className="sm:hidden">Delete</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filter Results Summary */}
                    <div className="mt-4 lg:mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-muted-foreground">
                                Showing{" "}
                                <span className="font-semibold text-foreground">
                                    {filteredProducts.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-foreground">
                                    {products.length}
                                </span>{" "}
                                products
                            </p>
                            {filteredProducts.length !== products.length && (
                                <div className="h-1 w-1 bg-muted-foreground rounded-full"></div>
                            )}
                            {undoBuffer.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={undoDelete}
                                    className="ml-2 text-sm"
                                >
                                    Undo Last Delete
                                </Button>
                            )}
                        </div>
                        {/* Toggle Filters Button for Mobile */}
                        <Button
                            variant="outline"
                            className="lg:hidden"
                            onClick={() => setIsFiltersOpen(true)}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8 h-full">
                    {/* Sidebar with filters - hidden on mobile, visible on lg+ */}
                    <div className="lg:w-80 w-full lg:block hidden">
                        <SearchFilters
                            filters={filters}
                            onFiltersChange={updateFilters}
                            onClearFilters={clearFilters}
                        />
                    </div>

                    {/* Main content with scrollable ProductGrid */}
                    <div className="flex-1 overflow-y-auto">
                        <ProductGrid
                            products={filteredProducts}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            loading={loading}
                            selectedProducts={selectedProducts}
                            onToggleSelection={toggleProductSelection}
                        />
                    </div>
                </div>
            </div>

            {/* Edit Product Dialog */}
            <Dialog
                open={!!editingProduct}
                onOpenChange={() => setEditingProduct(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Edit Product
                        </DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                        <ProductForm
                            initialData={editingProduct}
                            onSubmit={handleEditProduct}
                            isEditing
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-red-600">
                            Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            {selectedProducts.size > 0
                                ? `Are you sure you want to delete ${selectedProducts.size} selected product(s)?`
                                : "Are you sure you want to delete this product? This action cannot be undone."}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDelete} className="mr-2">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={
                                selectedProducts.size > 0 ? handleBulkDelete : confirmDelete
                            }
                        >
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Filters Dialog for Mobile */}
            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogContent className="max-w-md">
                    <div className="py-4">
                        <SearchFilters
                            filters={filters}
                            onFiltersChange={updateFilters}
                            onClearFilters={clearFilters}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductDashboard;
