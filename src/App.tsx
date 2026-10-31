import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchAndFilters } from './components/SearchAndFilters';
import { JobCard } from './components/JobCard';
import { JobDetailsModal } from './components/JobDetailsModal';
import { AiMatcherPage } from './components/AiMatcherPage';
import { DashboardPage } from './components/DashboardPage';
import { CareerAdvisorPage } from './components/CareerAdvisorPage';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { SavedJobsDrawer } from './components/SavedJobsDrawer';
import { Footer } from './components/Footer';
import { NormalizedJob } from './types/job';
import { ChevronLeft, ChevronRight, RefreshCw, Briefcase, FilterX, Activity, AlertCircle, ShieldCheck } from 'lucide-react';

function MainAppContent() {
  const { currentUser, userAccount } = useAuth();
  const [currentTab, setCurrentTab] = useState<'jobs' | 'ai-matcher' | 'dashboard' | 'advisor' | 'employer' | 'admin'>('jobs');

  // Filters state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [dateRange, setDateRange] = useState('all');
  const [level, setLevel] = useState('All Levels');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Data states
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [providersStatus, setProvidersStatus] = useState<Record<string, any>>({});
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Saved jobs state
  const [savedJobs, setSavedJobs] = useState<NormalizedJob[]>(() => {
    try {
      const stored = localStorage.getItem('fj_real_saved_jobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [selectedJob, setSelectedJob] = useState<NormalizedJob | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Sync saved jobs to local cache
  useEffect(() => {
    try {
      localStorage.setItem('fj_real_saved_jobs', JSON.stringify(savedJobs));
    } catch (e) {
      console.error('Failed to save jobs locally', e);
    }
  }, [savedJobs]);

  const savedJobIds = new Set(savedJobs.map((j) => j.id));

  const toggleSaveJob = (job: NormalizedJob) => {
    setSavedJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      if (exists) return prev.filter((j) => j.id !== job.id);
      return [...prev, job];
    });
  };

  const removeSavedJob = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const clearAllSaved = () => {
    setSavedJobs([]);
  };

  // Fetch real jobs from aggregator endpoint
  const fetchJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (location && location !== 'All Locations') params.append('location', location);
      if (remoteOnly) params.append('remoteOnly', 'true');
      params.append('page', String(page));
      params.append('limit', '12');

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch real jobs feed');
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotalJobs(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setProvidersStatus(data.providers || {});
    } catch (err) {
      console.error('Error fetching live jobs:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, [keyword, location, remoteOnly, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleQuickMatch = (job: NormalizedJob) => {
    setSelectedJob(null);
    setCurrentTab('ai-matcher');
  };

  const resetFilters = () => {
    setKeyword('');
    setLocation('All Locations');
    setDateRange('all');
    setLevel('All Levels');
    setRemoteOnly(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedJobsCount={savedJobs.length}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      <main className="flex-1">
        {/* TAB 1: Real Vacancies Feed matching screenshot layout */}
        {currentTab === 'jobs' && (
          <div>
            <HeroSection
              onQuickAiMatch={() => setCurrentTab('ai-matcher')}
              onOpenLocations={() => setLocation('Lagos, Nigeria')}
            />

            <SearchAndFilters
              keyword={keyword}
              setKeyword={setKeyword}
              location={location}
              setLocation={setLocation}
              dateRange={dateRange}
              setDateRange={setDateRange}
              level={level}
              setLevel={setLevel}
              remoteOnly={remoteOnly}
              setRemoteOnly={setRemoteOnly}
              onSearch={() => {
                setPage(1);
                fetchJobs();
              }}
              totalJobs={totalJobs}
            />

            {/* Provider Integration Status Strip */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-500 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-700">Jobicy Remote Feed: Active</span>
                  </div>

                  <span className="text-slate-300">|</span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        providersStatus.jooble?.configured ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                    <span>
                      Jooble Nigeria:{' '}
                      {providersStatus.jooble?.configured
                        ? 'Connected'
                        : 'Setup Key in Secrets (ng.jooble.org)'}
                    </span>
                  </div>
                </div>

                <div className="text-indigo-600 font-medium">
                  {totalJobs} Live Real Vacancies Indexed
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Showing {jobs.length > 0 ? (page - 1) * 12 + 1 : 0} -{' '}
                    {Math.min(page * 12, totalJobs)} of {totalJobs} real opportunities
                  </span>
                  {isLoadingJobs && (
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  )}
                </div>

                {(keyword || location !== 'All Locations' || remoteOnly) && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    <FilterX className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>

              {isLoadingJobs && jobs.length === 0 ? (
                <div className="py-20 text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    Fetching live vacancies from real job APIs...
                  </p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    No Live Vacancies Found for Query
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                    The external providers returned no current openings matching your exact keywords. Try a broader search term like "Software", "Analyst", or "Developer".
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    Reset Search Parameters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobIds.has(job.id)}
                      onToggleSave={toggleSaveJob}
                      onSelectJob={(j) => setSelectedJob(j)}
                      onQuickMatch={handleQuickMatch}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-4 pb-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-slate-800">Page {page}</span>
                    <span className="text-slate-400">of {totalPages}</span>
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AI Job Discovery (Gemini 3.8 Flash) */}
        {currentTab === 'ai-matcher' && (
          <AiMatcherPage
            onSelectJob={(j) => setSelectedJob(j)}
            savedJobIds={savedJobIds}
            onToggleSave={toggleSaveJob}
          />
        )}

        {/* TAB 3: Candidate Hub / Dashboard */}
        {currentTab === 'dashboard' && (
          <DashboardPage
            savedJobs={savedJobs}
            onSelectJob={(j) => setSelectedJob(j)}
            onRemoveSaved={removeSavedJob}
            onGoToAiMatcher={() => setCurrentTab('ai-matcher')}
            onGoToJobs={() => setCurrentTab('jobs')}
          />
        )}

        {/* TAB 4: Career Advisor */}
        {currentTab === 'advisor' && <CareerAdvisorPage />}

        {/* TAB 5: Employer Portal */}
        {currentTab === 'employer' && <EmployerDashboard />}

        {/* TAB 6: Admin Dashboard */}
        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        isSaved={selectedJob ? savedJobIds.has(selectedJob.id) : false}
        onToggleSave={toggleSaveJob}
        onRunAiMatch={handleQuickMatch}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <SavedJobsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedJobs={savedJobs}
        onSelectJob={(j) => setSelectedJob(j)}
        onRemoveJob={removeSavedJob}
        onClearAll={clearAllSaved}
      />

      <Footer
        onGoToAiMatcher={() => setCurrentTab('ai-matcher')}
        onGoToJobs={() => setCurrentTab('jobs')}
        onGoToAdvisor={() => setCurrentTab('advisor')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
