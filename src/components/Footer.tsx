import React from 'react';
import { Sparkles, GraduationCap, AlertCircle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onGoToAiMatcher: () => void;
  onGoToJobs: () => void;
  onGoToAdvisor: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoToAiMatcher,
  onGoToJobs,
  onGoToAdvisor,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                FJ
              </div>
              <span className="text-white font-black text-base tracking-tight">
                Find UniJob
              </span>
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The premier capability-driven job discovery platform for university students, interns, and early-career talent worldwide.
            </p>
            <div className="text-[11px] text-indigo-400 font-semibold">
              Powered by Gemini 3.8 Flash AI Engine
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onGoToJobs}
                  className="hover:text-white transition-colors"
                >
                  Browse 300 University Vacancies
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToAiMatcher}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span>Gemini AI Matcher</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToAdvisor}
                  className="hover:text-white transition-colors"
                >
                  AI Career & CV Advisor
                </button>
              </li>
              <li>
                <span className="text-slate-500">Student Placement Schemes</span>
              </li>
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Key Sectors
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Software & Web Engineering</li>
              <li>Data Science, AI & Machine Learning</li>
              <li>Cybersecurity & Cloud Systems</li>
              <li>UI/UX Design & Product Strategy</li>
              <li>FinTech & Quantitative Analysis</li>
            </ul>
          </div>

          {/* Synthetic Data Notice */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Synthetic Demonstration Data</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Demonstration data: These 300 opportunities are synthetic and are not verified live vacancies. This application is an interactive showcase of university talent discovery and AI semantic matching.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google AI Studio Environment Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} FJ FindUniJob · All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Guidelines</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Student Terms</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Demonstration Scope</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
