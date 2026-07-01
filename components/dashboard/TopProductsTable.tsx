import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TrendingUp, ArrowRight, Loader2, Eye } from 'lucide-react';
import { useGetDashboardStatsQuery } from '@/store/services/dashboardApi';
import Link from 'next/link';

export const TopProductsTable = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const topProducts = data?.data?.topViewedProducts || [];

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Top Viewed Products</h3>
        <Link href="/products">
          <button className="text-xs text-primary hover:underline flex items-center gap-1 group">
            Manage products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-primary w-6 h-6" />
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-10 text-text-muted text-sm">
              No top viewed products found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">Clicks</th>
                  <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-border overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-bold">AB</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary line-clamp-1">{product.name}</p>
                          <p className="text-xs text-text-muted">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-sm font-medium text-text-primary">
                        <Eye size={14} className="text-text-muted" />
                        {product.totalClicks}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={product.growthPercent >= 0 ? 'success' : 'danger'} className="gap-1">
                        <TrendingUp size={10} />
                        {product.growthPercent}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
