'use client';

import React from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Search,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockProducts } from '@/lib/data/mockData';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
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

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardBody className="p-6">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Total Tracked</p>
            <h3 className="text-3xl font-bold mt-1">{mockProducts.length} Products</h3>
            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
              <ArrowUpRight size={12} className="text-success" />
              +5 added this week
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Best Category</p>
            <h3 className="text-2xl font-bold mt-1">Engine Parts</h3>
            <p className="text-xs text-text-muted mt-2">Highest engagement rate</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Highest CTR</p>
            <h3 className="text-2xl font-bold mt-1">CAT 320 Pump</h3>
            <p className="text-xs text-text-muted mt-2">12.4% conversion</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Inquiries</p>
            <h3 className="text-3xl font-bold mt-1">2,080</h3>
            <p className="text-xs text-text-muted mt-2">via WhatsApp & Messenger</p>
          </CardBody>
        </Card>
      </div>

      {/* Report Table */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-lg">Product Performance Report</h3>
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Product Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">Clicks</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">WA</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">MS</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">CTR%</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProducts.slice(0, 15).map((p) => {
                const ctr = p.clicks > 0 ? "10.0" : "0.0"; // Placeholder CTR without impressions
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{p.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral" className="text-[10px]">{p.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-text-muted">{p.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-text-muted">{p.whatsappClicks}</td>
                    <td className="px-6 py-4 text-sm text-right text-text-muted">{p.messengerClicks}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-bold",
                        Number(ctr) > 10 ? "text-success" : "text-text-muted"
                      )}>{ctr}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={p.status === 'Active' ? 'success' : 'neutral'}>{p.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <div className="p-6 border-t border-border flex items-center justify-between">
          <p className="text-sm text-text-muted">Showing 1 to 15 of {mockProducts.length} entries</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
