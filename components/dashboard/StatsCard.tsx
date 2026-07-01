'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';
import { cn } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  color?: string;
}

export const StatsCard = ({ title, value, change, icon: Icon, color = "#F59E0B" }: StatsCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card hoverable className="relative overflow-hidden group">
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            <Icon size={24} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            isPositive ? "text-success bg-success/10" : "text-danger bg-danger/10"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{change}%
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
        </div>

      </CardBody>
    </Card>
  );
};
