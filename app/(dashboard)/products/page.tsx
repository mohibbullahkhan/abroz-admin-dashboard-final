"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    ChevronDown,
    LayoutGrid,
    List,
    Trash2,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductTable } from "@/components/products/ProductTable";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useGetProductsQuery, useDeleteProductMutation } from "@/store/services/productsApi";
import { alerts } from "@/lib/sweetalert";
import { Category } from "@/types";

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [view, setView] = useState<"list" | "grid">("list");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== debouncedSearch) {
                setDebouncedSearch(search);
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search, debouncedSearch]);

    const { data: response, isLoading, isFetching, refetch } = useGetProductsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        category: category !== "All" ? category : undefined,
        status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
    });

    const [deleteProduct] = useDeleteProductMutation();

    const currentProducts = response?.data || [];
    const meta = response?.meta;
    const totalPages = meta?.totalPages || 0;
    const totalItems = meta?.total || 0;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get("category");
        if (cat) {
            setCategory(cat);
            setCurrentPage(1);
        }
    }, []);

    const handleClearFilters = () => {
        setSearch("");
        setCategory("All");
        setStatusFilter("All");
        setCurrentPage(1);
    };

    const handleDelete = async (id: string, name: string) => {
        if (await alerts.confirmDelete(name)) {
            try {
                await deleteProduct(id).unwrap();
                alerts.toastSuccess("Product deleted successfully");
            } catch (err: any) {
                alerts.error("Failed to delete product", err?.data?.message || err?.message);
            }
        }
    };

    // No longer need client-side filter array processing
    // Generate pagination array based on total pages
    const paginationRange = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="Inventory Management"
                subtitle={`Total of ${totalItems} products found in the database.`}
            >
                <div className="flex items-center gap-4 mr-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-text-muted hover:text-white hidden md:flex items-center gap-1.5 font-medium" 
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> Refresh
                    </Button>
                    <div className="flex items-center bg-white/5 border border-border rounded-lg p-1">
                        <button
                            onClick={() => setView("list")}
                            className={`p-1.5 rounded transition-colors ${view === "list" ? "bg-primary text-black shadow-sm" : "text-text-muted hover:text-white hover:bg-white/5"}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setView("grid")}
                            className={`p-1.5 rounded transition-colors ${view === "grid" ? "bg-primary text-black shadow-sm" : "text-text-muted hover:text-white hover:bg-white/5"}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                </div>

                <Link href="/products/add">
                    <Button
                        variant="primary"
                        size="lg"
                        className="flex items-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all"
                    >
                        <Plus size={18} /> Add Product
                    </Button>
                </Link>
            </PageHeader>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center bg-card p-4 border border-border rounded-xl">
                <div className="md:col-span-2">
                    <Input
                        placeholder="Search by name, Part Number..."
                        icon={<Search size={16} />}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="bg-transparent"
                    />
                </div>

                <div className="relative group">
                    <select
                        className="w-full appearance-none bg-white/5 border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option
                            value="All"
                            className="bg-[var(--background)] text-[var(--foreground)]"
                        >
                            All Categories
                        </option>
                        {CATEGORIES.map((cat) => (
                            <option
                                key={cat}
                                value={cat}
                                className="bg-[var(--background)] text-[var(--foreground)]"
                            >
                                {cat}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                </div>

                <div className="relative group">
                    <select 
                        className="w-full appearance-none bg-white/5 border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All" className="bg-[var(--background)] text-[var(--foreground)]">Status: All</option>
                        <option value="Active" className="bg-[var(--background)] text-[var(--foreground)]">Active</option>
                        <option value="Inactive" className="bg-[var(--background)] text-[var(--foreground)]">Inactive</option>
                        <option value="Draft" className="bg-[var(--background)] text-[var(--foreground)]">Draft</option>
                    </select>
                    <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    />
                </div>

                <div className="lg:col-span-2 flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-text-muted hover:text-primary"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-text-muted">Showing:</span>
                <Badge
                    variant="neutral"
                    className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary border-transparent px-3"
                >
                    {category}
                </Badge>
                {search && (
                    <Badge
                        variant="neutral"
                        className="text-[10px] uppercase tracking-wider"
                    >
                        Search: {search}
                    </Badge>
                )}
                {statusFilter !== "All" && (
                    <Badge
                        variant="neutral"
                        className="text-[10px] uppercase tracking-wider"
                    >
                        Status: {statusFilter}
                    </Badge>
                )}
                <span className="text-xs text-text-muted ml-auto font-medium">
                    {totalItems} Results
                </span>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            ) : currentProducts.length === 0 ? (
                <div className="text-center py-20 text-text-muted">
                    No products found matching your criteria.
                </div>
            ) : (
                <>
                    {/* Product List/Grid View */}
                    {view === "list" ? (
                        <ProductTable
                            products={currentProducts as any}
                            onDelete={(id) => handleDelete(id, "this product")}
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
                            {currentProducts.map((product) => {
                                let catName = "";
                                if (typeof product.categoryId === 'string') {
                                    catName = product.categoryId;
                                } else if (product.categoryId && (product.categoryId as Category).name) {
                                    catName = (product.categoryId as Category).name;
                                }
                                
                                return (
                                    <div
                                        key={product._id}
                                        className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-all flex flex-col"
                                    >
                                        <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                                            <img
                                                src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge
                                                    variant={
                                                        product.status === "active"
                                                            ? "success"
                                                            : "neutral"
                                                    }
                                                    className="shadow-lg backdrop-blur-md bg-black/50 border-white/10"
                                                >
                                                    {product.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="mb-3">
                                                <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">
                                                    {catName}
                                                </p>
                                                <h3 className="font-bold text-text-primary line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs text-text-muted mt-1 font-mono">
                                                    {product.partNumber}
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-border flex items-center justify-end">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/products/${product._id}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-3 text-xs bg-white/5 hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs bg-white/5 hover:bg-danger/10 hover:text-danger"
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex items-center justify-between pt-4">
                            <p className="text-sm text-text-muted">
                                Showing page {currentPage} of {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-8 h-8 rounded-md bg-white/5 border-border"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.max(1, prev - 1))
                                    }
                                >
                                    &lt;
                                </Button>
                                <div className="flex items-center gap-1">
                                    {paginationRange.map(
                                        (idx) => (
                                            <Button
                                                key={idx}
                                                variant={
                                                    currentPage === idx
                                                        ? "primary"
                                                        : "ghost"
                                                }
                                                size="icon"
                                                className={`w-8 h-8 text-sm rounded-md font-medium ${currentPage === idx ? "text-black bg-primary" : "text-text-primary hover:bg-white/10"}`}
                                                onClick={() => setCurrentPage(idx)}
                                            >
                                                {idx}
                                            </Button>
                                        ),
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-8 h-8 rounded-md bg-white/5 border-border"
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                >
                                    &gt;
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

