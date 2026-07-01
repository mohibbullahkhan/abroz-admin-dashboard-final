'use client';

import React from 'react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardHeader, CardBody } from '../ui/Card';

interface BarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  color?: string;
  height?: number;
}

export const BarChart = ({ title, data, dataKey, nameKey, color = "#F59E0B", height = 300 }: BarChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-bold text-lg">{title}</h3>
      </CardHeader>
      <CardBody>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2A2A2A" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey={nameKey} 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#FAFAFA', fontSize: 11 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: '#1C1C1C', 
                  borderColor: '#2A2A2A', 
                  borderRadius: '12px',
                  color: '#FAFAFA' 
                }}
              />
              <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} animationDuration={1000}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={color} fillOpacity={1 - (index * 0.1)} />
                ))}
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
