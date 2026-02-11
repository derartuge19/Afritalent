import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { MetricsCard } from '../components/analytics/MetricsCard';
import { MarketChart } from '../components/analytics/MarketChart';
import { Users, FileText, CheckCircle, Eye } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import { getEmployerAnalytics, EmployerAnalytics } from '../lib/api';

export function EmployerDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = React.useState<EmployerAnalytics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getEmployerAnalytics();
        setAnalytics(data);
      } catch (err: any) {
        console.error('Failed to fetch employer analytics:', err);
        setError('Failed to load dashboard data. Please make sure you are logged in as an employer.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="employer">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analytics) {
    return (
      <DashboardLayout role="employer">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative mb-6">
          <p>{error || 'Something went wrong.'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const metrics = [
    {
      title: 'Active Jobs',
      value: analytics.active_jobs.toString(),
      trend: 0,
      icon: <FileText className="h-6 w-6" />,
      color: 'blue' as const
    },
    {
      title: 'Total Applicants',
      value: analytics.total_applicants.toString(),
      trend: 15,
      icon: <Users className="h-6 w-6" />,
      color: 'primary' as const
    },
    {
      title: 'Interviews',
      value: analytics.interviews.toString(),
      trend: 33,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'accent' as const
    },
    {
      title: 'Job Views',
      value: analytics.job_views > 1000 ? `${(analytics.job_views / 1000).toFixed(1)}k` : analytics.job_views.toString(),
      trend: 8,
      icon: <Eye className="h-6 w-6" />,
      color: 'purple' as const
    }];

  const applicationData = analytics.application_trends;
  const recentApplicants = analytics.recent_applicants;

  return (
    <DashboardLayout role="employer">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4 animate-slide-in">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div>
          <Button
            onClick={() => navigate('/employer/post-job')}
            className="w-full md:w-auto shadow-lg shadow-primary-500/20 px-8 rounded-xl h-12 text-lg font-bold"
          >
            Post New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10 animate-slide-in" style={{ animationDelay: '0.1s' }}>
        {metrics.map((metric) =>
          <div key={metric.title} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <MetricsCard {...metric} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-10 animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <MarketChart
            title="Application Trends"
            subtitle="Hiring activity over the last 7 days"
            data={applicationData}
            type="line" />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Recent Applicants
          </h3>
          <div className="space-y-5 flex-1">
            {recentApplicants.map((applicant, idx) =>
              <div
                key={idx}
                className="flex items-center justify-between border-b border-slate-100/50 pb-4 last:border-0 last:pb-0 hover:bg-slate-50/50 px-2 -mx-2 rounded-xl transition-all cursor-pointer">

                <div>
                  <p className="font-bold text-slate-900">{applicant.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{applicant.role}</p>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="mb-1 rounded-full px-3 py-0.5 text-[10px] font-bold">
                    {applicant.match} Match
                  </Badge>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{applicant.date}</p>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-6 text-primary-600 font-bold hover:bg-primary-50 rounded-xl"
            size="sm"
            onClick={() => navigate('/employer/candidates')}
          >
            View All Candidates
          </Button>
        </div>
      </div>
    </DashboardLayout>);

}