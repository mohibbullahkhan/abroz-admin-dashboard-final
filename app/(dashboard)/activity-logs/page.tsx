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
  Shield
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockRecentActivity } from '@/lib/data/mockData';
import { cn, formatDate } from '@/lib/utils';

export default function ActivityLogsPage() {
  const getLogStyle = (type: string) => {
    switch (type) {
      case 'product_added': return { icon: Plus, color: 'text-success bg-success/10 border-success/20', badge: 'success' };
      case 'notification_sent': return { icon: Bell, color: 'text-primary bg-primary/10 border-primary/20', badge: 'amber' };
      case 'product_updated': return { icon: RefreshCw, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', badge: 'neutral' };
      case 'product_deleted': return { icon: Trash2, color: 'text-danger bg-danger/10 border-danger/20', badge: 'danger' };
      case 'settings_updated': return { icon: Settings, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', badge: 'neutral' };
      default: return { icon: Shield, color: 'text-text-muted bg-white/5 border-border', badge: 'neutral' };
    }
  };

  // Duplicate mock activity to fill the table
  const allLogs = [...mockRecentActivity, ...mockRecentActivity, ...mockRecentActivity, ...mockRecentActivity].map((log, i) => ({
    ...log,
    id: `log-${i}`,
    ip: `192.168.1.${Math.floor(Math.random() * 254)}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString()
  }));

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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Action Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Admin User</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allLogs.map((log) => {
                const style = getLogStyle(log.type);
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">{formatDate(log.timestamp)}</span>
                        <span className="text-[10px] text-text-muted">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={style.badge as any} className="gap-1.5 px-2.5 py-1">
                        <style.icon size={12} />
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{log.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">SA</div>
                        <span className="text-sm text-text-primary">{log.admin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <code className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-border text-text-muted">{log.ip}</code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">Showing 20 of 124 logs</p>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="w-9 h-9" disabled>
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="primary" className="w-9 h-9 p-0">1</Button>
            <Button variant="ghost" className="w-9 h-9 p-0">2</Button>
            <Button variant="ghost" className="w-9 h-9 p-0">3</Button>
            <span className="px-2 text-text-muted">...</span>
            <Button variant="ghost" className="w-9 h-9 p-0">12</Button>
          </div>
          <Button variant="outline" size="icon" className="w-9 h-9">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
