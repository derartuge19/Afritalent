import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { JobCard, Job } from '../../components/jobs/JobCard';
import { Search, Bookmark, BookmarkX, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getSavedJobs, unsaveJob } from '../../lib/api';

export function SavedJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const data = await getSavedJobs();
        const mappedJobs: Job[] = data.map((savedJob) => ({
          id: savedJob.job?.id.toString() || savedJob.job_id.toString(),
          title: savedJob.job?.title || 'Unknown Position',
          company: savedJob.job?.employer?.company_name || 'Unknown Company',
          location: savedJob.job?.location || 'Location not specified',
          salary: savedJob.job?.salary_range || 'Not specified',
          type: savedJob.job?.job_type || 'Full-time',
          posted: new Date(savedJob.created_at).toLocaleDateString(),
          tags: [],
          logoColor: 'bg-blue-600'
        }));
        setJobs(mappedJobs);
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const removeJob = async (id: string) => {
    try {
      await unsaveJob(parseInt(id));
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };
  if (loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/user/dashboard')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="text-slate-500 hover:text-slate-900"
        >
          Back to Dashboard
        </Button>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Saved Jobs</h1>
            <p className="text-slate-500">Jobs you've bookmarked for later</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{jobs.length} saved</span>
          </div>
        </div>

        {/* Search & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />} />

          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Filters
            </Button>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-slate-50'}`}>

                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-slate-50'}`}>

                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid/List */}
        {filteredJobs.length > 0 ?
          <div
            className={
              viewMode === 'grid' ?
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' :
                'space-y-4'
            }>

            {filteredJobs.map((job, index) =>
              <motion.div
                key={job.id}
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
                className="relative group">

                <JobCard job={job} index={index} />
                <button
                  onClick={() => removeJob(job.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  title="Remove from saved">

                  <BookmarkX className="h-4 w-4 text-red-500" />
                </button>
              </motion.div>
            )}
          </div> :

          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Bookmark className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No saved jobs
            </h3>
            <p className="text-slate-500 mb-4">
              {searchQuery ?
                'No jobs match your search' :
                "Start saving jobs you're interested in"}
            </p>
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        }
      </div>
    </DashboardLayout>);

}