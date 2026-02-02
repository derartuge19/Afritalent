import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
interface MetricsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'accent' | 'blue' | 'purple' | 'success';
}
export function MetricsCard({
  title,
  value,
  trend,
  trendLabel = 'vs last month',
  icon,
  color = 'primary'
}: MetricsCardProps) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    success: 'bg-success-50 text-success-600'
  };
  // Map old color names to new ones for backwards compatibility
  const colorMap: Record<string, keyof typeof colors> = {
    teal: 'primary',
    amber: 'accent'
  };
  const resolvedColor = colorMap[color] || color;
  const isPositive = trend && trend > 0;
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">
        <div className={cn('rounded-lg p-3', colors[resolvedColor])}>
          {icon}
        </div>
        {trend !== undefined &&
        <div
          className={cn(
            'flex items-center text-sm font-medium',
            isPositive ? 'text-success-600' : 'text-red-600'
          )}>

            {isPositive ?
          <ArrowUpRight className="mr-1 h-4 w-4" /> :

          <ArrowDownRight className="mr-1 h-4 w-4" />
          }
            {Math.abs(trend)}%
          </div>
        }
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        {trendLabel &&
        <p className="mt-1 text-xs text-slate-400">{trendLabel}</p>
        }
      </div>
    </motion.div>);

}