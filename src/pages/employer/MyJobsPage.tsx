import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Users,
  Edit,
  Pause,
  Trash2,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyJobs, updateJobStatus, Job as APIJob } from '../../lib/api';

export function MyJobsPage() {
  const [jobs, setJobs] = useState<APIJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const fetchJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load your jobs.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Check URL params for search query on mount
    const params = new URLSearchParams(window.location.search);
    const urlSearch = params.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'open' ? 'paused' : 'open';
      await updateJobStatus(jobId, newStatus);
      fetchJobs(); // Refresh
      setOpenMenu(null);
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    open: jobs.filter((j) => j.status === 'open').length,
    paused: jobs.filter((j) => j.status === 'paused').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
  };

  const statusConfig: any = {
    open: {
      label: 'Open',
      variant: 'success',
      color: 'bg-success-500'
    },
    paused: {
      label: 'Paused',
      variant: 'warning',
      color: 'bg-amber-500'
    },
    closed: {
      label: 'Closed',
      variant: 'secondary',
      color: 'bg-slate-500'
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="employer">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
            <p className="text-slate-500">
              Manage and track all your job postings
            </p>
          </div>
          <Link to="/employer/post-job">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(stats).map(([status, count]) =>
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-4 rounded-xl border transition-all text-left ${statusFilter === status
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
            >
              <p className="text-sm font-medium text-slate-500 capitalize">
                {status} Jobs
              </p>
              <p className="text-2xl font-bold text-slate-900">{count}</p>
            </button>
          )}
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-xl border transition-all text-left ${statusFilter === 'all'
              ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
              : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
          >
            <p className="text-sm font-medium text-slate-500">Total Jobs</p>
            <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by job title or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <ChevronDown className="h-4 w-4" /> Sort By
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center hidden sm:table-cell">
                    Applicants
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center hidden lg:table-cell">
                    Views
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredJobs.map((job, index) =>
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">
                          {job.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {job.job_type}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={statusConfig[job.status]?.variant}>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 w-1.5 rounded-full ${statusConfig[job.status]?.color}`} />
                          {statusConfig[job.status]?.label}
                        </div>
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {job.applicants_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{job.views || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOpenMenu(openMenu === job.id ? null : job.id)}
                          className="p-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {openMenu === job.id &&
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Edit className="h-4 w-4" /> Edit Job
                            </button>
                            <button
                              onClick={() => handleToggleStatus(job.id, job.status)}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Pause className="h-4 w-4" />{' '}
                              {job.status === 'paused' ? 'Resume' : 'Pause'}{' '}
                              Job
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <Trash2 className="h-4 w-4" /> Delete Job
                            </button>
                          </div>
                        }
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredJobs.length === 0 &&
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-400 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">No jobs found</h3>
              <p className="text-sm text-slate-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          }
        </div>
      </div>
    </DashboardLayout>
  );
}