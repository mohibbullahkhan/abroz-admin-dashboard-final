'use client';

import React from 'react';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardHeader, CardBody } from '../ui/Card';

interface PieChartProps {
  title: string;
  data: any[];
  height?: number;
}

const COLORS = ['#F59E0B', '#D97706', '#B45309', '#92400E'];

export const PieChart = ({ title, data, height = 300 }: PieChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-bold text-lg">{title}</h3>
      </CardHeader>
      <CardBody>
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1C1C1C', 
                  borderColor: '#2A2A2A', 
                  borderRadius: '12px',
                  color: '#FAFAFA' 
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
