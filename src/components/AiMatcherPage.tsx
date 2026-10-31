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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>REAL-TIME GEMINI 3.8 FLASH DISCOVERY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          AI Nigerian & Remote Job Matcher
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Natural-language AI job search powered by Google Gemini. Our engine searches live feeds from Jobicy and Nigerian job providers, extracting genuine vacancies that match your qualifications.
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
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Search & Candidate Profile Setup */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>Search Prompt & Profile Context</span>
            </h2>

            {/* Natural language query */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                What kind of job are you looking for? *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <textarea
                  rows={2}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Find junior backend developer jobs in Lagos or remote that accept Nigerian candidates"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
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
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
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
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
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
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
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
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                Your Technical & Core Skills
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Separate skills with commas. Gemini evaluates these against live job requirements.
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
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Opportunities with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Find My Best Job Matches</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results or Loading */}
        <div className="lg:col-span-7">
          {isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center min-h-[440px] flex flex-col items-center justify-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4">
                <Brain className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Searching Available Vacancies
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
                Querying active opportunity feeds and evaluating role compatibility with your profile...
              </p>
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating skill relevance and qualifications</span>
              </div>
            </div>
          )}

          {!isLoading && !hasSearched && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center min-h-[440px] flex flex-col items-center justify-center shadow-xs">
              <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Ready for AI Job Discovery
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                Enter your desired role or choose a prompt to search live opportunities. Every recommendation corresponds to a genuine live job vacancy.
              </p>
              <button
                onClick={() => handleRunAiSearch()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Search Live Opportunities</span>
              </button>
            </div>
          )}

          {!isLoading && hasSearched && matches.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center min-h-[380px] flex flex-col items-center justify-center shadow-xs">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Vacancies Returned</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                The external job providers currently returned no open vacancies for this exact query. Try broadening your keywords (e.g. "Software Developer" or "Analyst").
              </p>
            </div>
          )}

          {!isLoading && hasSearched && matches.length > 0 && (
            <div className="space-y-4">
              {/* Summary */}
              {searchSummary && (
                <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs">
                  <span className="font-bold text-indigo-900 block mb-1">
                    AI Match Summary:
                  </span>
                  <p className="text-indigo-950 leading-relaxed">{searchSummary}</p>
                  <div className="mt-2 pt-2 border-t border-indigo-200/60 flex items-center justify-between text-[11px] text-indigo-700">
                    <span>Source: {providersUsed.filter((p) => !p.includes('key')).join(', ') || 'Live Feed'}</span>
                    <span className="font-semibold">{matches.length} Matched Opportunities</span>
                  </div>
                </div>
              )}

              {/* Match Cards */}
              <div className="space-y-3.5">
                {matches.map((match) => {
                  const job = match.job;
                  const isSaved = savedJobIds.has(job.id);

                  return (
                    <div
                      key={match.jobId}
                      className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 p-5 transition-all shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3
                            onClick={() => onSelectJob(job)}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                          >
                            {match.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">{match.company}</span>
                            <span>·</span>
                            <span>{job.location}</span>
                            {job.salary && (
                              <>
                                <span>·</span>
                                <span className="text-emerald-700 font-semibold">{job.salary}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{match.matchScore}% Match</span>
                        </div>
                      </div>

                      {/* Reason */}
                      <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed mb-3">
                        <strong className="text-indigo-900">Why this matches: </strong>
                        {match.reason}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap items-center gap-1 mb-3 text-xs">
                        {match.matchingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium text-[11px]"
                          >
                            ✓ {s}
                          </span>
                        ))}
                        {match.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100 font-medium text-[11px]"
                          >
                            +{s}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">
                          Source: {job.sourceAttribution}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleSave(job)}
                            className={`p-1.5 rounded-lg flex items-center gap-1 ${
                              isSaved ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600' : ''}`} />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                          </button>

                          <a
                            href={match.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs"
                          >
                            <span>Apply on Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
