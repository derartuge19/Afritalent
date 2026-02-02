import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  BarChart2,
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  Play,
  Pause,
  Trash2,
  Eye,
  Mail,
  RefreshCw } from
'lucide-react';
import { motion } from 'framer-motion';
interface Report {
  id: string;
  name: string;
  type: 'user' | 'job' | 'market' | 'financial';
  frequency: 'daily' | 'weekly' | 'monthly' | 'one-time';
  lastRun: string;
  nextRun?: string;
  status: 'active' | 'paused' | 'completed';
  format: 'PDF' | 'CSV' | 'Excel';
}
const reports: Report[] = [
{
  id: '1',
  name: 'Monthly User Growth Report',
  type: 'user',
  frequency: 'monthly',
  lastRun: '2024-01-01',
  nextRun: '2024-02-01',
  status: 'active',
  format: 'PDF'
},
{
  id: '2',
  name: 'Weekly Job Posting Summary',
  type: 'job',
  frequency: 'weekly',
  lastRun: '2024-01-15',
  nextRun: '2024-01-22',
  status: 'active',
  format: 'Excel'
},
{
  id: '3',
  name: 'Daily Application Metrics',
  type: 'market',
  frequency: 'daily',
  lastRun: '2024-01-20',
  nextRun: '2024-01-21',
  status: 'active',
  format: 'CSV'
},
{
  id: '4',
  name: 'Quarterly Market Analysis',
  type: 'market',
  frequency: 'monthly',
  lastRun: '2024-01-01',
  nextRun: '2024-04-01',
  status: 'paused',
  format: 'PDF'
},
{
  id: '5',
  name: 'Employer Activity Report',
  type: 'user',
  frequency: 'weekly',
  lastRun: '2024-01-14',
  nextRun: '2024-01-21',
  status: 'active',
  format: 'PDF'
},
{
  id: '6',
  name: 'Skills Gap Analysis Q4 2023',
  type: 'market',
  frequency: 'one-time',
  lastRun: '2023-12-31',
  status: 'completed',
  format: 'PDF'
}];

const recentExports = [
{
  name: 'User Growth Report - January 2024',
  date: '2024-01-20',
  size: '2.4 MB',
  format: 'PDF'
},
{
  name: 'Job Postings Export',
  date: '2024-01-19',
  size: '1.8 MB',
  format: 'Excel'
},
{
  name: 'Application Data - Week 3',
  date: '2024-01-18',
  size: '856 KB',
  format: 'CSV'
},
{
  name: 'Market Analytics Summary',
  date: '2024-01-15',
  size: '3.2 MB',
  format: 'PDF'
}];

const typeConfig = {
  user: {
    label: 'User Report',
    icon: Users,
    color: 'bg-blue-100 text-blue-700'
  },
  job: {
    label: 'Job Report',
    icon: Briefcase,
    color: 'bg-purple-100 text-purple-700'
  },
  market: {
    label: 'Market Report',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-700'
  },
  financial: {
    label: 'Financial Report',
    icon: BarChart2,
    color: 'bg-amber-100 text-amber-700'
  }
};
const statusConfig = {
  active: {
    label: 'Active',
    variant: 'success' as const
  },
  paused: {
    label: 'Paused',
    variant: 'warning' as const
  },
  completed: {
    label: 'Completed',
    variant: 'secondary' as const
  }
};
export function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.name.
    toLowerCase().
    includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-slate-500">
              Generate and schedule platform reports
            </p>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>Create Report</Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
          {
            title: 'User Report',
            description: 'Export user data and growth metrics',
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            title: 'Job Report',
            description: 'Job postings and application data',
            icon: Briefcase,
            color: 'bg-purple-500'
          },
          {
            title: 'Market Report',
            description: 'Supply, demand, and trends',
            icon: TrendingUp,
            color: 'bg-green-500'
          },
          {
            title: 'Custom Report',
            description: 'Build a custom report',
            icon: BarChart2,
            color: 'bg-amber-500'
          }].
          map((action, index) =>
          <motion.button
            key={action.title}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.1
            }}
            className="p-4 bg-white rounded-xl border border-slate-200 text-left hover:shadow-md hover:border-slate-300 transition-all group">

              <div
              className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>

                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">{action.title}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {action.description}
              </p>
            </motion.button>
          )}
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Scheduled Reports
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48" />

              <Select
                options={[
                {
                  value: 'all',
                  label: 'All Types'
                },
                {
                  value: 'user',
                  label: 'User Reports'
                },
                {
                  value: 'job',
                  label: 'Job Reports'
                },
                {
                  value: 'market',
                  label: 'Market Reports'
                }]
                }
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)} />

            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Report
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">
                    Frequency
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">
                    Last Run
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report, index) => {
                  const TypeIcon = typeConfig[report.type].icon;
                  return (
                    <motion.tr
                      key={report.id}
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
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig[report.type].color}`}>

                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {report.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {report.format} format
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <RefreshCw className="h-4 w-4 text-slate-400" />
                          <span className="capitalize">{report.frequency}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="text-sm">
                          <p className="text-slate-900">
                            {new Date(report.lastRun).toLocaleDateString()}
                          </p>
                          {report.nextRun &&
                          <p className="text-xs text-slate-500">
                              Next:{' '}
                              {new Date(report.nextRun).toLocaleDateString()}
                            </p>
                          }
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusConfig[report.status].variant}>
                          {statusConfig[report.status].label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            title="Run Now">

                            <Play className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            title="Download">

                            <Download className="h-4 w-4" />
                          </Button>
                          {report.status === 'active' ?
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            title="Pause">

                              <Pause className="h-4 w-4" />
                            </Button> :
                          report.status === 'paused' ?
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-green-600"
                            title="Resume">

                              <Play className="h-4 w-4" />
                            </Button> :
                          null}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-red-500 hover:text-red-600"
                            title="Delete">

                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>);

                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Exports */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Exports
          </h3>
          <div className="space-y-3">
            {recentExports.map((export_, index) =>
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: index * 0.05
              }}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{export_.name}</p>
                    <p className="text-xs text-slate-500">
                      {export_.date} • {export_.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{export_.format}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>);

}