'use client';

import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Product, Category } from '@/types';
import { cn } from '@/lib/utils';
import { alerts } from '@/lib/sweetalert';
import Link from 'next/link';

interface ProductTableProps {
  products: Product[];
  onDelete?: (id: string) => void;
}

export const ProductTable = ({ products, onDelete }: ProductTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedRows.length === products.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(products.map(p => p._id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (await alerts.confirmDelete(`${selectedRows.length} selected products`)) {
      // For real integration, we'd fire a bulk delete mutation here
      alerts.toastSuccess(`Simulated bulk delete for ${selectedRows.length} products`);
      setSelectedRows([]);
    }
  };

  return (
    <div className="relative overflow-x-auto border border-border rounded-xl bg-card">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b border-border bg-white/[0.02]">
            <th className="px-6 py-4 w-12">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-border bg-white/5 accent-primary"
                checked={selectedRows.length === products.length && products.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Product</th>
            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-center">Category</th>
            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-center">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-center">Brand</th>
            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-center">QTY</th>
            <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((product) => {
            let catName = "";
            if (typeof product.categoryId === 'string') {
              catName = product.categoryId;
            } else if (product.categoryId && (product.categoryId as Category).name) {
              catName = (product.categoryId as Category).name;
            }

            return (
              <tr key={product._id} className={cn(
                "hover:bg-white/[0.02] transition-colors group",
                selectedRows.includes(product._id) && "bg-primary/[0.03]"
              )}>
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border bg-white/5 accent-primary"
                    checked={selectedRows.includes(product._id)}
                    onChange={() => toggleSelectRow(product._id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg bg-white/5 border border-dashed border-border overflow-hidden flex items-center justify-center shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="text-[10px] text-text-muted font-semibold text-center leading-tight">NO IMG</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{product.name}</p>
                      <p className="text-xs text-text-muted tracking-widest">{product.partNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-text-muted border border-border">
                    {catName}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge variant={product.status === 'active' ? 'success' : 'neutral'} className="text-xs px-3 lowercase font-medium">
                    {product.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <Badge variant="neutral" className="bg-white/5 text-[10px] font-bold tracking-widest uppercase px-3 border border-border">
                      {product.brandName}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-text-primary">{product.quantity}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/products/${product._id}/edit`}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-text-muted hover:text-text-primary">
                        <Pencil size={14} />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 rounded-full text-text-muted hover:text-danger"
                      onClick={() => onDelete && onDelete(product._id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Bulk Action Bar */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8">
          <div className="flex items-center gap-4 px-6 py-3 bg-card border border-primary/30 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.15)] amber-glow glass">
            <span className="text-sm font-semibold text-primary">{selectedRows.length} items selected</span>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-white/10">Set Featured</Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-white/10">Set Active</Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-white/10">Set Draft</Button>
              <Button variant="danger" size="sm" className="h-8 text-xs px-4" onClick={handleBulkDelete}>Delete Selected</Button>
            </div>
            <button 
              onClick={() => setSelectedRows([])}
              className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
