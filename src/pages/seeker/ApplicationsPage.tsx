import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  ExternalLink,
  MoreVertical,
  Eye
} from
  'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../../lib/api';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  lastUpdate: string;
  logoColor: string;
  nextStep?: string;
  interviewDate?: string;
}

const statusConfig: Record<string, {
  label: string;
  variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  color: string;
  icon: any;
}> = {
  applied: {
    label: 'Applied',
    variant: 'secondary' as const,
    color: 'bg-slate-500',
    icon: Clock
  },
  shortlisted: {
    label: 'Shortlisted',
    variant: 'warning' as const,
    color: 'bg-amber-500',
    icon: Eye
  },
  interviewed: {
    label: 'Interviewed',
    variant: 'default' as const,
    color: 'bg-primary-500',
    icon: Calendar
  },
  offered: {
    label: 'Offer Received',
    variant: 'success' as const,
    color: 'bg-success-500',
    icon: CheckCircle
  },
  hired: {
    label: 'Hired',
    variant: 'success' as const,
    color: 'bg-green-600',
    icon: CheckCircle
  },
  rejected: {
    label: 'Not Selected',
    variant: 'secondary' as const,
    color: 'bg-slate-400',
    icon: XCircle
  }
};
const stages = [
  'All',
  'Applied',
  'Shortlisted',
  'Interviewed',
  'Offered',
  'Hired',
  'Rejected'];

const logoColors = [
  'bg-blue-600',
  'bg-green-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-teal-600',
  'bg-red-600',
  'bg-indigo-600',
  'bg-pink-600'
];

const getTimeSince = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

export function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        const mappedApplications: Application[] = data.map((app, index) => ({
          id: app.id.toString(),
          jobTitle: app.job?.title || 'Unknown Position',
          company: app.job?.employer?.company_name || 'Unknown Company',
          location: app.job?.location || 'Location not specified',
          salary: app.job?.salary_range || 'Not specified',
          appliedDate: app.applied_at,
          status: app.status as any,
          lastUpdate: getTimeSince(app.applied_at),
          logoColor: logoColors[index % logoColors.length],
        }));
        setApplications(mappedApplications);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage =
      selectedStage === 'All' || app.status === selectedStage.toLowerCase();
    return matchesSearch && matchesStage;
  });
  const stageCounts = stages.reduce(
    (acc, stage) => {
      acc[stage] =
        stage === 'All' ?
          applications.length :
          applications.filter((a) => a.status === stage.toLowerCase()).length;
      return acc;
    },
    {} as Record<string, number>
  );
  if (loading) {
    return (
      <DashboardLayout role="seeker">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="seeker">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500">
            Track the status of all your job applications
          </p>
        </div>

        {/* Pipeline Stages */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stages.map((stage) =>
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedStage === stage ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>

              {stage}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedStage === stage ? 'bg-white/20' : 'bg-slate-200'}`}>

                {stageCounts[stage]}
              </span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />} />

          </div>
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Filters
          </Button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application, index) => {
            const statusInfo = statusConfig[application.status] || statusConfig.applied;
            const StatusIcon = statusInfo.icon;
            return (
              <motion.div
                key={application.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.05
                }}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Job Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl ${application.logoColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>

                      {application.company.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {application.jobTitle}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {application.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {application.location}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Applied on{' '}
                        {new Date(application.appliedDate).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex flex-col items-start sm:items-end">
                      <Badge
                        variant={statusInfo.variant}
                        className="mb-1">

                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Updated {application.lastUpdate}
                      </span>
                    </div>

                    {application.nextStep &&
                      <div className="px-3 py-2 bg-primary-50 rounded-lg border border-primary-100">
                        <p className="text-xs text-primary-600 font-medium">
                          Next Step
                        </p>
                        <p className="text-sm text-primary-900">
                          {application.nextStep}
                        </p>
                        {application.interviewDate &&
                          <p className="text-xs text-primary-600 mt-1">
                            {new Date(
                              application.interviewDate
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        }
                      </div>
                    }

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-2">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Link to={`/jobs/${application.id}`}>
                        <Button variant="outline" size="sm">
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>);

          })}
        </div>

        {filteredApplications.length === 0 &&
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No applications found</p>
            <Link to="/jobs">
              <Button className="mt-4">Browse Jobs</Button>
            </Link>
          </div>
        }
      </div>
    </DashboardLayout>);

}