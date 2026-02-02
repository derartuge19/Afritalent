import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import {
  Search,
  Filter,
  MoreVertical,
  Briefcase,
  Building2,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Flag,
  Trash2,
  Download,
  Clock,
  Users,
  TrendingUp } from
'lucide-react';
import { motion } from 'framer-motion';
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: 'active' | 'pending' | 'flagged' | 'closed';
  applicants: number;
  posted: string;
  views: number;
}
const jobs: Job[] = [
{
  id: '1',
  title: 'Senior Frontend Engineer',
  company: 'TechAfrica',
  location: 'Addis Ababa, Ethiopia',
  type: 'Full-time',
  status: 'active',
  applicants: 45,
  posted: '2024-01-15',
  views: 892
},
{
  id: '2',
  title: 'Product Manager',
  company: 'Safaricom',
  location: 'Nairobi, Kenya',
  type: 'Full-time',
  status: 'active',
  applicants: 32,
  posted: '2024-01-18',
  views: 654
},
{
  id: '3',
  title: 'Data Scientist',
  company: 'Flutterwave',
  location: 'Lagos, Nigeria',
  type: 'Remote',
  status: 'pending',
  applicants: 0,
  posted: '2024-01-20',
  views: 0
},
{
  id: '4',
  title: 'Marketing Director',
  company: 'Unknown Corp',
  location: 'Remote',
  type: 'Full-time',
  status: 'flagged',
  applicants: 12,
  posted: '2024-01-10',
  views: 234
},
{
  id: '5',
  title: 'DevOps Engineer',
  company: 'Paystack',
  location: 'Accra, Ghana',
  type: 'Full-time',
  status: 'active',
  applicants: 28,
  posted: '2024-01-12',
  views: 445
},
{
  id: '6',
  title: 'UX Designer',
  company: 'Andela',
  location: 'Remote',
  type: 'Contract',
  status: 'closed',
  applicants: 67,
  posted: '2023-12-20',
  views: 1203
}];

const statusConfig = {
  active: {
    label: 'Active',
    variant: 'success' as const
  },
  pending: {
    label: 'Pending Review',
    variant: 'warning' as const
  },
  flagged: {
    label: 'Flagged',
    variant: 'danger' as const
  },
  closed: {
    label: 'Closed',
    variant: 'secondary' as const
  }
};
export function JobsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const metrics = [
  {
    title: 'Total Jobs',
    value: '3,450',
    trend: 8,
    icon: <Briefcase className="h-6 w-6" />,
    color: 'primary' as const
  },
  {
    title: 'Active Jobs',
    value: '2,890',
    trend: 12,
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'success' as const
  },
  {
    title: 'Pending Review',
    value: '124',
    trend: -5,
    icon: <Clock className="h-6 w-6" />,
    color: 'accent' as const
  },
  {
    title: 'Flagged',
    value: '18',
    trend: -15,
    icon: <Flag className="h-6 w-6" />,
    color: 'blue' as const
  }];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Jobs Management
            </h1>
            <p className="text-slate-500">Review and manage all job postings</p>
          </div>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export Jobs
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
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
          <Select
            options={[
            {
              value: 'all',
              label: 'All Status'
            },
            {
              value: 'active',
              label: 'Active'
            },
            {
              value: 'pending',
              label: 'Pending Review'
            },
            {
              value: 'flagged',
              label: 'Flagged'
            },
            {
              value: 'closed',
              label: 'Closed'
            }]
            }
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} />

          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            More Filters
          </Button>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Job
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">
                    Applicants
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">
                    Views
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
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
                    delay: index * 0.03
                  }}
                  className="hover:bg-slate-50 transition-colors">

                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Building2 className="h-3.5 w-3.5" />
                          {job.company}
                          <span className="text-slate-300">•</span>
                          {job.type}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="h-4 w-4 mr-1" />
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
                        <Button variant="ghost" size="sm" className="p-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          onClick={() =>
                          setOpenMenu(openMenu === job.id ? null : job.id)
                          }>

                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          {openMenu === job.id &&
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                              {job.status === 'pending' &&
                          <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" /> Approve
                                  Job
                                </button>
                          }
                              {job.status === 'flagged' &&
                          <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" /> Clear Flag
                                </button>
                          }
                              {job.status === 'active' &&
                          <button className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                                  <Flag className="h-4 w-4" /> Flag Job
                                </button>
                          }
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> Remove Job
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
        </div>
      </div>
    </DashboardLayout>);

}