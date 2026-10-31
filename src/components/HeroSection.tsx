import React from 'react';
import { Sparkles, ShieldCheck, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onQuickAiMatch: () => void;
  onOpenLocations: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onQuickAiMatch, onOpenLocations }) => {
  return (
    <section className="pt-10 pb-6 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Pill Badge matching screenshot */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider text-slate-700 bg-indigo-50/80 border border-indigo-200/90 mb-5 shadow-2xs">
        <span>NIGERIA'S DEDICATED UNIVERSITY & EARLY CAREER RECRUITMENT PLATFORM</span>
      </div>

      {/* Main Headline with exact styling and yellow underline on 'Search' */}
      <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
        Narrow Down Your Nigerian & Global{' '}
        <span className="text-indigo-600 font-black">UniJob</span>{' '}
        <span className="relative inline-block text-indigo-600 font-black">
          Search
          <span className="absolute left-0 -bottom-1.5 w-full h-1.5 bg-yellow-400 rounded-full" />
        </span>
      </h1>

      {/* Subtitle with Nigerian localization */}
      <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed mb-5">
        Connecting Nigerian university students, graduates, and NYSC corp members with real
        employment, internships, and remote opportunities across Lagos, Abuja, and global hubs.
      </p>

      {/* Verified Live API Notice */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-left mb-6">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Live Job Feeds Active:</strong> Aggregated from Jobicy Remote API and verified Nigerian employer submissions with genuine application links.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onQuickAiMatch}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Search with Gemini AI</span>
        </button>

        <button
          onClick={onOpenLocations}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Explore Nigerian Cities</span>
        </button>
      </div>
    </section>
  );
};
