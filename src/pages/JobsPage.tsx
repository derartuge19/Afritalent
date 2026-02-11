import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { getJobs } from '../lib/api';
import type { Job as APIJob } from '../lib/api';

export function JobsPage() {
  const [jobs, setJobs] = useState<APIJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    job_type?: string;
    experience_level?: string;
    salary_min?: number;
  }>({});

  const fetchJobs = useCallback(async (isInitial = false, searchOverride?: string) => {
    if (!isInitial) setLoading(true);
    try {
      const data = await getJobs(20, {
        search: searchOverride !== undefined ? searchOverride : (searchQuery || undefined),
        location: locationQuery || undefined,
        job_type: selectedFilters.job_type,
        experience_level: selectedFilters.experience_level,
        salary_min: selectedFilters.salary_min
      });
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, locationQuery, selectedFilters]);

  // Initial load and filter-change listener
  useEffect(() => {
    // Check URL params for search query on mount
    const params = new URLSearchParams(window.location.search);
    const urlSearch = params.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
      // We need to pass it directly because state update might be async
      fetchJobs(false, urlSearch);
    } else {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedFilters({});

    // Manual trigger for faster feedback if state update is batched
    setLoading(true);
    getJobs(20).then(setJobs).finally(() => setLoading(false));
  };

  return (
    <Layout>
      <div className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            FIND YOUR <span className="text-primary-500">NEXT</span> ROLE
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl">
            Connect with the best companies across Africa and beyond. Professional opportunities tailored for you.
          </p>

          <form onSubmit={handleSearch} className="mt-10 flex flex-col gap-3 sm:flex-row bg-slate-800/50 p-2 rounded-2xl border border-slate-700 backdrop-blur-sm">
            <div className="flex-1 relative">
              <Input
                placeholder="Job title, keywords, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-5 w-5 text-slate-500" />}
                className="h-14 text-lg text-white bg-transparent border-none focus:ring-0 placeholder:text-slate-500" />
            </div>
            <div className="w-px bg-slate-700 hidden sm:block my-2" />
            <div className="flex-1 relative">
              <Input
                placeholder="City, region, or remote"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                icon={<MapPin className="h-5 w-5 text-slate-500" />}
                className="h-14 text-lg text-white bg-transparent border-none focus:ring-0 placeholder:text-slate-500" />
            </div>
            <Button type="submit" size="lg" className="h-14 px-10 rounded-xl shadow-lg shadow-primary-500/20 font-bold text-lg">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <JobFilters
              selectedType={selectedFilters.job_type}
              selectedExperience={selectedFilters.experience_level}
              selectedSalary={selectedFilters.salary_min}
              onFilterChange={(newFilters) => setSelectedFilters(prev => ({ ...prev, ...newFilters }))}
              onClear={clearFilters}
            />
          </aside>

          {/* Job Feed */}
          <main className="flex-1">
            <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {loading ? 'Searching...' : `Found ${jobs.length} opportunities`}
              </h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="h-12 w-12 animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 font-semibold text-lg">Curating top jobs for you...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {jobs.map((job, idx) => (
                  <JobCard
                    key={job.id}
                    job={{
                      id: job.id.toString(),
                      title: job.title,
                      company: job.employer?.company_name || 'Anonymous',
                      location: job.location || 'Remote',
                      salary: job.salary_range || 'Competitive',
                      type: job.job_type || 'Full-time',
                      posted: new Date(job.created_at).toLocaleDateString(),
                      tags: [],
                      logoColor: 'bg-primary-600'
                    }}
                    index={idx}
                  />
                ))}

                {!loading && jobs.length === 0 && (
                  <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
                    <div className="mx-auto h-20 w-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                      <Search className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">No results found</h3>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto text-lg leading-relaxed">
                      We couldn't find any positions matching your current filters. Try broadening your keywords or location.
                    </p>
                    <div className="mt-8 flex gap-4 justify-center">
                      <Button variant="outline" className="px-8 border-slate-300 hover:bg-white" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                      <Button variant="ghost" className="text-primary-600 hover:bg-primary-50" onClick={() => fetchJobs()}>
                        Refresh
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}