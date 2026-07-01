'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { alerts } from '@/lib/sweetalert';
import { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} from '@/store/services/categoriesApi';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const { data: response, isLoading, isFetching, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = response?.data || [];

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (await alerts.confirmDelete(name)) {
      try {
        await deleteCategory(id).unwrap();
        alerts.toastSuccess('Category deleted successfully');
      } catch (err: any) {
        alerts.error('Failed to delete category', err?.data?.message || err?.message);
      }
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditCategoryId(cat._id);
    setNewCatName(cat.name);
    setNewCatDesc(cat.description || '');
    setShowAddForm(true);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;

    try {
      if (editCategoryId) {
        await updateCategory({ 
          _id: editCategoryId, 
          name: newCatName.trim(), 
          description: newCatDesc.trim() 
        }).unwrap();
        alerts.toastSuccess('Category updated successfully');
      } else {
        await createCategory({ 
          name: newCatName.trim(), 
          description: newCatDesc.trim() 
        }).unwrap();
        alerts.toastSuccess('Category created successfully');
      }
      
      setNewCatName('');
      setNewCatDesc('');
      setEditCategoryId(null);
      setShowAddForm(false);
    } catch (err: any) {
      alerts.error(
        editCategoryId ? 'Failed to update category' : 'Failed to create category',
        err?.data?.message || err?.message
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Product Categories" 
        subtitle="Organize your machinery parts into distinct categories for easier browsing."
      >
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-text-muted hover:text-black hidden md:flex items-center gap-1.5 font-medium" 
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button 
            variant="primary" 
            className="gap-2 font-bold shadow-sm hover:shadow-md transition-all px-6" 
            onClick={() => { setEditCategoryId(null); setNewCatName(''); setNewCatDesc(''); setShowAddForm(true); }}
          >
            <Plus size={16} /> Add Category
          </Button>
        </div>
      </PageHeader>

      {showAddForm && (
        <div className="bg-white/5 rounded-xl border border-border p-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1.5">Category Name</label>
              <input 
                placeholder="e.g. Engine Filters" 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full h-10 text-sm rounded-lg bg-[#f0f0f0] border-none text-black px-4 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1.5">Category Description</label>
              <input 
                placeholder="Short description..." 
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full h-10 text-sm rounded-lg bg-[#f0f0f0] border-none text-black px-4 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setShowAddForm(false); setNewCatName(''); setNewCatDesc(''); setEditCategoryId(null); }} 
                className="text-text-primary hover:text-black hover:bg-black/5 font-semibold"
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleAddCategory} 
                className="px-6 font-bold shadow-sm flex items-center gap-2"
                disabled={!newCatName.trim() || isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && <Loader2 size={14} className="animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border border-border rounded-xl px-4 h-12 bg-white/5 mt-6">
        <div className="flex items-center gap-2 w-full max-w-sm text-text-muted">
          <Search size={16} />
          <input 
            placeholder="Search categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm w-full text-text-primary placeholder:text-text-muted"
          />
        </div>
        <div className="text-sm text-text-muted">
          Showing {filteredCategories.length} categories
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <Card key={cat._id} hoverable className="group overflow-hidden border-border/40 hover:border-border transition-all duration-300 shadow-sm bg-white">
              <CardBody className="p-6 h-full flex flex-col">
                <div className="flex justify-end gap-2 mb-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded text-text-muted hover:text-text-primary"
                    onClick={(e) => { e.stopPropagation(); handleEditClick(cat); }}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded text-text-muted hover:text-danger"
                    onClick={(e) => { e.stopPropagation(); handleDelete(cat._id, cat.name); }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-black leading-tight mb-2">{cat.name}</h3>
                  <p className="text-sm text-text-muted line-clamp-2">
                    {cat.description || 'No description available for this category.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center">
                  <Link href={`/products?category=${encodeURIComponent(cat.name)}`}>
                    <span className="text-xs text-text-primary font-bold hover:underline">
                      View Products
                    </span>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
