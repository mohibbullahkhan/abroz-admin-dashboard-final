'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Filter,
  CheckCircle2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function MediaLibraryPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  // Generate mock images
  const mediaItems = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `machinery_part_${i + 1}.webp`,
    size: `${(Math.random() * 500 + 100).toFixed(1)} KB`,
    dimensions: '1200 x 800',
    url: `https://picsum.photos/400/300?random=${i + 50}`,
    category: i % 3 === 0 ? 'Product Images' : i % 3 === 1 ? 'Banners' : 'Thumbnails'
  }));

  const toggleSelect = (id: number) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(i => i !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Media Library" 
        subtitle="Manage all uploaded assets, product images, and app banners."
      >
        <div className="flex items-center bg-white/5 border border-border rounded-lg p-1 mr-2">
          <button 
            onClick={() => setView('grid')}
            className={`p-1.5 rounded ${view === 'grid' ? 'bg-primary text-black' : 'text-text-muted hover:text-white'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-1.5 rounded ${view === 'list' ? 'bg-primary text-black' : 'text-text-muted hover:text-white'}`}
          >
            <List size={16} />
          </button>
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Upload size={16} /> Upload New
        </Button>
      </PageHeader>

      {/* Upload Zone */}
      <div className="p-8 border-2 border-dashed border-border rounded-2xl bg-white/[0.02] hover:bg-primary/[0.02] hover:border-primary/50 transition-all text-center group cursor-pointer">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:scale-110 transition-all mx-auto mb-4">
          <Upload size={32} />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Click to upload or drag & drop</h3>
        <p className="text-sm text-text-muted mt-1">Accepts PNG, JPG, and WEBP (Max 10MB per file)</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border">
        <div className="flex items-center gap-4 flex-1">
          <Input 
            placeholder="Search assets by filename..." 
            icon={<Search size={16} />}
            className="max-w-xs"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4">All Assets</Button>
            <Button variant="ghost" size="sm" className="h-9 px-4 text-text-muted">Product Images</Button>
            <Button variant="ghost" size="sm" className="h-9 px-4 text-text-muted">Banners</Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted mr-2">Sort by:</span>
          <Button variant="ghost" size="sm" className="h-9 gap-2">
            Newest First <Filter size={14} />
          </Button>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {mediaItems.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "group relative flex flex-col gap-2 cursor-pointer transition-all",
              selectedImages.includes(item.id) && "scale-[0.98]"
            )}
            onClick={() => toggleSelect(item.id)}
          >
            <div className={cn(
              "relative aspect-square rounded-xl border-2 overflow-hidden transition-all",
              selectedImages.includes(item.id) ? "border-primary shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "border-border group-hover:border-primary/30"
            )}>
              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-colors",
                    selectedImages.includes(item.id) ? "bg-primary border-primary" : "bg-black/20"
                  )}>
                    {selectedImages.includes(item.id) && <CheckCircle2 size={12} className="text-black" />}
                  </div>
                  <button className="p-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-primary">
                    <MoreVertical size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="flex-1 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white hover:bg-primary hover:text-black transition-colors flex items-center justify-center gap-1">
                    <Copy size={10} /> URL
                  </button>
                  <button className="p-1.5 bg-danger/50 backdrop-blur-md rounded-lg text-white hover:bg-danger transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
            <div className="px-1">
              <p className="text-xs font-semibold text-text-primary truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] text-text-muted">{item.size}</span>
                <span className="text-[10px] text-text-muted">{item.dimensions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Items Bar */}
      {selectedImages.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8">
          <div className="flex items-center gap-4 px-6 py-3 bg-card border border-primary/30 rounded-full shadow-premium-dark glass">
            <span className="text-sm font-semibold text-primary">{selectedImages.length} files selected</span>
            <div className="h-4 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-white/10">Move to Folder</Button>
              <Button variant="danger" size="sm" className="h-8 text-xs px-4">Delete Selected</Button>
            </div>
            <button 
              onClick={() => setSelectedImages([])}
              className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
