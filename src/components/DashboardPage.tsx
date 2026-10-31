import React, { useState } from 'react';
import { Bookmark, Sparkles, Briefcase, MapPin, ExternalLink, GraduationCap, User, Bell, CheckCircle2, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import { NormalizedJob } from '../types/job';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
  savedJobs: NormalizedJob[];
  onSelectJob: (job: NormalizedJob) => void;
  onRemoveSaved: (jobId: string) => void;
  onGoToAiMatcher: () => void;
  onGoToJobs: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  savedJobs,
  onSelectJob,
  onRemoveSaved,
  onGoToAiMatcher,
  onGoToJobs,
}) => {
  const { currentUser, userAccount, candidateProfile, updateCandidateProfile } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(candidateProfile?.fullName || userAccount?.fullName || '');
  const [university, setUniversity] = useState(candidateProfile?.university || 'University of Lagos');
  const [course, setCourse] = useState(candidateProfile?.courseOfStudy || 'Computer Science');
  const [qualification, setQualification] = useState(candidateProfile?.qualification || 'BSc');
  const [level, setLevel] = useState(candidateProfile?.academicLevel || 'Entry-level');
  const [skillsText, setSkillsText] = useState((candidateProfile?.skills || ['Python', 'SQL', 'FastAPI', 'Problem Solving']).join(', '));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Job alerts
  const [alerts, setAlerts] = useState<Array<{ id: string; keyword: string; location: string }>>([
    { id: '1', keyword: 'Junior Backend Developer', location: 'Lagos, Nigeria' },
    { id: '2', keyword: 'Data Analyst Internship', location: 'Remote (Worldwide)' },
    { id: '3', keyword: 'Graduate Trainee', location: 'Nigeria' },
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newLocation, setNewLocation] = useState('Lagos, Nigeria');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCandidateProfile({
      fullName,
      university,
      courseOfStudy: course,
      qualification: qualification as any,
      academicLevel: level as any,
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    setAlerts([...alerts, { id: String(Date.now()), keyword: newKeyword.trim(), location: newLocation }]);
    setNewKeyword('');
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>My Career Hub &amp; Discovery Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Welcome, {userAccount?.fullName || currentUser?.displayName || 'Job Seeker'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Track your saved opportunities, refine your academic skills profile for intelligent AI matching,
            and monitor personalized opportunity alerts.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToAiMatcher}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch AI Matcher</span>
            </button>
            <button
              onClick={onGoToJobs}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Find Opportunities</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile saved successfully.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Saved Opportunities & Job Alerts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Saved Opportunities */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-emerald-600" />
                <span>Saved Opportunities ({savedJobs.length})</span>
              </h2>
              {savedJobs.length > 0 && (
                <span className="text-xs text-slate-400">Synced to your profile</span>
              )}
            </div>

            {savedJobs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No Saved Jobs Yet</p>
                <p className="text-slate-400 mt-1">
                  Click the bookmark icon on any real job opportunity to save it here for fast application.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div>
                      <h3
                        onClick={() => onSelectJob(job)}
                        className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer"
                      >
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">{job.company}</span>
                        <span>·</span>
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                        {job.salary && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold">{job.salary}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveSaved(job.id)}
                        className="px-2.5 py-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>

                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Alerts Manager */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span>Opportunity Alerts &amp; Trackers</span>
              </h2>
              <span className="text-xs text-slate-400">Instant Notification</span>
            </div>

            <form onSubmit={handleAddAlert} className="flex flex-col sm:flex-row gap-2 mb-4 text-xs">
              <input
                type="text"
                placeholder="Alert keyword (e.g. Flutter, NYSC, UI/UX, Lagos)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none"
              >
                <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                <option value="Remote (Worldwide)">Remote (Worldwide)</option>
                <option value="Nigeria">Any Location in Nigeria</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Create Alert
              </button>
            </form>

            <div className="space-y-2 text-xs">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{al.keyword}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{al.location}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAlert(al.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Candidate Career Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Candidate Profile</span>
              </h2>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">University / Polytechnic</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Course of Study</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Degree</label>
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value as any)}
                      className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="BSc">BSc</option>
                      <option value="HND">HND</option>
                      <option value="BEng">BEng</option>
                      <option value="BA">BA</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="MSc">MSc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Stage</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="NYSC">NYSC</option>
                      <option value="Entry-level">Entry-level</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid-level">Mid-level</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">
                    Skills (comma separated)
                  </label>
                  <textarea
                    rows={3}
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Full Name
                  </span>
                  <p className="font-bold text-slate-800 text-sm">
                    {candidateProfile?.fullName || userAccount?.fullName || 'Job Seeker'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Academic Background
                  </span>
                  <p className="font-semibold text-slate-700">
                    {candidateProfile?.university || university}
                  </p>
                  <p className="text-slate-500">
                    {candidateProfile?.courseOfStudy || course} ({candidateProfile?.qualification || qualification})
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Career Stage
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200 mt-1">
                    {candidateProfile?.academicLevel || level}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1.5">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(candidateProfile?.skills || ['Python', 'SQL', 'FastAPI']).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>NDPA Privacy Compliant</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
