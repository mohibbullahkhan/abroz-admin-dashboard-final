'use client';

import React from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Search,
  ArrowUpRight,
  Loader2,
  Eye
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useGetDashboardStatsQuery } from '@/store/services/dashboardApi';

export default function ReportsPage() {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data;
  const topProducts = stats?.topViewedProducts || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Business Reports" 
        subtitle="Export performance data and generated insights for business review."
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} /> Export CSV
        </Button>
        <Button variant="primary" size="sm" className="gap-2">
          <Download size={14} /> Export PDF
        </Button>
      </PageHeader>

      {/* Summary Row — real data from /stats/dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardBody className="p-6">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Total Products</p>
            <h3 className="text-3xl font-bold mt-1">
              {isLoading ? '—' : stats?.products?.total ?? 0}
            </h3>
            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-success" />
              {stats?.products?.todayCount ?? 0} added today
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Categories</p>
            <h3 className="text-3xl font-bold mt-1">
              {isLoading ? '—' : stats?.categories?.total ?? 0}
            </h3>
            <p className="text-xs text-text-muted mt-2">
              {stats?.categories?.todayCount ?? 0} added today
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">WhatsApp Clicks</p>
            <h3 className="text-3xl font-bold mt-1">
              {isLoading ? '—' : stats?.whatsappClicks?.total ?? 0}
            </h3>
            <p className="text-xs text-text-muted mt-2">
              {stats?.whatsappClicks?.todayCount ?? 0} today
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Messenger Clicks</p>
            <h3 className="text-3xl font-bold mt-1">
              {isLoading ? '—' : stats?.messengerClicks?.total ?? 0}
            </h3>
            <p className="text-xs text-text-muted mt-2">
              {stats?.messengerClicks?.todayCount ?? 0} today
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Top Products Report Table — real data */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-lg">Top Viewed Products Report</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input 
                placeholder="Search report..." 
                className="w-64 h-9 text-xs"
                icon={<Search size={14} />}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Filter size={14} /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="animate-spin text-primary w-7 h-7" />
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <FileText size={36} className="mb-3 opacity-30" />
              <p className="text-sm">No product performance data yet.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">#</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Product Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">Total Clicks</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topProducts.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm text-text-muted font-mono">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-border overflow-hidden shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-text-muted">AB</div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-text-primary">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral" className="text-[10px]">{p.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm font-medium text-text-primary">
                        <Eye size={13} className="text-text-muted" />
                        {p.totalClicks.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-bold",
                        p.growthPercent >= 0 ? "text-success" : "text-danger"
                      )}>
                        {p.growthPercent >= 0 ? '+' : ''}{p.growthPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
        {!isLoading && topProducts.length > 0 && (
          <div className="p-6 border-t border-border flex items-center justify-between">
            <p className="text-sm text-text-muted">Showing top {topProducts.length} products by clicks</p>
          </div>
        )}
      </Card>
    </div>
  );
}
