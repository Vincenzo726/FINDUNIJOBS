import React from 'react';
import { Sparkles, ShieldCheck, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onQuickAiMatch: () => void;
  onOpenLocations: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onQuickAiMatch, onOpenLocations }) => {
  return (
    <section className="pt-12 pb-6 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Tag Pill matching 'THE WORLD'S FIRST DEDICATED GRC JOB PLATFORM' */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider text-slate-700 bg-white border border-slate-200 mb-6 shadow-2xs uppercase">
        <span>THE WORLD'S DEDICATED UNIVERSITY & EARLY CAREER PLATFORM</span>
      </div>

      {/* Main Headline matching screenshot: 'Narrow Down Your Global GRC Job Search' */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
        Narrow Down Your Global{' '}
        <span className="text-indigo-600 font-black">UniJob </span>
        <span className="relative inline-block text-indigo-600 font-black">
          Search
          <span className="absolute left-0 -bottom-1.5 w-full h-1.5 bg-yellow-400 rounded-full" />
        </span>
      </h1>

      {/* Subtitle matching screenshot tone and length */}
      <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
        Welcome to the dedicated university and early-career job discovery platform.
        We strictly index and classify graduate schemes, NYSC placements, internships, and early-career opportunities.
        A free capability-driven tool for students, fresh graduates, and career builders.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onQuickAiMatch}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Semantic AI Job Match</span>
        </button>

        <button
          onClick={onOpenLocations}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Explore Regional Locations</span>
        </button>
      </div>
    </section>
  );
};
