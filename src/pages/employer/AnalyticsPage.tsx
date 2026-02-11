import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
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
  Legend
} from 'recharts';
import { getEmployerAnalytics, EmployerAnalytics } from '../../lib/api';

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<EmployerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getEmployerAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <DashboardLayout role="employer"><div className="p-8 text-center text-slate-500">Loading analytics...</div></DashboardLayout>;

  const metrics = [
    {
      title: 'Active Jobs',
      value: analytics?.active_jobs.toString() || '0',
      trend: 0,
      icon: <Briefcase className="h-6 w-6" />,
      color: 'primary' as const
    },
    {
      title: 'Total Applicants',
      value: analytics?.total_applicants.toString() || '0',
      trend: 15,
      icon: <Users className="h-6 w-6" />,
      color: 'success' as const
    },
    {
      title: 'Interviews Scheduled',
      value: analytics?.interviews.toString() || '0',
      trend: 33,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'accent' as const
    },
    {
      title: 'Total Job Views',
      value: analytics?.job_views ? (analytics.job_views > 1000 ? `${(analytics.job_views / 1000).toFixed(1)}k` : analytics.job_views.toString()) : '0',
      trend: 8,
      icon: <Eye className="h-6 w-6" />,
      color: 'blue' as const
    }
  ];

  // Dummy data for visuals not yet supported by backend
  const hiringFunnelData = [
    { stage: 'Applied', count: analytics?.total_applicants || 0, color: '#6366f1' },
    { stage: 'Interview', count: analytics?.interviews || 0, color: '#a855f7' },
    { stage: 'Hired', count: Math.round((analytics?.interviews || 0) * 0.2), color: '#10b981' }
  ];

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

        {/* application trends */}
        {analytics?.application_trends && (
          <MarketChart
            title="Application Trends"
            subtitle="Number of applications received over the last 7 days"
            data={analytics.application_trends}
            type="line" />
        )}

        {/* Hiring Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Hiring Funnel (Mocked from aggregate totals)
          </h3>
          <div className="space-y-4">
            {hiringFunnelData.map((stage, index) => {
              const baseCount = hiringFunnelData[0].count || 1;
              const percentage = Math.max(5, (stage.count / baseCount) * 100);
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}