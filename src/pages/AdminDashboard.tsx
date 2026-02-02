import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { MetricsCard } from '../components/analytics/MetricsCard';
import { MarketChart } from '../components/analytics/MarketChart';
import { Users, Briefcase, Globe, Activity } from 'lucide-react';
export function AdminDashboard() {
  const metrics = [
  {
    title: 'Total Users',
    value: '15,234',
    trend: 12,
    icon: <Users className="h-6 w-6" />,
    color: 'blue' as const
  },
  {
    title: 'Active Jobs',
    value: '3,450',
    trend: 8,
    icon: <Briefcase className="h-6 w-6" />,
    color: 'teal' as const
  },
  {
    title: 'Countries',
    value: '18',
    trend: 0,
    icon: <Globe className="h-6 w-6" />,
    color: 'purple' as const
  },
  {
    title: 'Platform Traffic',
    value: '125k',
    trend: 24,
    icon: <Activity className="h-6 w-6" />,
    color: 'amber' as const
  }];

  const growthData = [
  {
    name: 'Jan',
    value: 5000
  },
  {
    name: 'Feb',
    value: 7500
  },
  {
    name: 'Mar',
    value: 10000
  },
  {
    name: 'Apr',
    value: 12500
  },
  {
    name: 'May',
    value: 14000
  },
  {
    name: 'Jun',
    value: 15234
  }];

  const marketData = [
  {
    name: 'Tech',
    value: 45
  },
  {
    name: 'Finance',
    value: 25
  },
  {
    name: 'Health',
    value: 15
  },
  {
    name: 'Edu',
    value: 10
  },
  {
    name: 'Agri',
    value: 5
  }];

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">
          Monitor platform performance and market trends.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) =>
        <MetricsCard key={metric.title} {...metric} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <MarketChart
          title="User Growth"
          subtitle="Total registered users over time"
          data={growthData}
          type="area" />

        <MarketChart
          title="Jobs by Industry"
          subtitle="Distribution of active job postings"
          data={marketData}
          type="line" // Using line for simplicity, but bar would be better if I had a BarChart component
        />
      </div>
    </DashboardLayout>);

}