import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { MetricsCard } from '../components/analytics/MetricsCard';
import { MarketChart } from '../components/analytics/MarketChart';
import { Briefcase, CheckCircle, TrendingUp, Star } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { getSeekerAnalytics, getJobs, getSeekerProfile } from '../lib/api';

export function SeekerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({
    applications: 0,
    interviews: 0,
    profile_views: 0,
    saved_jobs: 0
  });
  const [profile, setProfile] = useState<any>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, jobsData, profileData] = await Promise.all([
          getSeekerAnalytics(),
          getJobs(2), // Fetch 2 jobs for recommendation
          getSeekerProfile()
        ]);

        setStats(analyticsData);
        setProfile(profileData);

        const formattedJobs = jobsData.map((job) => ({
          id: job.id.toString(),
          title: job.title,
          company: job.employer?.company_name || 'Unknown Company',
          location: job.location || 'Remote',
          salary: job.salary_range || 'Competitive',
          type: job.job_type || 'Full-time',
          posted: new Date(job.created_at).toLocaleDateString(),
          tags: ['Tech', 'Full-time'],
          logoColor: 'bg-blue-600'
        }));
        setRecommendedJobs(formattedJobs);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = [
    {
      title: 'Applications',
      value: stats.applications.toString(),
      trend: 20,
      icon: <Briefcase className="h-6 w-6" />,
      color: 'success' as const
    },
    {
      title: 'Interviews',
      value: stats.interviews.toString(),
      trend: 50,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'accent' as const
    },
    {
      title: 'Profile Views',
      value: stats.profile_views.toString(),
      trend: 12,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'blue' as const
    },
    {
      title: 'Saved Jobs',
      value: stats.saved_jobs.toString(),
      trend: -5,
      icon: <Star className="h-6 w-6" />,
      color: 'purple' as const
    }];

  const chartData = [
    {
      name: 'Jan',
      value: 4
    },
    {
      name: 'Feb',
      value: 8
    },
    {
      name: 'Mar',
      value: 6
    },
    {
      name: 'Apr',
      value: 12
    },
    {
      name: 'May',
      value: 10
    },
    {
      name: 'Jun',
      value: 15
    }];

  return (
    <DashboardLayout role="seeker">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {profile?.first_name || 'there'}!
        </h1>
        <p className="text-slate-500">
          Here's what's happening with your job search today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <MarketChart
            title="Profile Visibility"
            subtitle="Number of recruiters viewing your profile"
            data={chartData}
            type="area" />

        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Profile Completion
          </h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${profile?.completion_percentage >= 80 ? 'text-teal-600 bg-teal-200' :
                  profile?.completion_percentage >= 50 ? 'text-amber-600 bg-amber-200' :
                    'text-red-600 bg-red-200'
                  }`}>
                  {profile?.completion_status || 'Loading...'}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold inline-block ${profile?.completion_percentage >= 80 ? 'text-teal-600' :
                  profile?.completion_percentage >= 50 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                  {profile?.completion_percentage || 0}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200">
              <div
                style={{
                  width: `${profile?.completion_percentage || 0}%`
                }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${profile?.completion_percentage >= 80 ? 'bg-teal-500' :
                  profile?.completion_percentage >= 50 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              {profile?.has_cv ?
                'Great! Your profile is looking strong. Keep it updated to attract more opportunities.' :
                'Add your CV and complete your profile to reach 100% and appear in more searches.'
              }
            </p>
            <button
              onClick={() => navigate('/seeker/settings')}
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Update Profile &rarr;
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Recommended for You
          </h2>
          <Link
            to="/jobs"
            className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
            ))
          ) : (
            recommendedJobs.map((job, idx) =>
              <JobCard key={job.id} job={job} index={idx} />
            )
          )}
        </div>
      </div>
    </DashboardLayout>);

}