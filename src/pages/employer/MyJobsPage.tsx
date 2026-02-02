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
  MapPin,
  Clock,
  Filter,
  ChevronDown } from
'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'active' | 'paused' | 'closed' | 'draft';
  applicants: number;
  views: number;
  posted: string;
  deadline: string;
}
const jobs: Job[] = [
{
  id: '1',
  title: 'Senior Frontend Engineer',
  department: 'Engineering',
  location: 'Addis Ababa, Ethiopia',
  type: 'Full-time',
  status: 'active',
  applicants: 45,
  views: 892,
  posted: '2024-01-15',
  deadline: '2024-02-15'
},
{
  id: '2',
  title: 'Product Manager',
  department: 'Product',
  location: 'Remote',
  type: 'Full-time',
  status: 'active',
  applicants: 32,
  views: 654,
  posted: '2024-01-18',
  deadline: '2024-02-20'
},
{
  id: '3',
  title: 'Data Scientist',
  department: 'Data',
  location: 'Nairobi, Kenya',
  type: 'Full-time',
  status: 'paused',
  applicants: 28,
  views: 445,
  posted: '2024-01-10',
  deadline: '2024-02-10'
},
{
  id: '4',
  title: 'UX Designer',
  department: 'Design',
  location: 'Lagos, Nigeria',
  type: 'Contract',
  status: 'closed',
  applicants: 67,
  views: 1203,
  posted: '2023-12-20',
  deadline: '2024-01-20'
},
{
  id: '5',
  title: 'DevOps Engineer',
  department: 'Engineering',
  location: 'Addis Ababa, Ethiopia',
  type: 'Full-time',
  status: 'draft',
  applicants: 0,
  views: 0,
  posted: '',
  deadline: ''
}];

const statusConfig = {
  active: {
    label: 'Active',
    variant: 'success' as const,
    color: 'bg-success-500'
  },
  paused: {
    label: 'Paused',
    variant: 'warning' as const,
    color: 'bg-amber-500'
  },
  closed: {
    label: 'Closed',
    variant: 'secondary' as const,
    color: 'bg-slate-500'
  },
  draft: {
    label: 'Draft',
    variant: 'outline' as const,
    color: 'bg-slate-300'
  }
};
export function MyJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const stats = {
    active: jobs.filter((j) => j.status === 'active').length,
    paused: jobs.filter((j) => j.status === 'paused').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
    draft: jobs.filter((j) => j.status === 'draft').length
  };
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
            onClick={() =>
            setStatusFilter(status === statusFilter ? 'all' : status)
            }
            className={`p-4 rounded-xl border transition-all ${statusFilter === status ? 'border-primary-300 bg-primary-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>

              <div className="flex items-center gap-3">
                <div
                className={`w-3 h-3 rounded-full ${statusConfig[status as keyof typeof statusConfig].color}`} />

                <span className="text-sm font-medium text-slate-600 capitalize">
                  {status}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{count}</p>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />} />

          </div>
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Filters
          </Button>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Applicants
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job, index) =>
                <motion.tr
                  key={job.id}
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                  className="hover:bg-slate-50 transition-colors">

                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {job.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {job.department} • {job.type}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                        {job.location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusConfig[job.status].variant}>
                        {statusConfig[job.status].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-900">
                          {job.applicants}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{job.views}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/employer/candidates?job=${job.id}`}>
                          <Button variant="ghost" size="sm">
                            View Applicants
                          </Button>
                        </Link>
                        <div className="relative">
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                          setOpenMenu(openMenu === job.id ? null : job.id)
                          }
                          className="p-2">

                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          {openMenu === job.id &&
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                              <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Edit className="h-4 w-4" /> Edit Job
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
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
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredJobs.length === 0 &&
          <div className="text-center py-12">
              <p className="text-slate-500">
                No jobs found matching your criteria
              </p>
            </div>
          }
        </div>
      </div>
    </DashboardLayout>);

}