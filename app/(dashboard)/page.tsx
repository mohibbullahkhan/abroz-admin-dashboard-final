'use client';

import React from 'react';
import {
  Box,
  MessageSquare,
  Send,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TopProductsTable } from '@/components/dashboard/TopProductsTable';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('@/components/charts/AreaChart').then(mod => mod.AreaChart), { ssr: false });
const PieChart = dynamic(() => import('@/components/charts/PieChart').then(mod => mod.PieChart), { ssr: false });
import { Button } from '@/components/ui/Button';
import { useGetDashboardStatsQuery } from '@/store/services/dashboardApi';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();

  const stats = statsData?.data;

  // Transform productClicksLast30Days for the AreaChart
  const trafficData = (stats?.productClicksLast30Days || []).map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    clicks: item.count,
  }));

  // Transform for PieChart
  const channelData = [
    { name: 'WhatsApp', value: stats?.whatsappClicks?.total || 0, color: '#25D366' },
    { name: 'Messenger', value: stats?.messengerClicks?.total || 0, color: '#0084FF' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back, Super Admin. Here's what's happening with Abroz Parts+ today."
      >
        <Link href="/products">
          <Button variant="primary" size="lg" className="font-semibold shadow-sm hover:shadow-md transition-all">Manage Inventory</Button>
        </Link>
      </PageHeader>

      {/* Top Stats Row */}
      {statsLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats?.products?.total || 0}
            change={stats?.products?.growthPercent || 0}
            icon={Box}
          />
          <StatsCard
            title="Total Categories"
            value={stats?.categories?.total || 0}
            change={stats?.categories?.growthPercent || 0}
            icon={LayoutGrid}
          />
          <StatsCard
            title="WhatsApp Clicks"
            value={stats?.whatsappClicks?.total || 0}
            change={stats?.whatsappClicks?.growthPercent || 0}
            icon={MessageSquare}
          />
          <StatsCard
            title="Messenger Clicks"
            value={stats?.messengerClicks?.total || 0}
            change={stats?.messengerClicks?.growthPercent || 0}
            icon={Send}
          />
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AreaChart
            title="Product Clicks (Last 30 Days)"
            data={trafficData}
            categories={[
              { key: 'clicks', color: '#10B981', name: 'Total Clicks' }
            ]}
          />
        </div>
        <div>
          <PieChart
            title="Inquiries by Channel"
            data={channelData}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopProductsTable />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
