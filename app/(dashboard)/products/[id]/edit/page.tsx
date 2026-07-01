"use client";

import React, { use } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductForm } from '@/components/products/ProductForm';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGetProductQuery } from '@/store/services/productsApi';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useGetProductQuery(id);

  const product = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-danger">
        Product not found or failed to load.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon" className="rounded-full border border-border">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <PageHeader 
            title="Edit Product" 
            subtitle={`Updating: ${product.name} (${product.partNumber})`}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <ExternalLink size={14} /> View on App
        </Button>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
