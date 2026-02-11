import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import {
  Target,
  Sparkles,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Brain,
  Zap,
  Shield,
  BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getEmployerApplications, Application as APIApp } from '../../lib/api';

export function AIScreeningPage() {
  const [applications, setApplications] = useState<APIApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  React.useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getEmployerApplications();
        setApplications(data);
        if (data.length > 0) setSelectedCandidate(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const recommendationConfig: any = {
    strong: {
      label: 'Strong Hire',
      color: 'bg-success-100 text-success-700',
      icon: CheckCircle
    },
    consider: {
      label: 'Consider',
      color: 'bg-primary-100 text-primary-700',
      icon: TrendingUp
    },
    review: {
      label: 'Needs Review',
      color: 'bg-amber-100 text-amber-700',
      icon: AlertTriangle
    },
    reject: {
      label: 'Not Recommended',
      color: 'bg-red-100 text-red-700',
      icon: XCircle
    }
  };

  if (loading) return <DashboardLayout role="employer"><div className="p-8 text-center">Loading...</div></DashboardLayout>;

  const metrics = [
    {
      title: 'Candidates Screened',
      value: applications.length.toString(),
      trend: 23,
      icon: <Users className="h-6 w-6" />,
      color: 'primary' as const
    },
    {
      title: 'Strong Matches',
      value: applications.filter(a => a.match_score >= 90).length.toString(),
      trend: 15,
      icon: <Target className="h-6 w-6" />,
      color: 'success' as const
    },
    {
      title: 'Avg. Match Score',
      value: applications.length > 0
        ? `${Math.round(applications.reduce((acc, current) => acc + (current.match_score || 0), 0) / applications.length)}%`
        : '0%',
      trend: 5,
      icon: <BarChart2 className="h-6 w-6" />,
      color: 'blue' as const
    },
    {
      title: 'Time Saved',
      value: `${applications.length * 0.5}h`,
      trend: 30,
      icon: <Zap className="h-6 w-6" />,
      color: 'accent' as const
    }
  ];

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Screening</h1>
            <p className="text-slate-500">
              Automated candidate evaluation powered by AI
            </p>
          </div>
          <Button leftIcon={<Sparkles className="h-4 w-4" />}>
            Run New Screening
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
            <MetricsCard key={metric.title} {...metric} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Candidates List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="font-semibold text-slate-900">
                  Recent Screenings
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {applications.map((app: any) => {
                  const score = app.match_score;
                  const recommendation = score >= 90 ? 'strong' : score >= 80 ? 'consider' : 'review';
                  const RecIcon = recommendationConfig[recommendation].icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedCandidate(app)}
                      className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${selectedCandidate?.id === app.id ? 'bg-primary-50' : ''}`}>

                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">
                          {app.seeker?.first_name} {app.seeker?.last_name}
                        </span>
                        <span
                          className={`text-lg font-bold ${score >= 90 ? 'text-success-600' : score >= 80 ? 'text-primary-600' : 'text-amber-600'}`}>
                          {score}%
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">
                        {app.job?.title}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${recommendationConfig[recommendation].color}`}>
                        <RecIcon className="h-3 w-3" />
                        {recommendationConfig[recommendation].label}
                      </div>
                    </button>);
                })}
              </div>
            </div>
          </div>

          {/* Details View */}
          <div className="lg:col-span-8">
            {selectedCandidate ?
              <motion.div
                key={selectedCandidate.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-6">

                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedCandidate.seeker?.first_name} {selectedCandidate.seeker?.last_name}
                      </h2>
                      <p className="text-slate-500">
                        {selectedCandidate.job?.title}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${recommendationConfig[selectedCandidate.match_score >= 90 ? 'strong' : 'consider'].color}`}>
                      <div className="flex items-center gap-2">
                        {React.createElement(
                          recommendationConfig[selectedCandidate.match_score >= 90 ? 'strong' : 'consider'].icon,
                          { className: 'h-5 w-5' }
                        )}
                        <span className="font-semibold">
                          {recommendationConfig[selectedCandidate.match_score >= 90 ? 'strong' : 'consider'].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Match Analysis */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary-600" />
                      AI Match Analysis
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: 'Overall Match',
                          value: selectedCandidate.match_score,
                          color: 'bg-primary-500'
                        }
                      ].map((score) =>
                        <div key={score.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">{score.label}</span>
                            <span className="font-semibold text-slate-900">
                              {score.value}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score.value}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              className={`h-full ${score.color} rounded-full`} />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </motion.div>
              :
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-500">
                Select a candidate to view AI screening insights
              </div>
            }
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}