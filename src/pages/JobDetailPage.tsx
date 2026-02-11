import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { api, applyToJob, saveJob, unsaveJob, getSavedJobs, getMyApplications, getCVs, CV } from '../lib/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Globe,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Lightbulb,
  Target,
  Heart,
  Zap,
  Send,
  PenLine,
  ArrowLeft
} from
  'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [error, setError] = useState('');

  // CV Selection
  const [cvVersions, setCvVersions] = useState<CV[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);

        if (isAuthenticated && user?.role === 'seeker') {
          // Check if already applied
          const apps = await getMyApplications();
          setIsApplied(apps.some((app: any) => app.job_id === Number(id)));

          // Check if already saved
          const saved = await getSavedJobs();
          setIsSaved(saved.some((s: any) => s.job_id === Number(id)));

          // Fetch CVs
          try {
            const cvs = await getCVs();
            setCvVersions(cvs);
            const primary = cvs.find(c => c.is_primary);
            if (primary) {
              setSelectedCvId(primary.id);
            }
          } catch (e) { console.error("Failed to fetch CVs", e); }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Failed to load job details'); // Set error for initial fetch
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, isAuthenticated, user?.role]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'seeker') {
      setMessage({ type: 'error', text: 'Only job seekers can apply for jobs.' });
      return;
    }

    setApplying(true);
    try {
      await applyToJob(Number(id), coverLetter, selectedCvId);
      setIsApplied(true);
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setShowCoverLetter(false);
    } catch (error: any) {
      console.error('Error applying for job:', error);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to submit application.' });
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(Number(id));
        setIsSaved(false);
        setMessage({ type: 'success', text: 'Job removed from saved items.' });
      } else {
        await saveJob(Number(id));
        setIsSaved(true);
        setMessage({ type: 'success', text: 'Job saved successfully!' });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      setMessage({ type: 'error', text: 'Failed to update saved status.' });
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setMessage({ type: 'success', text: 'Job link copied to clipboard!' });
    setTimeout(() => setMessage(null), 3000);
  };

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
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="text-slate-500 hover:text-slate-900"
            >
              Back to Jobs
            </Button>
          </div>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start space-x-6">
                <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {job.employer?.company_name?.charAt(0) || 'T'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {job.title}
                  </h1>
                  <div className="mt-2 flex items-center text-slate-500">
                    <Building2 className="mr-2 h-4 w-4" />
                    <span className="font-medium text-slate-900 mr-4">
                      {job.employer?.company_name || 'Anonymous'}
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
                      {job.salary_range || 'Competitive'}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <Badge>{job.job_type}</Badge>
                  </div>
                </div>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                  {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <span className="text-sm font-medium">{message.text}</span>
                </motion.div>
              )}
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
                  {job.requirements?.split(',').map((req: string) =>
                    <Badge
                      key={req.trim()}
                      variant="secondary"
                      className="text-sm py-1 px-3">
                      {req.trim()}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Apply Now Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-lg border border-slate-700 relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 to-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/15 to-purple-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                      <Send className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Apply for this Position</h2>
                      <p className="text-slate-400 text-sm">Take the next step in your career</p>
                    </div>
                  </div>

                  {/* Applied Status */}
                  {isApplied ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      <div>
                        <p className="text-emerald-300 font-semibold">Application Submitted!</p>
                        <p className="text-emerald-400/70 text-sm">You've already applied for this position. We'll be in touch!</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Cover Letter Toggle */}
                      {!showCoverLetter ? (
                        <div className="space-y-4">
                          {/* Quick Tips */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                <Target className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-slate-300 text-sm">Your profile is 92% match</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-slate-300 text-sm">Quick apply in seconds</span>
                            </div>
                          </div>

                          {/* CV Selection Dropdown */}
                          {cvVersions.length > 0 && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-slate-300 mb-2">Select CV</label>
                              <select
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                value={selectedCvId || ''}
                                onChange={(e) => setSelectedCvId(Number(e.target.value) || undefined)}
                              >
                                <option value="" className="text-slate-800">Use Default System CV</option>
                                {cvVersions.map(cv => (
                                  <option key={cv.id} value={cv.id} className="text-slate-800">
                                    {cv.title} {cv.is_primary ? '(Current)' : ''} ({new Date(cv.created_at).toLocaleDateString()})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              size="lg"
                              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-teal-500/40"
                              onClick={handleApply}
                              disabled={applying}
                            >
                              {applying ? 'Submitting...' : 'Quick Apply'}
                            </Button>
                            {isAuthenticated && user?.role === 'seeker' && (
                              <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 border-slate-600 text-slate-300 hover:bg-white/10 hover:border-slate-500 py-3 rounded-xl"
                                onClick={() => setShowCoverLetter(true)}
                              >
                                <PenLine className="mr-2 h-4 w-4" />
                                Add Cover Letter
                              </Button>
                            )}
                          </div>

                          {/* Extra Actions */}
                          <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                            <Button
                              variant="ghost"
                              className={`flex-1 text-slate-400 hover:text-white hover:bg-white/10 ${isSaved ? 'text-teal-400' : ''}`}
                              onClick={handleSave}
                              disabled={saving}
                            >
                              <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                              {isSaved ? 'Saved' : 'Save Job'}
                            </Button>
                            <Button
                              variant="ghost"
                              className="flex-1 text-slate-400 hover:text-white hover:bg-white/10"
                              onClick={handleShare}
                            >
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      ) : (
                        /* Cover Letter Form */
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-5"
                          >
                            {/* Tips Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                  <Heart className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-white text-sm font-medium">Show enthusiasm</p>
                                  <p className="text-slate-400 text-xs">Express genuine interest</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                                  <Zap className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="text-white text-sm font-medium">Keep it brief</p>
                                  <p className="text-slate-400 text-xs">3-4 paragraphs max</p>
                                </div>
                              </div>
                            </div>

                            {/* Textarea */}
                            <div className="relative">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-slate-400" />
                                <label className="text-sm font-medium text-slate-300">Your Cover Letter</label>
                                <span className="text-xs text-slate-500">(Optional)</span>
                              </div>
                              <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder={`Dear Hiring Team,\n\nI am excited to apply for the ${job.title} position at ${job.employer?.company_name || 'your company'}...\n\nIn my previous role, I achieved...\n\nThank you for considering my application.`}
                                className="w-full h-48 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none text-slate-100 placeholder-slate-500 text-sm leading-relaxed"
                              />
                              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                                {coverLetter.length} characters
                              </div>
                            </div>

                            {/* Pro Tip */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20">
                              <Lightbulb className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-slate-300">
                                <span className="text-teal-400 font-medium">Pro tip:</span> Cover letters increase callback rates by <span className="text-teal-400 font-semibold">50%</span>
                              </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                size="lg"
                                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300"
                                onClick={handleApply}
                                disabled={applying}
                              >
                                {applying ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Application
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-white/10 py-3 rounded-xl"
                                onClick={() => setShowCoverLetter(false)}
                              >
                                Skip Cover Letter
                              </Button>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
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
                      {job.salary_range || 'Competitive'}
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
                    <div className="text-slate-900 font-medium">{job.job_type}</div>
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