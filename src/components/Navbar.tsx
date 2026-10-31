import React from 'react';
import { Briefcase, Sparkles, LayoutDashboard, Bookmark, GraduationCap, LogIn, LogOut, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

export type ActiveTab = 'jobs' | 'ai-matcher' | 'advisor' | 'dashboard' | 'admin';

interface NavbarProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
        {/* Brand identity with new Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('jobs')}
            className="flex items-center group text-left focus:outline-none cursor-pointer"
          >
            <Logo variant="horizontal" size="md" />
          </button>

          {/* Sub-badge pill matching the screenshot's 'BY INEGBEN ACADEMY' position */}
          <div className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200">
            NIGERIAN CAREER ALLIANCE
          </div>
        </div>

        {/* Central Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <button
            onClick={() => setCurrentTab('jobs')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentTab === 'jobs'
                ? 'text-emerald-700 border-emerald-600 font-bold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Find Jobs</span>
          </button>

          <button
            onClick={() => setCurrentTab('ai-matcher')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentTab === 'ai-matcher'
                ? 'text-emerald-700 border-emerald-600 font-bold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Job Discovery</span>
            <span className="px-1.5 py-0.2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] rounded-full font-bold uppercase">
              Gemini
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('advisor')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentTab === 'advisor'
                ? 'text-emerald-700 border-emerald-600 font-bold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Career Mentor</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-1.5 transition-colors pb-1 border-b-2 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'text-emerald-700 border-emerald-600 font-bold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>My Dashboard</span>
          </button>
        </nav>

        {/* Right Area: Saved Jobs & Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Saved Jobs Shortcut */}
          <button
            onClick={onOpenSavedDrawer}
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-xl relative transition-colors cursor-pointer"
            title="Saved Opportunities"
          >
            <Bookmark className="w-5 h-5" />
            {savedJobsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-xs">
                {savedJobsCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                  {(userAccount?.fullName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {userAccount?.fullName || currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    Member
                  </span>
                </div>
              </button>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 py-2 bg-slate-50/80 text-xs font-medium">
        <button
          onClick={() => setCurrentTab('jobs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            currentTab === 'jobs' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Find Jobs
        </button>
        <button
          onClick={() => setCurrentTab('ai-matcher')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            currentTab === 'ai-matcher' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          AI Match
        </button>
        <button
          onClick={() => setCurrentTab('advisor')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            currentTab === 'advisor' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mentor
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            currentTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dashboard
        </button>
      </div>
    </header>
  );
};
