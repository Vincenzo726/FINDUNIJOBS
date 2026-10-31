import React, { useState } from 'react';
import { Sparkles, Brain, CheckCircle2, AlertTriangle, ExternalLink, Bookmark, Building2, MapPin, RefreshCw, Send, Search } from 'lucide-react';
import { NormalizedJob, JobMatchResult, CandidateProfile } from '../types/job';
import { useAuth } from '../context/AuthContext';

interface AiMatcherPageProps {
  onSelectJob: (job: NormalizedJob) => void;
  savedJobIds: Set<string>;
  onToggleSave: (job: NormalizedJob) => void;
}

const SAMPLE_NIGERIAN_QUERIES = [
  'Junior backend developer or Node.js jobs in Lagos or remote',
  'Remote software engineering internships accepting Nigerian students',
  'Entry-level data analyst jobs requiring SQL and Python',
  'NYSC-friendly technology and developer opportunities in Nigeria',
  'Product design and UI/UX roles open to junior applicants in Africa',
];

export const AiMatcherPage: React.FC<AiMatcherPageProps> = ({
  onSelectJob,
  savedJobIds,
  onToggleSave,
}) => {
  const { candidateProfile, updateCandidateProfile } = useAuth();
  const [query, setQuery] = useState(
    'Junior software developer or data roles open to Nigerian applicants'
  );
  const [profile, setProfile] = useState<Partial<CandidateProfile>>({
    fullName: candidateProfile?.fullName || 'Ibrahim Adeleke',
    university: candidateProfile?.university || 'University of Lagos (UNILAG)',
    courseOfStudy: candidateProfile?.courseOfStudy || 'BSc Computer Science',
    academicLevel: candidateProfile?.academicLevel || 'Entry-level',
    skills: candidateProfile?.skills || ['Python', 'JavaScript', 'React', 'SQL', 'Git'],
    careerInterests: candidateProfile?.careerInterests || ['Backend Development', 'FinTech'],
    preferredLocations: candidateProfile?.preferredLocations || ['Lagos, Nigeria', 'Remote'],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<JobMatchResult[]>([]);
  const [searchSummary, setSearchSummary] = useState('');
  const [providersUsed, setProvidersUsed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleRunAiSearch = async (queryText?: string) => {
    const textToSearch = queryText || query;
    if (!textToSearch.trim()) {
      setError('Please enter a query or job preference.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/find-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSearch.trim(),
          profile,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setMatches(data.matches || []);
      setSearchSummary(data.searchSummary || '');
      setProvidersUsed(data.providersUsed || []);
      setHasSearched(true);
    } catch (err: any) {
      console.error('AI Search failed:', err);
      setError(err.message || 'AI job discovery could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>FJ CAREER AI DISCOVERY • POWERED BY GEMINI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          AI Opportunity Matcher
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Natural-language semantic job search. Our engine analyzes live job feeds from verified sources
          and ranks the most relevant opportunities against your qualifications and career ambitions.
        </p>

        {/* Quick Sample Queries */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1">Quick Prompts:</span>
          {SAMPLE_NIGERIAN_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                handleRunAiSearch(q);
              }}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Search & Candidate Profile Setup */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3">
              <Brain className="w-4 h-4 text-emerald-600" />
              <span>Search Prompt &amp; Candidate Context</span>
            </h2>

            {/* Natural language query */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                What opportunity are you searching for? *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <textarea
                  rows={2}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Find junior backend developer jobs in Lagos or remote that accept Nigerian candidates"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* University & Degree */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nigerian Institution
                </label>
                <input
                  type="text"
                  value={profile.university}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                  placeholder="e.g. UNILAG, UI, FUTA"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Course of Study
                </label>
                <input
                  type="text"
                  value={profile.courseOfStudy}
                  onChange={(e) => setProfile({ ...profile, courseOfStudy: e.target.value })}
                  placeholder="e.g. BSc Computer Science"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Level & Preferred Location */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Academic / Career Level
                </label>
                <select
                  value={profile.academicLevel}
                  onChange={(e) => setProfile({ ...profile, academicLevel: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="NYSC">NYSC Member</option>
                  <option value="Entry-level">Entry-level / Graduate</option>
                  <option value="Junior">Junior Professional</option>
                  <option value="Mid-level">Mid-level</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Primary Location
                </label>
                <input
                  type="text"
                  value={profile.preferredLocations?.[0] || 'Lagos, Nigeria'}
                  onChange={(e) =>
                    setProfile({ ...profile, preferredLocations: [e.target.value] })
                  }
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Your Technical &amp; Core Skills
              </label>
              <input
                type="text"
                value={(profile.skills || []).join(', ')}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="e.g. Python, SQL, React, Node.js"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Separate skills with commas. Evaluated against real job postings.
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => handleRunAiSearch()}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Opportunities with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Find Opportunities with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: AI Match Results Feed */}
        <div className="lg:col-span-7 space-y-4">
          {searchSummary && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">FJ Career AI Summary</p>
                <p className="leading-relaxed">{searchSummary}</p>
                {providersUsed.length > 0 && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    Live Feeds Queried: {providersUsed.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">
                Evaluating Live Feeds with Gemini AI...
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Scanning vacancies from active remote and Nigerian provider APIs to find the highest-scoring matches for your profile.
              </p>
            </div>
          ) : matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((item) => (
                <div
                  key={item.jobId}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3
                        onClick={() => onSelectJob(item.job)}
                        className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">{item.company}</span>
                        <span>·</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.job.location}</span>
                        {item.job.isRemote && (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                            Remote
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-600 leading-none">
                          {item.matchScore}%
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Match Score
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleSave(item.job)}
                        className={`p-2 rounded-lg cursor-pointer ${
                          savedJobIds.has(item.job.id)
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${savedJobIds.has(item.job.id) ? 'fill-emerald-600' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                    <strong className="text-slate-700">Why it matches: </strong>
                    {item.reason}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {item.matchingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {item.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500">
                      Source: {item.job.sourceAttribution}
                    </span>
                    <a
                      href={item.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors"
                    >
                      <span>Apply on Provider Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <Brain className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Matching Vacancies Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Try widening your prompt keywords or adjusting preferred locations to explore more opportunities.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <Sparkles className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Ready for AI Job Discovery
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-4">
                Enter your desired career focus on the left, or click one of the suggested prompts above to begin discovering opportunities matched to your exact profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
