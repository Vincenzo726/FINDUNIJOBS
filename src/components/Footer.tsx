import React, { useState } from 'react';

interface FooterProps {
  onGoToAiMatcher: () => void;
  onGoToJobs: () => void;
  onGoToAdvisor: () => void;
  onGoToDashboard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoToAiMatcher,
  onGoToJobs,
  onGoToAdvisor,
  onGoToDashboard,
}) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                FJ
              </div>
              <span className="text-white font-black text-base tracking-tight">
                FJ FindUniJob
              </span>
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Connecting Nigerian students, graduates and early-career professionals with meaningful employment opportunities.
            </p>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onGoToJobs}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Explore Jobs
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToAiMatcher}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Job Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToAdvisor}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Career Mentor
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToDashboard || onGoToJobs}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Candidate Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            Copyright © 2026 FJ FindUniJob. All rights reserved.
          </div>
          <div className="text-slate-500">
            Dedicated recruitment & opportunity discovery for Nigerian talent.
          </div>
        </div>
      </div>

      {/* Legal Dialog Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto space-y-2 pr-2">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    FJ FindUniJob is committed to protecting candidate personal information in compliance with the Nigeria Data Protection Act (NDPA) and NDPR guidelines.
                  </p>
                  <p>
                    Candidate profile details, qualifications, and saved job preferences are stored securely. We do not sell your personal data or share CVs without your explicit consent.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    By using FJ FindUniJob, candidates and recruiters agree to use the platform for legitimate educational, recruitment, and career discovery activities.
                  </p>
                  <p>
                    All external job vacancies are provided with original source attributions and direct links to official employer or partner portals.
                  </p>
                </>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
