import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import { MarketChart } from '../../components/analytics/MarketChart';
import {
  Users,
  Clock,
  Target,
  TrendingUp,
  Briefcase,
  CheckCircle,
  Eye,
  BarChart2,
  PieChart,
  ArrowRight } from
'lucide-react';
import { Button } from '../../components/common/Button';
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
  Legend } from
'recharts';
const hiringFunnelData = [
{
  stage: 'Applied',
  count: 450,
  color: '#6366f1'
},
{
  stage: 'Screened',
  count: 280,
  color: '#8b5cf6'
},
{
  stage: 'Interview',
  count: 85,
  color: '#a855f7'
},
{
  stage: 'Offer',
  count: 24,
  color: '#d946ef'
},
{
  stage: 'Hired',
  count: 18,
  color: '#10b981'
}];

const timeToHireData = [
{
  name: 'Jan',
  value: 28
},
{
  name: 'Feb',
  value: 25
},
{
  name: 'Mar',
  value: 22
},
{
  name: 'Apr',
  value: 24
},
{
  name: 'May',
  value: 20
},
{
  name: 'Jun',
  value: 18
}];

const sourceData = [
{
  name: 'Direct Apply',
  value: 45,
  color: '#6366f1'
},
{
  name: 'LinkedIn',
  value: 25,
  color: '#0077b5'
},
{
  name: 'Referral',
  value: 15,
  color: '#10b981'
},
{
  name: 'Job Boards',
  value: 10,
  color: '#f59e0b'
},
{
  name: 'Other',
  value: 5,
  color: '#94a3b8'
}];

const departmentData = [
{
  department: 'Engineering',
  openings: 8,
  filled: 5,
  applicants: 234
},
{
  department: 'Product',
  openings: 3,
  filled: 2,
  applicants: 89
},
{
  department: 'Design',
  openings: 2,
  filled: 1,
  applicants: 67
},
{
  department: 'Marketing',
  openings: 4,
  filled: 3,
  applicants: 112
},
{
  department: 'Sales',
  openings: 5,
  filled: 4,
  applicants: 156
}];

export function AnalyticsPage() {
  const metrics = [
  {
    title: 'Time to Hire',
    value: '18 days',
    trend: -15,
    icon: <Clock className="h-6 w-6" />,
    color: 'primary' as const,
    trendLabel: 'faster than last month'
  },
  {
    title: 'Offer Acceptance',
    value: '75%',
    trend: 8,
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'success' as const
  },
  {
    title: 'Cost per Hire',
    value: '$2,450',
    trend: -12,
    icon: <Target className="h-6 w-6" />,
    color: 'accent' as const
  },
  {
    title: 'Quality of Hire',
    value: '4.2/5',
    trend: 5,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'blue' as const
  }];

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Recruitment Analytics
            </h1>
            <p className="text-slate-500">
              Track your hiring performance and optimize your process
            </p>
          </div>
          <Button
            variant="outline"
            leftIcon={<BarChart2 className="h-4 w-4" />}>

            Export Report
          </Button>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hiring Funnel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Hiring Funnel
            </h3>
            <div className="space-y-4">
              {hiringFunnelData.map((stage, index) => {
                const percentage =
                stage.count / hiringFunnelData[0].count * 100;
                return (
                  <div key={stage.stage}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{stage.stage}</span>
                      <span className="font-medium text-slate-900">
                        {stage.count}
                      </span>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: stage.color
                        }} />

                      {index < hiringFunnelData.length - 1 &&
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                          {Math.round(
                          hiringFunnelData[index + 1].count / stage.count *
                          100
                        )}
                          % →
                        </div>
                      }
                    </div>
                  </div>);

              })}
            </div>
          </div>

          {/* Source Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Application Sources
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value">

                    {sourceData.map((entry, index) =>
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

        {/* Time to Hire Trend */}
        <MarketChart
          title="Time to Hire Trend"
          subtitle="Average days from job posting to offer acceptance"
          data={timeToHireData}
          type="area" />


        {/* Department Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Hiring by Department
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">
                    Department
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase">
                    Open Positions
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase">
                    Filled
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase">
                    Total Applicants
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase">
                    Fill Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentData.map((dept) =>
                <tr key={dept.department} className="hover:bg-slate-50">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {dept.department}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-600">
                      {dept.openings}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-600">
                      {dept.filled}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-600">
                      {dept.applicants}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                      className={`font-medium ${dept.filled / dept.openings >= 0.8 ? 'text-success-600' : dept.filled / dept.openings >= 0.5 ? 'text-amber-600' : 'text-red-600'}`}>

                        {Math.round(dept.filled / dept.openings * 100)}%
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}