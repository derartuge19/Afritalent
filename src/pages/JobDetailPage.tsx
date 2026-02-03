import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { api } from '../lib/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Globe,
  Share2,
  Bookmark
} from
  'lucide-react';
import { useParams } from 'react-router-dom';
export function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError('Failed to load job details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-600">{error || 'Job not found'}</div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start space-x-6">
                <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  T
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {job.title}
                  </h1>
                  <div className="mt-2 flex items-center text-slate-500">
                    <Building2 className="mr-2 h-4 w-4" />
                    <span className="font-medium text-slate-900 mr-4">
                      {job.company}
                    </span>
                    <Globe className="mr-2 h-4 w-4" />
                    <a href="#" className="text-teal-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Posted {job.posted}
                    </div>
                    <Badge>{job.type}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-3">
                <Button size="lg" className="w-full md:w-auto px-8">
                  Apply Now
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Bookmark className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Job Description
                </h2>
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-teal-600"
                  dangerouslySetInnerHTML={{
                    __html: job.description
                  }} />

              </div>

              <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.requirements?.map((req: string) =>
                    <Badge
                      key={req}
                      variant="secondary"
                      className="text-sm py-1 px-3">

                      {req}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Job Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Salary
                    </div>
                    <div className="text-slate-900 font-medium">
                      {job.salary}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Location
                    </div>
                    <div className="text-slate-900 font-medium">
                      {job.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Job Type
                    </div>
                    <div className="text-slate-900 font-medium">{job.type}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Experience
                    </div>
                    <div className="text-slate-900 font-medium">
                      Senior Level
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-teal-50 p-6 border border-teal-100">
                <h3 className="text-lg font-bold text-teal-900 mb-2">
                  AI Match Score
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-teal-700">
                    Your Profile Match
                  </span>
                  <span className="text-2xl font-bold text-teal-600">92%</span>
                </div>
                <div className="w-full bg-teal-200 rounded-full h-2.5">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full"
                    style={{
                      width: '92%'
                    }}>
                  </div>
                </div>
                <p className="mt-4 text-sm text-teal-700">
                  Your skills in React and TypeScript make you a strong
                  candidate for this role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>);

}