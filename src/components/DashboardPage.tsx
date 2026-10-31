import React, { useState } from 'react';
import { Bookmark, Sparkles, Briefcase, MapPin, ExternalLink, GraduationCap, User, Bell, CheckCircle2, Trash2 } from 'lucide-react';
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
  const [university, setUniversity] = useState(candidateProfile?.university || 'University of Lagos');
  const [course, setCourse] = useState(candidateProfile?.courseOfStudy || 'Computer Science');
  const [qualification, setQualification] = useState(candidateProfile?.qualification || 'BSc');
  const [level, setLevel] = useState(candidateProfile?.academicLevel || 'Entry-level');
  const [skillsText, setSkillsText] = useState((candidateProfile?.skills || ['Python', 'SQL', 'React']).join(', '));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Job alerts
  const [alerts, setAlerts] = useState<Array<{ id: string; keyword: string; location: string }>>([
    { id: '1', keyword: 'Junior Backend Developer', location: 'Lagos, Nigeria' },
    { id: '2', keyword: 'Data Analyst Internship', location: 'Remote (Worldwide)' },
  ]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newLocation, setNewLocation] = useState('Lagos, Nigeria');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCandidateProfile({
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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Nigerian Candidate & NYSC Career Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Welcome, {userAccount?.fullName || currentUser?.displayName || 'Job Seeker'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Manage your persistent candidate qualifications, review your saved live opportunities, and configure automated opportunity alerts for the Nigerian market.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToAiMatcher}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Launch AI Matcher</span>
            </button>
            <button
              onClick={onGoToJobs}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Real Vacancies</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile saved successfully to Firestore database.</span>
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
                <Bookmark className="w-5 h-5 text-indigo-600" />
                <span>Saved Opportunities ({savedJobs.length})</span>
              </h2>
              {savedJobs.length > 0 && (
                <span className="text-xs text-slate-400">Synced to your account</span>
              )}
            </div>

            {savedJobs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No Saved Jobs Yet</p>
                <p className="text-slate-400 mt-1">
                  Click the bookmark icon on any real job listing to save it here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div>
                      <h3
                        onClick={() => onSelectJob(job)}
                        className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer"
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
                        className="px-2.5 py-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        Remove
                      </button>

                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-2xs"
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
                <Bell className="w-5 h-5 text-indigo-600" />
                <span>Job Alerts & Preferences</span>
              </h2>
              <span className="text-xs text-slate-400">Stored in Firestore</span>
            </div>

            <form onSubmit={handleAddAlert} className="flex flex-col sm:flex-row gap-2 mb-4 text-xs">
              <input
                type="text"
                placeholder="Alert keyword (e.g. Flutter, NYSC, UI/UX, Lagos)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
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
                className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Create Alert
              </button>
            </form>

            <div className="space-y-2 text-xs">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{al.keyword}</span>
                    <span className="text-slate-400">in</span>
                    <span className="text-indigo-700 font-medium">{al.location}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAlert(al.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Candidate Profile Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {userAccount?.fullName || 'Candidate Profile'}
                  </h3>
                  <span className="text-[10px] text-indigo-600 font-semibold uppercase">
                    {userAccount?.role || 'Job Seeker'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                {editingProfile ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {!editingProfile ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Institution</span>
                  <span className="font-semibold text-slate-800">{university}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Degree</span>
                  <span className="font-semibold text-slate-800">{qualification} {course}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Level</span>
                  <span className="font-semibold text-indigo-700">{level}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Key Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {skillsText.split(',').map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course of Study</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Qualification</label>
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="BSc">BSc</option>
                      <option value="BEng">BEng</option>
                      <option value="HND">HND</option>
                      <option value="ND">ND</option>
                      <option value="BA">BA</option>
                      <option value="MSc">MSc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="NYSC">NYSC Member</option>
                      <option value="Entry-level">Entry-level</option>
                      <option value="Junior">Junior</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                >
                  Save Profile to Database
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
