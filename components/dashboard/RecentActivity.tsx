'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { cn, formatDate } from '@/lib/utils';
import { Plus, Trash, RefreshCw, Loader2 } from 'lucide-react';
import { useGetDashboardStatsQuery } from '@/store/services/dashboardApi';

export const RecentActivity = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const activities = data?.data?.activitiesLast7Days || [];

  const getIcon = (method: string) => {
    switch (method) {
      case 'create': return { icon: Plus, color: 'text-success bg-success/10 border-success/20' };
      case 'update': return { icon: RefreshCw, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
      case 'delete': return { icon: Trash, color: 'text-danger bg-danger/10 border-danger/20' };
      default: return { icon: RefreshCw, color: 'text-text-muted bg-white/5 border-border' };
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Recent Activity</h3>
      </CardHeader>
      <CardBody className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-primary w-6 h-6" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 text-text-muted text-sm">
            No recent activity.
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
            {activities.map((activity) => {
              const { icon: Icon, color } = getIcon(activity.method);
              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center shrink-0", color)}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted">{formatDate(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
