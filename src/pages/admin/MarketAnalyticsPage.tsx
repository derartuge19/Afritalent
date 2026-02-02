import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import { MarketChart } from '../../components/analytics/MarketChart';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import {
  TrendingUp,
  Users,
  Briefcase,
  Globe,
  Download,
  Calendar,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area } from
'recharts';
import { motion } from 'framer-motion';
const userGrowthData = [
{
  month: 'Jul',
  seekers: 8500,
  employers: 1800
},
{
  month: 'Aug',
  seekers: 9200,
  employers: 1950
},
{
  month: 'Sep',
  seekers: 10100,
  employers: 2100
},
{
  month: 'Oct',
  seekers: 11200,
  employers: 2300
},
{
  month: 'Nov',
  seekers: 12800,
  employers: 2500
},
{
  month: 'Dec',
  seekers: 14100,
  employers: 2650
},
{
  month: 'Jan',
  seekers: 15234,
  employers: 2680
}];

const jobsByIndustry = [
{
  name: 'Technology',
  value: 45,
  color: '#6366f1'
},
{
  name: 'Finance',
  value: 20,
  color: '#10b981'
},
{
  name: 'Healthcare',
  value: 12,
  color: '#f59e0b'
},
{
  name: 'Education',
  value: 10,
  color: '#8b5cf6'
},
{
  name: 'Agriculture',
  value: 8,
  color: '#06b6d4'
},
{
  name: 'Other',
  value: 5,
  color: '#94a3b8'
}];

const jobsByCountry = [
{
  country: 'Ethiopia',
  jobs: 1250,
  seekers: 5400
},
{
  country: 'Kenya',
  jobs: 890,
  seekers: 4200
},
{
  country: 'Nigeria',
  jobs: 720,
  seekers: 3800
},
{
  country: 'South Africa',
  jobs: 450,
  seekers: 2100
},
{
  country: 'Ghana',
  jobs: 280,
  seekers: 1500
},
{
  country: 'Rwanda',
  jobs: 180,
  seekers: 890
}];

const hiringTrends = [
{
  month: 'Aug',
  applications: 12500,
  hires: 890
},
{
  month: 'Sep',
  applications: 14200,
  hires: 1020
},
{
  month: 'Oct',
  applications: 15800,
  hires: 1150
},
{
  month: 'Nov',
  applications: 18200,
  hires: 1280
},
{
  month: 'Dec',
  applications: 16500,
  hires: 1100
},
{
  month: 'Jan',
  applications: 19800,
  hires: 1420
}];

export function MarketAnalyticsPage() {
  const metrics = [
  {
    title: 'Total Users',
    value: '15,234',
    trend: 12,
    icon: <Users className="h-6 w-6" />,
    color: 'primary' as const
  },
  {
    title: 'Active Jobs',
    value: '3,450',
    trend: 8,
    icon: <Briefcase className="h-6 w-6" />,
    color: 'success' as const
  },
  {
    title: 'Avg. Match Rate',
    value: '78%',
    trend: 5,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'accent' as const
  },
  {
    title: 'Countries',
    value: '18',
    trend: 2,
    icon: <Globe className="h-6 w-6" />,
    color: 'blue' as const
  }];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Market Analytics
            </h1>
            <p className="text-slate-500">
              Platform performance and market insights
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              options={[
              {
                value: '7d',
                label: 'Last 7 days'
              },
              {
                value: '30d',
                label: 'Last 30 days'
              },
              {
                value: '90d',
                label: 'Last 90 days'
              },
              {
                value: '1y',
                label: 'Last year'
              }]
              }
              defaultValue="30d" />

            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}>

              Export
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
          )}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              User Growth
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />

                  <YAxis
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />

                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="seekers"
                    stackId="1"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                    name="Job Seekers" />

                  <Area
                    type="monotone"
                    dataKey="employers"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Employers" />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Jobs by Industry */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Jobs by Industry
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={jobsByIndustry}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value">

                    {jobsByIndustry.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hiring Trends */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Hiring Trends
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />

                  <YAxis
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />

                  <Tooltip />
                  <Bar
                    dataKey="applications"
                    fill="#6366f1"
                    name="Applications"
                    radius={[4, 4, 0, 0]} />

                  <Bar
                    dataKey="hires"
                    fill="#10b981"
                    name="Hires"
                    radius={[4, 4, 0, 0]} />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Jobs by Country */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Activity by Country
            </h3>
            <div className="space-y-4">
              {jobsByCountry.map((country, index) =>
              <motion.div
                key={country.country}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {country.country === 'Ethiopia' ?
                    '🇪🇹' :
                    country.country === 'Kenya' ?
                    '🇰🇪' :
                    country.country === 'Nigeria' ?
                    '🇳🇬' :
                    country.country === 'South Africa' ?
                    '🇿🇦' :
                    country.country === 'Ghana' ?
                    '🇬🇭' :
                    '🇷🇼'}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900">
                        {country.country}
                      </p>
                      <p className="text-xs text-slate-500">
                        {country.seekers.toLocaleString()} seekers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {country.jobs.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">active jobs</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}