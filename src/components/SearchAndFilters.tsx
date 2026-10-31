import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

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
}

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
}) => {
  const levels = [
    'All Levels',
    'Undergraduate / Intern',
    'NYSC Scheme',
    'Graduate / Entry-Level',
    'Junior / Mid-Level',
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
    'Remote (Nigeria)',
    'Remote (Worldwide)',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4">
        {/* Top Row: Search Input + 3 Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 mb-3.5">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch();
              }}
              placeholder="Search real jobs (e.g. Software, React, Python, Data Analyst, NYSC...)"
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Locations Dropdown */}
          <div className="md:col-span-3 relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter jobs by location"
              className="w-full pl-3 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
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
              className="w-full pl-3 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-700 appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Trigger Button */}
          <div className="md:col-span-2">
            <button
              onClick={onSearch}
              className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Search Live Feeds
            </button>
          </div>
        </div>

        {/* Bottom Row: Levels Filter Buttons + Remote Only Checkbox */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Level Buttons matching screenshot buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {levels.map((lvl) => {
              const isActive = level === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
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
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span>Show Only Remote Roles</span>
          </label>
        </div>
      </div>
    </div>
  );
};
