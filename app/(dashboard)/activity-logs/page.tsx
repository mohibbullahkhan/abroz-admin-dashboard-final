'use client';

import React from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Download,
  Plus,
  RefreshCw,
  Trash2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDate } from '@/lib/utils';
import { useGetDashboardStatsQuery } from '@/store/services/dashboardApi';

export default function ActivityLogsPage() {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const activities = data?.data?.activitiesLast7Days || [];

  // Map backend activity method (create/update/delete) → UI style
  const getLogStyle = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'create': return { icon: Plus, color: 'text-success bg-success/10 border-success/20', badge: 'success' as const, label: 'Created' };
      case 'update': return { icon: RefreshCw, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', badge: 'neutral' as const, label: 'Updated' };
      case 'delete': return { icon: Trash2, color: 'text-danger bg-danger/10 border-danger/20', badge: 'danger' as const, label: 'Deleted' };
      default: return { icon: Shield, color: 'text-text-muted bg-white/5 border-border', badge: 'neutral' as const, label: method || 'Action' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Activity Logs" 
        subtitle="Full audit trail of all administrative actions performed in the dashboard."
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} /> Export Logs
        </Button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center bg-card p-4 border border-border rounded-xl">
        <div className="md:col-span-2">
          <Input 
            placeholder="Search logs by action or admin..." 
            icon={<Search size={16} />}
            className="bg-transparent"
          />
        </div>
        <div className="lg:col-span-1">
          <Button variant="outline" className="w-full justify-between gap-2 h-10">
            <span className="flex items-center gap-2"><Filter size={14} /> Action Type</span>
            <Badge variant="neutral" className="h-5">All</Badge>
          </Button>
        </div>
        <div className="lg:col-span-1">
          <Button variant="outline" className="w-full justify-between gap-2 h-10">
            <span className="flex items-center gap-2"><Clock size={14} /> Date Range</span>
          </Button>
        </div>
        <div className="lg:col-span-2 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" className="text-xs text-text-muted hover:text-primary">
            Clear Filters
          </Button>
          <Button variant="secondary" size="sm" className="h-10 px-6">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <Shield size={40} className="mb-4 opacity-30" />
              <p className="text-sm font-medium">No activity logs found for the last 7 days.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Action Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activities.map((log) => {
                  const style = getLogStyle(log.method);
                  return (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-text-primary">{formatDate(log.createdAt)}</span>
                          <span className="text-[10px] text-text-muted">{new Date(log.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={style.badge} className="gap-1.5 px-2.5 py-1">
                          <style.icon size={12} />
                          {style.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{log.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">SA</div>
                          <span className="text-sm text-text-primary">Super Admin</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Pagination note */}
      {!isLoading && activities.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing {activities.length} activities from the last 7 days
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="w-9 h-9" disabled>
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="primary" className="w-9 h-9 p-0">1</Button>
            </div>
            <Button variant="outline" size="icon" className="w-9 h-9" disabled>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
