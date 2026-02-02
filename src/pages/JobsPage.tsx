import React from 'react';
import { Layout } from '../components/layout/Layout';
import { JobCard, Job } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Search, MapPin } from 'lucide-react';
export function JobsPage() {
  const jobs: Job[] = [
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
    id: '2',
    title: 'Product Manager',
    company: 'Safaricom',
    location: 'Nairobi, Kenya',
    salary: '$50k - $80k',
    type: 'Full-time',
    posted: '1 day ago',
    tags: ['Product', 'Agile', 'Fintech'],
    logoColor: 'bg-green-600'
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Flutterwave',
    location: 'Lagos, Nigeria',
    salary: '$60k - $90k',
    type: 'Remote',
    posted: '3 days ago',
    tags: ['Python', 'ML', 'Big Data'],
    logoColor: 'bg-amber-600'
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
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Paystack',
    location: 'Accra, Ghana',
    salary: '$55k - $85k',
    type: 'Full-time',
    posted: '1 week ago',
    tags: ['AWS', 'Kubernetes', 'CI/CD'],
    logoColor: 'bg-teal-600'
  },
  {
    id: '6',
    title: 'Marketing Lead',
    company: 'Jumia',
    location: 'Cairo, Egypt',
    salary: '$35k - $55k',
    type: 'Full-time',
    posted: '4 days ago',
    tags: ['Growth', 'SEO', 'Content'],
    logoColor: 'bg-orange-600'
  }];

  return (
    <Layout>
      <div className="bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            Find Your Next Opportunity
          </h1>
          <p className="mt-2 text-slate-400">
            Browse thousands of jobs from top companies across Africa.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Job title, keywords, or company"
                icon={<Search className="h-4 w-4" />}
                className="h-12 text-base" />

            </div>
            <div className="flex-1">
              <Input
                placeholder="City, state, or remote"
                icon={<MapPin className="h-4 w-4" />}
                className="h-12 text-base" />

            </div>
            <Button size="lg" className="h-12 px-8">
              Search Jobs
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <JobFilters />
          </div>

          {/* Job List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Showing <span className="text-teal-600">{jobs.length}</span>{' '}
                jobs
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="rounded-md border-none bg-transparent text-sm font-medium text-slate-900 focus:ring-0">
                  <option>Most Relevant</option>
                  <option>Newest</option>
                  <option>Salary: High to Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.map((job, idx) =>
              <JobCard key={job.id} job={job} index={idx} />
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <Button variant="outline" size="lg">
                Load More Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>);

}