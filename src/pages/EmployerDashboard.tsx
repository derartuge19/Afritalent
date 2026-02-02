import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { MetricsCard } from '../components/analytics/MetricsCard';
import { MarketChart } from '../components/analytics/MarketChart';
import { Users, FileText, CheckCircle, Eye } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
export function EmployerDashboard() {
  const metrics = [
  {
    title: 'Active Jobs',
    value: '5',
    trend: 0,
    icon: <FileText className="h-6 w-6" />,
    color: 'blue' as const
  },
  {
    title: 'Total Applicants',
    value: '142',
    trend: 15,
    icon: <Users className="h-6 w-6" />,
    color: 'teal' as const
  },
  {
    title: 'Interviews',
    value: '8',
    trend: 33,
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'amber' as const
  },
  {
    title: 'Job Views',
    value: '2.4k',
    trend: 8,
    icon: <Eye className="h-6 w-6" />,
    color: 'purple' as const
  }];

  const applicationData = [
  {
    name: 'Mon',
    value: 12
  },
  {
    name: 'Tue',
    value: 19
  },
  {
    name: 'Wed',
    value: 15
  },
  {
    name: 'Thu',
    value: 25
  },
  {
    name: 'Fri',
    value: 22
  },
  {
    name: 'Sat',
    value: 8
  },
  {
    name: 'Sun',
    value: 5
  }];

  const recentApplicants = [
  {
    name: 'Sarah K.',
    role: 'Senior Frontend Engineer',
    match: '95%',
    date: '2h ago'
  },
  {
    name: 'David M.',
    role: 'Product Manager',
    match: '88%',
    date: '4h ago'
  },
  {
    name: 'Amara O.',
    role: 'Data Scientist',
    match: '92%',
    date: '5h ago'
  },
  {
    name: 'John D.',
    role: 'Senior Frontend Engineer',
    match: '75%',
    date: '1d ago'
  }];

  return (
    <DashboardLayout role="employer">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Employer Dashboard
          </h1>
          <p className="text-slate-500">
            Manage your job postings and candidate pipeline.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>Post New Job</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) =>
        <MetricsCard key={metric.title} {...metric} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <MarketChart
            title="Application Trends"
            subtitle="Number of applications received over the last 7 days"
            data={applicationData}
            type="line" />

        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Applicants
          </h3>
          <div className="space-y-4">
            {recentApplicants.map((applicant, idx) =>
            <div
              key={idx}
              className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">

                <div>
                  <p className="font-medium text-slate-900">{applicant.name}</p>
                  <p className="text-xs text-slate-500">{applicant.role}</p>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="mb-1">
                    {applicant.match} Match
                  </Badge>
                  <p className="text-xs text-slate-400">{applicant.date}</p>
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">
            View All Candidates
          </Button>
        </div>
      </div>
    </DashboardLayout>);

}