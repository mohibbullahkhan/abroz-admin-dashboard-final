'use client';

import React from 'react';
import { 
  Calendar, 
  Download, 
  Eye, 
  MousePointer2, 
  MessageSquare, 
  Send,
  Layers
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { mockAnalytics, mockProducts } from '@/lib/data/mockData';

export default function AnalyticsPage() {
  const sparklineData = Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 100) }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Deep Insights & Analytics" 
        subtitle="Detailed breakdown of user interactions and product performance."
      >
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-border rounded-lg">
          <Button variant="ghost" size="sm" className="text-xs h-8">Today</Button>
          <Button variant="ghost" size="sm" className="text-xs h-8">7 Days</Button>
          <Button variant="primary" size="sm" className="text-xs h-8">30 Days</Button>
          <Button variant="ghost" size="sm" className="text-xs h-8">90 Days</Button>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <Button variant="ghost" size="sm" className="text-xs h-8 gap-2">
            <Calendar size={14} /> Custom
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} /> Export Data
        </Button>
      </PageHeader>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Product Opens" 
          value="12.8K" 
          change={8} 
          icon={Layers} 
        />
        <StatsCard 
          title="WhatsApp" 
          value="2.4K" 
          change={21} 
          icon={MessageSquare} 
        />
        <StatsCard 
          title="Messenger" 
          value="1.9K" 
          change={12} 
          icon={Send} 
        />
        <StatsCard 
          title="Category Clicks" 
          value="8.2K" 
          change={-4} 
          icon={MousePointer2} 
        />
      </div>

      {/* Main Charts */}
      <div className="space-y-6">
        <AreaChart 
          title="Traffic & Engagement Overview" 
          data={mockAnalytics.dailyTraffic}
          categories={[
            { key: 'clicks', color: '#10B981', name: 'Engagement (Clicks)' }
          ]}
          height={400}
        />

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <BarChart 
            title="Top 10 Products by Clicks" 
            data={mockProducts.slice(0, 10).sort((a,b) => b.clicks - a.clicks)}
            dataKey="clicks"
            nameKey="name"
            color="#10B981"
            height={400}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PieChart 
            title="Inquiry Method Distribution" 
            data={mockAnalytics.inquiriesByChannel}
          />
          <div className="lg:col-span-2">
            <BarChart 
              title="Category Performance (Total Clicks)" 
              data={mockAnalytics.topCategories}
              dataKey="views"
              nameKey="name"
              color="#F59E0B"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
