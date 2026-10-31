import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchAndFilters } from './components/SearchAndFilters';
import { JobCard } from './components/JobCard';
import { JobDetailsModal } from './components/JobDetailsModal';
import { AiMatcherPage } from './components/AiMatcherPage';
import { DashboardPage } from './components/DashboardPage';
import { CareerAdvisorPage } from './components/CareerAdvisorPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { SavedJobsDrawer } from './components/SavedJobsDrawer';
import { Footer } from './components/Footer';
import { NormalizedJob } from './types/job';
import { ChevronLeft, ChevronRight, RefreshCw, Briefcase, FilterX } from 'lucide-react';

function MainAppContent() {
  const { currentUser, userAccount } = useAuth();
  const [currentTab, setCurrentTab] = useState<ActiveTab>('jobs');

  // Filters state
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [dateRange, setDateRange] = useState('all');
  const [level, setLevel] = useState('All Levels');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
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
      params.append('limit', '24');

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
    setSelectedCategory('all');
    setSortBy('newest');
    setPage(1);
  };

  const scrollToJobs = () => {
    const el = document.getElementById('jobs-search-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter and sort jobs based on UI taxonomy and level
  const displayedJobs = React.useMemo(() => {
    let result = [...jobs];

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryKeywordsMap: Record<string, string[]> = {
        tech: ['software', 'developer', 'engineer', 'frontend', 'backend', 'fullstack', 'react', 'python', 'node', 'javascript', 'devops'],
        data: ['data', 'analyst', 'sql', 'machine learning', 'bi', 'analytics', 'tableau'],
        finance: ['finance', 'accounting', 'auditor', 'fintech', 'tax', 'accountant', 'banking'],
        grc: ['compliance', 'risk', 'grc', 'security', 'audit', 'legal', 'soc 2', 'gdpr'],
        product: ['product', 'design', 'ui', 'ux', 'marketing', 'content', 'growth', 'sales'],
        ops: ['operations', 'admin', 'hr', 'coordinator', 'recruiter', 'manager'],
      };
      const kws = categoryKeywordsMap[selectedCategory] || [];
      if (kws.length > 0) {
        result = result.filter((j) => {
          const text = `${j.title} ${j.description} ${j.skills.join(' ')}`.toLowerCase();
          return kws.some((kw) => text.includes(kw));
        });
      }
    }

    // Level filter
    if (level !== 'All Levels') {
      const lvl = level.toLowerCase();
      result = result.filter((j) => {
        const text = `${j.title} ${j.description} ${j.employmentType}`.toLowerCase();
        if (lvl.includes('entry') || lvl.includes('graduate')) {
          return text.includes('entry') || text.includes('junior') || text.includes('graduate') || text.includes('associate');
        }
        if (lvl.includes('mid')) {
          return text.includes('mid') || (!text.includes('senior') && !text.includes('director') && !text.includes('lead'));
        }
        if (lvl.includes('senior')) {
          return text.includes('senior') || text.includes('lead') || text.includes('principal') || text.includes('manager');
        }
        return true;
      });
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime());
    }

    return result;
  }, [jobs, selectedCategory, level, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
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
        {/* TAB 1: Real Vacancies Feed */}
        {currentTab === 'jobs' && (
          <div>
            <HeroSection
              onQuickAiMatch={() => setCurrentTab('ai-matcher')}
              onScrollToJobs={scrollToJobs}
            />

            <div id="jobs-search-section">
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
                selectedCategory={selectedCategory}
                setSelectedCategory={(cat) => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                sortBy={sortBy}
                setSortBy={setSortBy}
                jobs={jobs}
              />
            </div>

            {/* Live Feed Status Strip */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 text-[11px] text-slate-500 shadow-2xs">
                <div className="flex items-center gap-3">
                  {providersStatus.jobicy?.connected && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-slate-700">Active Source: Jobicy Remote API</span>
                    </div>
                  )}

                  {providersStatus.jooble?.configured && providersStatus.jooble?.connected && (
                    <>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-700">Jooble Nigeria Feed</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-emerald-700 font-bold">
                  {totalJobs > 0 ? `${totalJobs} Real Opportunities Available` : 'Searching Active Feeds...'}
                </div>
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Showing {displayedJobs.length > 0 ? (page - 1) * 12 + 1 : 0} -{' '}
                    {Math.min(page * 12, displayedJobs.length)} of {displayedJobs.length} opportunities
                  </span>
                  {isLoadingJobs && (
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  )}
                </div>

                {(keyword || location !== 'All Locations' || remoteOnly || selectedCategory !== 'all' || level !== 'All Levels') && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                  >
                    <FilterX className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>

              {isLoadingJobs && jobs.length === 0 ? (
                <div className="py-20 text-center">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">
                    Loading verified job opportunities...
                  </p>
                </div>
              ) : displayedJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    No Opportunities Found for this Search
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                    No current openings match your specific filters. Try broadening your search keywords or exploring remote options.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Reset Search Parameters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedJobs.slice((page - 1) * 12, page * 12).map((job) => (
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
              {Math.ceil(displayedJobs.length / 12) > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-4 pb-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-slate-800">Page {page}</span>
                    <span className="text-slate-400">of {Math.ceil(displayedJobs.length / 12)}</span>
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(Math.ceil(displayedJobs.length / 12), p + 1))}
                    disabled={page >= Math.ceil(displayedJobs.length / 12)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AI Job Discovery (Gemini AI) */}
        {currentTab === 'ai-matcher' && (
          <AiMatcherPage
            onSelectJob={(j) => setSelectedJob(j)}
            savedJobIds={savedJobIds}
            onToggleSave={toggleSaveJob}
          />
        )}

        {/* TAB 3: Career Mentor */}
        {currentTab === 'advisor' && <CareerAdvisorPage />}

        {/* TAB 4: My Dashboard */}
        {currentTab === 'dashboard' && (
          <DashboardPage
            savedJobs={savedJobs}
            onSelectJob={(j) => setSelectedJob(j)}
            onRemoveSaved={removeSavedJob}
            onGoToAiMatcher={() => setCurrentTab('ai-matcher')}
            onGoToJobs={() => setCurrentTab('jobs')}
          />
        )}

        {/* TAB 5: Admin Console (Only visible if admin role) */}
        {currentTab === 'admin' && userAccount?.role === 'admin' && <AdminDashboard />}
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
        onGoToDashboard={() => setCurrentTab('dashboard')}
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
