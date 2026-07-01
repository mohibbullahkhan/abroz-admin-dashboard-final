'use client';

import React from 'react';
import { 
  AreaChart as ReAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardHeader, CardBody } from '../ui/Card';

interface AreaChartProps {
  title: string;
  data: any[];
  categories: { key: string; color: string; name: string }[];
  height?: number;
}

export const AreaChart = ({ title, data, categories, height = 300 }: AreaChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-bold text-lg">{title}</h3>
      </CardHeader>
      <CardBody>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ReAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {categories.map((cat) => (
                  <linearGradient key={cat.key} id={`gradient-${cat.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cat.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={cat.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2A" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1C1C1C', 
                  borderColor: '#2A2A2A', 
                  borderRadius: '12px',
                  color: '#FAFAFA' 
                }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }}
              />
              {categories.map((cat) => (
                <Area
                  key={cat.key}
                  name={cat.name}
                  type="monotone"
                  dataKey={cat.key}
                  stroke={cat.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#gradient-${cat.key})`}
                  animationDuration={1000}
                />
              ))}
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
