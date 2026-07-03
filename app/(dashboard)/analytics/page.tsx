'use client';

import React from 'react';
import { 
  Calendar, 
  Download, 
  Eye, 
  MousePointer2, 
  MessageSquare, 
  Send,
  Layers,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useGetDashboardStatsQuery } from '@/store/services/dashboardApi';

export default function AnalyticsPage() {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data;

  // Transform real API data for charts
  const trafficData = (stats?.productClicksLast30Days || []).map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    clicks: item.count,
  }));

  const channelData = [
    { name: 'WhatsApp', value: stats?.whatsappClicks?.total || 0, color: '#25D366' },
    { name: 'Messenger', value: stats?.messengerClicks?.total || 0, color: '#0084FF' },
  ];

  const topProductsChartData = (stats?.topViewedProducts || []).map((p) => ({
    name: p.name,
    clicks: p.totalClicks,
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

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

      {/* KPI Row — real data from /stats/dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Products" 
          value={stats?.products?.total ?? 0} 
          change={stats?.products?.growthPercent ?? 0} 
          icon={Layers} 
        />
        <StatsCard 
          title="WhatsApp Clicks" 
          value={stats?.whatsappClicks?.total ?? 0} 
          change={stats?.whatsappClicks?.growthPercent ?? 0} 
          icon={MessageSquare} 
        />
        <StatsCard 
          title="Messenger Clicks" 
          value={stats?.messengerClicks?.total ?? 0} 
          change={stats?.messengerClicks?.growthPercent ?? 0} 
          icon={Send} 
        />
        <StatsCard 
          title="Total Categories" 
          value={stats?.categories?.total ?? 0} 
          change={stats?.categories?.growthPercent ?? 0} 
          icon={MousePointer2} 
        />
      </div>

      {/* Main Charts — real data */}
      <div className="space-y-6">
        <AreaChart 
          title="Product Clicks (Last 30 Days)" 
          data={trafficData}
          categories={[
            { key: 'clicks', color: '#10B981', name: 'Total Clicks' }
          ]}
          height={400}
        />

        {topProductsChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <BarChart 
              title="Top 5 Products by Clicks" 
              data={topProductsChartData}
              dataKey="clicks"
              nameKey="name"
              color="#10B981"
              height={400}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PieChart 
            title="Inquiry Method Distribution" 
            data={channelData}
          />
          {topProductsChartData.length > 0 && (
            <div className="lg:col-span-2">
              <BarChart 
                title="Top Products Click Performance" 
                data={topProductsChartData}
                dataKey="clicks"
                nameKey="name"
                color="#F59E0B"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
