import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area } from
'recharts';
interface MarketChartProps {
  data: any[];
  type?: 'line' | 'area';
  title: string;
  subtitle?: string;
}
export function MarketChart({
  data,
  type = 'area',
  title,
  subtitle
}: MarketChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ?
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              bottom: 5,
              left: 0
            }}>

              <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0" />

              <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#64748b',
                fontSize: 12
              }}
              dy={10} />

              <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#64748b',
                fontSize: 12
              }} />

              <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} />

              <Line
              type="monotone"
              dataKey="value"
              stroke="#0d9488"
              strokeWidth={3}
              dot={{
                fill: '#0d9488',
                strokeWidth: 2,
                r: 4,
                stroke: '#fff'
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0
              }} />

            </LineChart> :

          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              bottom: 5,
              left: 0
            }}>

              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0" />

              <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#64748b',
                fontSize: 12
              }}
              dy={10} />

              <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#64748b',
                fontSize: 12
              }} />

              <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} />

              <Area
              type="monotone"
              dataKey="value"
              stroke="#0d9488"
              fillOpacity={1}
              fill="url(#colorValue)" />

            </AreaChart>
          }
        </ResponsiveContainer>
      </div>
    </div>);

}