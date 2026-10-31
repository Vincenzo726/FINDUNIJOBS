import React from 'react';
import { Sparkles, ArrowDown, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onQuickAiMatch: () => void;
  onScrollToJobs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onQuickAiMatch, onScrollToJobs }) => {
  return (
    <section className="pt-10 sm:pt-14 pb-4 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Top Tag Pill matching screenshot reference */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider text-slate-700 bg-white border border-slate-200/90 mb-5 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-slate-700 uppercase font-bold">
          DEDICATED UNIVERSITY &amp; EARLY-CAREER JOB DISCOVERY
        </span>
      </div>

      {/* Homepage headline matching user specification:
          "Find the Right Job. Let AI Help You Get There." */}
      <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
        Find the Right Job.{' '}
        <span className="text-emerald-600">Let AI </span>
        <span className="relative inline-block text-emerald-600">
          Help You Get There
          <span className="absolute left-0 -bottom-1.5 w-full h-1.5 bg-amber-400 rounded-full" />
        </span>
      </h1>

      {/* Supporting description matching exact user brief */}
      <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
        Discover real job opportunities across Nigeria and beyond. Use intelligent AI-powered search
        to find internships, NYSC placements, graduate roles and employment opportunities that match
        your skills, experience and ambitions.
      </p>

      {/* Action Buttons: Primary 'Find Jobs', Secondary 'Explore with AI' */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
        <button
          onClick={onScrollToJobs}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <span>Find Jobs</span>
          <ArrowDown className="w-4 h-4 text-emerald-100" />
        </button>

        <button
          onClick={onQuickAiMatch}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Explore with AI</span>
        </button>
      </div>

      {/* Trust statement: "Real job sources. Smarter career discovery." */}
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>Real job sources. Smarter career discovery.</span>
      </div>
    </section>
  );
};
