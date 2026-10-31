import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { NormalizedJob } from '../types/job';

interface SearchAndFiltersProps {
  keyword: string;
  setKeyword: (kw: string) => void;
  location: string;
  setLocation: (loc: string) => void;
  dateRange: string;
  setDateRange: (dr: string) => void;
  level: string;
  setLevel: (lvl: string) => void;
  remoteOnly: boolean;
  setRemoteOnly: (ro: boolean) => void;
  onSearch: () => void;
  totalJobs: number;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
  jobs?: NormalizedJob[];
}

export const TAXONOMY_CATEGORIES = [
  { id: 'all', label: 'All Opportunities', keywords: [] },
  { id: 'tech', label: 'Software & Technology', keywords: ['software', 'developer', 'engineer', 'frontend', 'backend', 'fullstack', 'react', 'python', 'node', 'javascript', 'devops'] },
  { id: 'data', label: 'Data Science & Analytics', keywords: ['data', 'analyst', 'sql', 'machine learning', 'bi', 'analytics', 'tableau'] },
  { id: 'finance', label: 'Banking, Finance & Fintech', keywords: ['finance', 'accounting', 'auditor', 'fintech', 'tax', 'accountant', 'banking'] },
  { id: 'grc', label: 'Governance, Risk & Compliance', keywords: ['compliance', 'risk', 'grc', 'security', 'audit', 'legal', 'soc 2', 'gdpr'] },
  { id: 'product', label: 'Product, Design & Growth', keywords: ['product', 'design', 'ui', 'ux', 'marketing', 'content', 'growth', 'sales'] },
  { id: 'ops', label: 'Operations & Business Support', keywords: ['operations', 'admin', 'hr', 'coordinator', 'recruiter', 'manager'] },
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  keyword,
  setKeyword,
  location,
  setLocation,
  dateRange,
  setDateRange,
  level,
  setLevel,
  remoteOnly,
  setRemoteOnly,
  onSearch,
  totalJobs,
  selectedCategory,
  setSelectedCategory,
  sortBy = 'newest',
  setSortBy,
  jobs = [],
}) => {
  const levels = [
    'All Levels',
    'Entry-Level',
    'Mid-Level',
    'Senior & Executive',
  ];

  const nigerianLocations = [
    'All Locations',
    'Lagos, Nigeria',
    'Abuja, Nigeria',
    'Ibadan, Nigeria',
    'Port Harcourt, Nigeria',
    'Benin City, Nigeria',
    'Enugu, Nigeria',
    'Abeokuta, Nigeria',
    'Remote (Worldwide)',
    'Remote (Nigeria)',
  ];

  // Calculate live dynamic counts for each category
  const getCategoryCount = (catId: string, keywords: string[]) => {
    if (catId === 'all') return totalJobs;
    if (jobs.length === 0) return 0;
    return jobs.filter((j) => {
      const text = `${j.title} ${j.description} ${j.skills.join(' ')}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    }).length;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Search and Filters Card matching screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        {/* Top Row: Search Input + 3 Dropdowns + Submit Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 mb-4">
          {/* Keyword Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch();
              }}
              placeholder="Search jobs, companies, skills or career opportunities..."
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Locations Dropdown */}
          <div className="md:col-span-3 relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter jobs by location"
              className="w-full pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-700 appearance-none focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {nigerianLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc} {loc === 'All Locations' ? `(${totalJobs})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dates Dropdown */}
          <div className="md:col-span-2 relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              aria-label="Filter jobs by date range"
              className="w-full pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-700 appearance-none focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">All Dates (24h-30d)</option>
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy && setSortBy(e.target.value)}
              aria-label="Sort jobs"
              className="w-full pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-700 appearance-none focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="relevance">Sort: Most Relevant</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Action */}
          <div className="md:col-span-1">
            <button
              onClick={onSearch}
              className="w-full h-full min-h-[38px] py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Levels Filter Buttons + Remote Only Checkbox */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Level Buttons matching screenshot */}
          <div className="flex flex-wrap items-center gap-2">
            {levels.map((lvl) => {
              const isActive = level === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Show Only Remote Roles checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none hover:text-slate-900">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span>Show Only Remote Roles</span>
          </label>
        </div>
      </div>

      {/* Role Taxonomy Section matching screenshot */}
      <div className="pt-2">
        <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2.5">
          CAREER ROLE TAXONOMY
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {TAXONOMY_CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id, cat.keywords);
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive
                      ? 'bg-emerald-700/90 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
