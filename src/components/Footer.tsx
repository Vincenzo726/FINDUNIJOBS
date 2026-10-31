import React, { useState } from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

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
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-2">
              <Logo variant="dark" size="md" />
            </div>

            <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              Find Opportunities. Build Your Future.
            </p>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Helping Nigerian students, graduates and professionals discover meaningful career
              opportunities through intelligent job discovery and AI-guided career navigation.
            </p>

            <div className="text-[11px] text-slate-500 pt-1">
              <span>National Career Network: Lagos • Abuja • Ibadan • Remote</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onGoToJobs}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Find Jobs
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToAiMatcher}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  AI Job Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToAdvisor}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Career Mentor
                </button>
              </li>
              <li>
                <button
                  onClick={onGoToDashboard || onGoToJobs}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  My Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Information / Support */}
          <div className="md:col-span-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Information &amp; Trust
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setLegalModal('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  About FJ FindUniJob
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy (NDPA &amp; NDPR)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Contact &amp; Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 FJ FindUniJob. All rights reserved.
          </div>
          <div className="text-slate-500 flex items-center gap-1.5">
            <span>Find Opportunities. Build Your Future.</span>
          </div>
        </div>
      </div>

      {/* Info Dialog Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {legalModal === 'about' && 'About FJ FindUniJob'}
              {legalModal === 'privacy' && 'Privacy Policy'}
              {legalModal === 'terms' && 'Terms of Service'}
              {legalModal === 'contact' && 'Contact & Support'}
            </h3>

            <div className="text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto space-y-2.5 pr-2">
              {legalModal === 'about' && (
                <>
                  <p>
                    <strong>FJ FindUniJob</strong> is a dedicated job discovery and AI career assistant
                    platform built for Nigerian university students, undergraduates, NYSC corp members,
                    recent graduates, and early-career professionals.
                  </p>
                  <p>
                    We strictly index verified job vacancies, internships, and remote opportunities
                    from trusted global and Nigerian job feeds. We do not charge job seekers for discovering
                    or applying to vacancies.
                  </p>
                </>
              )}

              {legalModal === 'privacy' && (
                <>
                  <p>
                    FJ FindUniJob is strictly committed to protecting candidate personal data in full
                    compliance with the Nigeria Data Protection Act (NDPA) and NDPR regulations.
                  </p>
                  <p>
                    Candidate profile information, qualifications, skills, and saved jobs are stored
                    securely. We never sell your personal data or share CVs without your explicit consent.
                  </p>
                </>
              )}

              {legalModal === 'terms' && (
                <>
                  <p>
                    By using FJ FindUniJob, users agree to utilize the platform for legitimate educational,
                    career advancement, and job discovery purposes.
                  </p>
                  <p>
                    All vacancies display original provider attributions and direct application links to
                    official employer or partner portals.
                  </p>
                </>
              )}

              {legalModal === 'contact' && (
                <>
                  <p>
                    Have questions, feedback, or need help discovering opportunities?
                  </p>
                  <p className="font-semibold text-slate-800">
                    Email: support@findunijob.org
                  </p>
                  <p>
                    Location: Victoria Island, Lagos, Nigeria.
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
