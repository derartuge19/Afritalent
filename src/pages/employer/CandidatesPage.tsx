import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  Search,
  Download,
  MapPin,
  User,
  Calendar,
  Clock,
  Video,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmployerApplications, updateApplicationStatus, scheduleInterview, Application as APIApp } from '../../lib/api';

export function CandidatesPage() {
  const [applications, setApplications] = useState<APIApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedJob, setSelectedJob] = useState('all');

  // Interview Modal State
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [schedulingCandidate, setSchedulingCandidate] = useState<APIApp | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: ''
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulingError, setSchedulingError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await getEmployerApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications.');
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
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId: number, nextStatus: string) => {
    try {
      await updateApplicationStatus(appId, nextStatus);
      fetchApplications();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingCandidate) return;

    setIsScheduling(true);
    setSchedulingError(null);

    const start_time = `${interviewForm.date}T${interviewForm.startTime}:00`;
    const end_time = `${interviewForm.date}T${interviewForm.endTime}:00`;

    try {
      await scheduleInterview({
        application_id: schedulingCandidate.id,
        title: interviewForm.title,
        description: interviewForm.description,
        start_time,
        end_time,
        location: interviewForm.location
      });

      setIsInterviewModalOpen(false);
      fetchApplications(); // Refresh to show updated status
      // Reset form
      setInterviewForm({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: ''
      });
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || 'Failed to schedule interview.';
      setSchedulingError(errorDetail);
    } finally {
      setIsScheduling(false);
    }
  };

  const filteredCandidates = applications.filter((app) => {
    const seeker = (app as any).seeker || {};
    const name = `${seeker.first_name || ''} ${seeker.last_name || ''}`;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'All' || app.status.toLowerCase() === selectedStage.toLowerCase();
    const matchesJob = selectedJob === 'all' || app.job_id.toString() === selectedJob;
    return matchesSearch && matchesStage && matchesJob;
  });

  const stages = ['All', 'Applied', 'Shortlisted', 'Invited', 'Scheduled', 'Interviewed', 'Offered', 'Hired', 'Rejected'];

  const statusConfig: any = {
    applied: { label: 'New', variant: 'default', color: 'bg-blue-500' },
    shortlisted: { label: 'Shortlisted', variant: 'warning', color: 'bg-amber-500' },
    invited: { label: 'Invited', variant: 'warning', color: 'bg-indigo-500' },
    scheduled: { label: 'Scheduled', variant: 'default', color: 'bg-blue-600' },
    interviewed: { label: 'Interviewed', variant: 'default', color: 'bg-primary-500' },
    offered: { label: 'Offer Sent', variant: 'success', color: 'bg-success-500' },
    hired: { label: 'Hired', variant: 'success', color: 'bg-green-600' },
    rejected: { label: 'Rejected', variant: 'secondary', color: 'bg-slate-400' }
  };

  const stageCounts = stages.reduce(
    (acc, stage) => {
      acc[stage] =
        stage === 'All' ?
          applications.length :
          applications.filter((c) => c.status.toLowerCase() === stage.toLowerCase()).length;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) return <DashboardLayout role="employer"><div className="p-8 text-center">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
            <p className="text-slate-500">
              Manage and track applicants for your job openings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Stage Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit overflow-x-auto no-scrollbar max-w-full">
          {stages.map((stage) =>
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${selectedStage === stage
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {stage}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${selectedStage === stage ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'
                }`}>
                {stageCounts[stage]}
              </span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Select
            options={[
              { value: 'all', label: 'All Jobs' },
              ...Array.from(new Set(applications.map(a => a.job?.title))).map(title => ({
                value: applications.find(a => a.job?.title === title)?.job_id.toString() || '',
                label: title || ''
              }))
            ]}
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)} />
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCandidates.map((candidate, index) =>
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold overflow-hidden">
                    {candidate.seeker?.cv_url ? (
                      <img
                        src={`http://127.0.0.1:8000${candidate.seeker.cv_url}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      candidate.seeker?.first_name?.[0] || 'U'
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {candidate.seeker?.first_name} {candidate.seeker?.last_name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {candidate.seeker?.headline || 'No headline'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Applied for: {candidate.job?.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusConfig[candidate.status.toLowerCase()]?.variant || 'default'}>
                    {statusConfig[candidate.status.toLowerCase()]?.label || candidate.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  {candidate.seeker?.location || 'Not specified'}
                </div>
                {(candidate.cv || candidate.seeker?.has_cv || candidate.seeker?.cv_url) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={candidate.cv
                        ? `http://127.0.0.1:8000/cvs/${candidate.cv.id}/view`
                        : `http://127.0.0.1:8000/seeker-profile/${candidate.seeker?.id}/cv`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100"
                    >
                      <Download className="h-4 w-4" />
                      View CV {candidate.cv ? `(${candidate.cv.title})` : ''}
                    </a>
                  </div>
                )}
                {candidate.cover_letter && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Cover Letter</p>
                    <p className="text-sm text-slate-700 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer" title="Click to expand">
                      {candidate.cover_letter}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <div
                    className={`text-lg font-bold ${candidate.match_score >= 90 ? 'text-success-600' : candidate.match_score >= 80 ? 'text-primary-600' : 'text-slate-600'}`}>
                    {candidate.match_score}%
                  </div>
                  <span className="text-xs text-slate-500">match</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    className="text-xs h-8"
                    options={[
                      { value: 'applied', label: 'New' },
                      { value: 'shortlisted', label: 'Shortlisted' },
                      { value: 'invited', label: 'Invited' },
                      { value: 'scheduled', label: 'Scheduled' },
                      { value: 'interviewed', label: 'Interviewed' },
                      { value: 'offered', label: 'Offer Sent' },
                      { value: 'hired', label: 'Hired' },
                      { value: 'rejected', label: 'Rejected' }
                    ]}
                    value={candidate.status.toLowerCase()}
                    onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                  />
                  {(candidate.status.toLowerCase() !== 'interviewed' && candidate.status.toLowerCase() !== 'hired' && candidate.status.toLowerCase() !== 'rejected') && (
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Calendar className="h-3 w-3" />}
                      onClick={() => {
                        setSchedulingCandidate(candidate);
                        setInterviewForm(prev => ({ ...prev, title: `Interview for ${candidate.job?.title}` }));
                        setIsInterviewModalOpen(true);
                      }}
                      className="text-xs px-2 h-8"
                    >
                      {candidate.status.toLowerCase() === 'scheduled' || candidate.status.toLowerCase() === 'invited' ? 'Reschedule' : 'Schedule'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {filteredCandidates.length === 0 &&
          <div className="py-20 text-center bg-white rounded-xl border border-slate-200">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <User className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No candidates found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              We couldn't find any candidates matching your current filters. Try broadening your search.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSearchQuery('');
                setSelectedStage('All');
                setSelectedJob('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        }
      </div>
      <AnimatePresence>
        {isInterviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInterviewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Schedule Interview</h3>
                <button
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="p-6 space-y-4">
                {schedulingError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                    {schedulingError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Interview Title</label>
                    <Input
                      required
                      placeholder="e.g. Technical Round 1"
                      value={interviewForm.title}
                      onChange={(e) => setInterviewForm({ ...interviewForm, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                      <Input
                        required
                        type="date"
                        value={interviewForm.date}
                        onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 text-xs">Start Time</label>
                        <Input
                          required
                          type="time"
                          value={interviewForm.startTime}
                          onChange={(e) => setInterviewForm({ ...interviewForm, startTime: e.target.value })}
                          icon={<Clock className="h-4 w-4" />}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 text-xs">End Time</label>
                        <Input
                          required
                          type="time"
                          value={interviewForm.endTime}
                          onChange={(e) => setInterviewForm({ ...interviewForm, endTime: e.target.value })}
                          icon={<Clock className="h-4 w-4" />}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location / Meeting Link</label>
                    <Input
                      placeholder="e.g. Google Meet Link or Office Address"
                      value={interviewForm.location}
                      onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                      icon={<Video className="h-4 w-4" />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] text-sm"
                      placeholder="Add any instructions for the candidate..."
                      value={interviewForm.description}
                      onChange={(e) => setInterviewForm({ ...interviewForm, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsInterviewModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isScheduling}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}