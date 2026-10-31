import React from 'react';
import { Briefcase, Sparkles, LayoutDashboard, Bookmark, GraduationCap, Building, ShieldAlert, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: 'jobs' | 'ai-matcher' | 'dashboard' | 'advisor' | 'employer' | 'admin';
  setCurrentTab: (tab: 'jobs' | 'ai-matcher' | 'dashboard' | 'advisor' | 'employer' | 'admin') => void;
  savedJobsCount: number;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenSavedDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  savedJobsCount,
  onOpenAuthModal,
  onOpenSavedDrawer,
}) => {
  const { currentUser, userAccount, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity matching the user screenshot */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('jobs')}
            className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
          >
            {/* Logo Badge Icon */}
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-lg shadow-xs group-hover:border-indigo-400 transition-colors">
              <span className="font-extrabold text-indigo-600">FJ</span>
            </div>

            {/* Logo Name & Yellow Dot */}
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Find UniJob
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </button>

          {/* Sub-badge pill matching BY INEGBEN ACADEMY from screenshot */}
          <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-indigo-50/80 text-indigo-700 border border-indigo-200">
            NIGERIAN TALENT ALLIANCE
          </div>
        </div>

        {/* Central Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setCurrentTab('jobs')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentTab === 'jobs'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Explore Jobs</span>
          </button>

          <button
            onClick={() => setCurrentTab('ai-matcher')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 relative cursor-pointer ${
              currentTab === 'ai-matcher'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin-slow" />
            <span>AI Job Discovery</span>
            <span className="px-1.5 py-0.2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] rounded-full font-bold uppercase">
              Gemini
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Candidate Hub</span>
          </button>

          <button
            onClick={() => setCurrentTab('advisor')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentTab === 'advisor'
                ? 'text-indigo-600 border-indigo-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Career Mentor</span>
          </button>

          {/* Employer Tab */}
          {(userAccount?.role === 'employer' || userAccount?.role === 'admin') && (
            <button
              onClick={() => setCurrentTab('employer')}
              className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
                currentTab === 'employer'
                  ? 'text-indigo-600 border-indigo-600 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Employer Hub</span>
            </button>
          )}

          {/* Admin Tab */}
          {userAccount?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
                currentTab === 'admin'
                  ? 'text-indigo-600 border-indigo-600 font-semibold'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              <span>Admin Console</span>
            </button>
          )}
        </nav>

        {/* Right Area: Auth & Action */}
        <div className="flex items-center gap-3">
          {/* Hire Vetted Graduates CTA matching screenshot button */}
          <button
            onClick={() => {
              if (currentUser) {
                setCurrentTab('employer');
              } else {
                onOpenAuthModal('register');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-bold text-xs transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Hire Vetted Graduates</span>
          </button>

          {/* Saved Jobs Shortcut */}
          <button
            onClick={onOpenSavedDrawer}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            title="Saved Opportunities"
          >
            <Bookmark className="w-5 h-5" />
            {savedJobsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-xs">
                {savedJobsCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {userAccount?.fullName || currentUser.email}
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold uppercase">
                  {userAccount?.role === 'admin'
                    ? 'Administrator'
                    : userAccount?.role === 'employer'
                    ? 'Employer'
                    : 'Job Seeker'}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub Navigation */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 py-2 bg-slate-50 text-xs font-medium">
        <button
          onClick={() => setCurrentTab('jobs')}
          className={`px-2.5 py-1 rounded-md ${currentTab === 'jobs' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          Explore Jobs
        </button>
        <button
          onClick={() => setCurrentTab('ai-matcher')}
          className={`px-2.5 py-1 rounded-md ${currentTab === 'ai-matcher' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          AI Matcher
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-2.5 py-1 rounded-md ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          Candidate Hub
        </button>
        <button
          onClick={() => setCurrentTab('advisor')}
          className={`px-2.5 py-1 rounded-md ${currentTab === 'advisor' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
        >
          Career Advice
        </button>
        {userAccount?.role === 'employer' && (
          <button
            onClick={() => setCurrentTab('employer')}
            className={`px-2.5 py-1 rounded-md ${currentTab === 'employer' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Post Job
          </button>
        )}
        {userAccount?.role === 'admin' && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-2.5 py-1 rounded-md ${currentTab === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-600'}`}
          >
            Admin
          </button>
        )}
      </div>
    </header>
  );
};
