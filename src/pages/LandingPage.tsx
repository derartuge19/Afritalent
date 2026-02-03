import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  Users,
  Globe,
  CheckCircle2,
  Sparkles,
  FileText,
  Target,
  GraduationCap,
  BarChart2
} from
  'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { getJobs } from '../lib/api';
export function LandingPage() {
  const stats = [
    {
      label: 'Jobs Matched',
      value: '50k+',
      icon: Briefcase
    },
    {
      label: 'Companies',
      value: '10k+',
      icon: BuildingIcon
    },
    {
      label: 'Countries',
      value: '15+',
      icon: Globe
    },
    {
      label: 'Success Rate',
      value: '89%',
      icon: Target
    }];

  const [featuredJobs, setFeaturedJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobs(3);
        const formattedJobs = jobs.map((job) => ({
          id: job.id.toString(),
          title: job.title,
          company: job.employer?.company_name || 'Unknown Company',
          location: job.location || 'Remote',
          salary: job.salary_range || 'Competitive',
          type: job.job_type || 'Full-time',
          posted: new Date(job.created_at).toLocaleDateString(),
          tags: ['Tech', 'Full-time'], // Mock tags for now as backend doesn't support them yet
          logoColor: 'bg-primary-600' // specific logic for logo color can be added later
        }));
        setFeaturedJobs(formattedJobs);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const features = [
    {
      title: 'AI-Powered Job Matching',
      description:
        "Our algorithms analyze your CV and skills to recommend jobs where you're most likely to succeed. Get a capability match score for every application.",
      icon: Sparkles,
      color: 'bg-primary-100 text-primary-600'
    },
    {
      title: 'Smart CV Builder',
      description:
        'Create professional CVs with modern templates designed for Ethiopian, African, and global markets. AI suggestions for wording and keywords.',
      icon: FileText,
      color: 'bg-accent-100 text-accent-600'
    },
    {
      title: 'Skills Analytics',
      description:
        'See how your skills compare to market demand. Get personalized recommendations for courses and skill development.',
      icon: BarChart2,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Career Guidance',
      description:
        'Access interview preparation resources, job-specific guidance, and career path recommendations based on your profile.',
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'AI Candidate Screening',
      description:
        'Employers get automatic ranking, skill gap identification, and trainability scores for junior candidates.',
      icon: Target,
      color: 'bg-success-100 text-success-600'
    },
    {
      title: 'Market Intelligence',
      description:
        'Access labor market analytics, salary benchmarks, and hiring trends across Africa and beyond.',
      icon: TrendingUp,
      color: 'bg-rose-100 text-rose-600'
    }];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-slate-900/95 to-slate-900" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
            className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-sm text-primary-300 ring-1 ring-primary-500/20 mb-6">

            <Sparkles className="h-4 w-4" />
            AI-Powered Job Matching Platform
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">

            Connecting Africa's Talent
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              with Global Opportunities
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">

            Our AI-powered platform matches your skills with perfect job
            opportunities. Reduce skills mismatch, accelerate hiring, and build
            your career across the continent and beyond.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.3
            }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

            <Link to="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white px-8">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-slate-600 text-white hover:bg-slate-800 hover:text-white px-8">
                Log In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.7,
              delay: 0.5
            }}
            className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">

            {stats.map((stat, index) =>
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + index * 0.1
                }}
                className="flex flex-col items-center rounded-2xl bg-white/5 p-6 backdrop-blur-sm ring-1 ring-white/10">

                <stat.icon className="h-6 w-6 text-primary-400 mb-3" />
                <dd className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </dd>
                <dt className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                  {stat.label}
                </dt>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Whether you're a job seeker, employer, or intern — our platform
              has the tools to help you achieve your goals.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) =>
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1
                }}
                className="relative flex flex-col p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all group">

                <div
                  className={`rounded-xl p-3 ${feature.color} w-fit mb-6 group-hover:scale-110 transition-transform`}>

                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 mb-4">
                <Users className="h-4 w-4" />
                For Job Seekers
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                Your Career Journey Starts Here
              </h2>
              <div className="space-y-4">
                {[
                  'Create detailed profiles with AI-powered CV parsing',
                  'Get matched with jobs based on your skills and preferences',
                  'Track applications: Applied, Shortlisted, Interviewed, Hired',
                  'Access career guidance and upskilling recommendations',
                  'Receive notifications via email, SMS, and Telegram'].
                  map((item, idx) =>
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{item}</span>
                    </div>
                  )}
              </div>
              <div className="mt-8">
                <Link to="/seeker/dashboard">
                  <Button size="lg">Create Your Profile</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
                    AK
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Abebe Kebede
                    </h3>
                    <p className="text-sm text-slate-500">Software Engineer</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center rounded-full bg-success-100 px-3 py-1 text-sm font-medium text-success-700">
                      92% Match
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Profile Completion</span>
                    <span className="font-medium text-slate-900">85%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Featured Opportunities
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Top roles from leading companies across Africa.
              </p>
            </div>
            <Link to="/jobs">
              <Button
                variant="ghost"
                className="text-primary-600 hover:text-primary-700">

                View All Jobs →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Simple loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
              ))
            ) : (
              featuredJobs.map((job, idx) =>
                <JobCard key={job.id} job={job} index={idx} />
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-primary-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Hiring?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
            Join thousands of companies and professionals using AfriTalent to
            connect talent with opportunity.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/seeker/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50">

                Create Free Profile
              </Button>
            </Link>
            <Link to="/employer/post-job">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">

                Post Your First Job
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>);

}
function BuildingIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">

      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>);

}