import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { MetricsCard } from '../components/analytics/MetricsCard';
import { MarketChart } from '../components/analytics/MarketChart';
import { Briefcase, CheckCircle, Clock, TrendingUp, Star } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
export function SeekerDashboard() {
  const metrics = [
  {
    title: 'Applications',
    value: '12',
    trend: 20,
    icon: <Briefcase className="h-6 w-6" />,
    color: 'teal' as const
  },
  {
    title: 'Interviews',
    value: '3',
    trend: 50,
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'amber' as const
  },
  {
    title: 'Profile Views',
    value: '145',
    trend: 12,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'blue' as const
  },
  {
    title: 'Saved Jobs',
    value: '8',
    trend: -5,
    icon: <Star className="h-6 w-6" />,
    color: 'purple' as const
  }];

  const chartData = [
  {
    name: 'Jan',
    value: 4
  },
  {
    name: 'Feb',
    value: 8
  },
  {
    name: 'Mar',
    value: 6
  },
  {
    name: 'Apr',
    value: 12
  },
  {
    name: 'May',
    value: 10
  },
  {
    name: 'Jun',
    value: 15
  }];

  const recommendedJobs = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechAfrica',
    location: 'Addis Ababa, Ethiopia',
    salary: '$40k - $60k',
    type: 'Full-time',
    posted: '2 days ago',
    tags: ['React', 'TypeScript', 'Remote'],
    logoColor: 'bg-blue-600'
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'Andela',
    location: 'Remote',
    salary: '$45k - $70k',
    type: 'Contract',
    posted: '5 hours ago',
    tags: ['Figma', 'User Research', 'Prototyping'],
    logoColor: 'bg-indigo-600'
  }];

  return (
    <DashboardLayout role="seeker">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, Abebe!
        </h1>
        <p className="text-slate-500">
          Here's what's happening with your job search today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) =>
        <MetricsCard key={metric.title} {...metric} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <MarketChart
            title="Profile Visibility"
            subtitle="Number of recruiters viewing your profile"
            data={chartData}
            type="area" />

        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Profile Completion
          </h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                  Strong
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-teal-600">
                  85%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
              <div
                style={{
                  width: '85%'
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500">
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Add your certifications to reach 100% and appear in more searches.
            </p>
            <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
              Update Profile &rarr;
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Recommended for You
          </h2>
          <a
            href="/jobs"
            className="text-sm font-medium text-teal-600 hover:text-teal-700">

            View All
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {recommendedJobs.map((job, idx) =>
          <JobCard key={job.id} job={job} index={idx} />
          )}
        </div>
      </div>
    </DashboardLayout>);

}