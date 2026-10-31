import React, { useState, useEffect } from 'react';
import { PlusCircle, Building, CheckCircle2, Clock, AlertCircle, ExternalLink, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NormalizedJob } from '../types/job';

export const EmployerDashboard: React.FC = () => {
  const { currentUser, userAccount } = useAuth();
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    companyName: userAccount?.fullName || '',
    location: 'Lagos, Nigeria',
    employmentType: 'Full-time',
    salary: '',
    currency: '₦',
    skills: '',
    description: '',
    applicationUrl: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const fetchEmployerJobs = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/employer/jobs?employerId=${currentUser.uid}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to load employer jobs', err);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        employerId: currentUser.uid,
        companyName: formData.companyName || 'Verified Employer',
        title: formData.title,
        description: formData.description,
        location: formData.location,
        employmentType: formData.employmentType,
        salary: formData.salary || null,
        currency: formData.currency,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        applicationUrl: formData.applicationUrl,
      };

      const res = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');

      setMessage('Opportunity submitted successfully! It is now pending administrator review.');
      setShowPostForm(false);
      setFormData({
        title: '',
        companyName: userAccount?.fullName || '',
        location: 'Lagos, Nigeria',
        employmentType: 'Full-time',
        salary: '',
        currency: '₦',
        skills: '',
        description: '',
        applicationUrl: '',
      });
      fetchEmployerJobs();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Opportunity Submission Portal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manage Vacancy Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit verified opportunities open to Nigerian students, interns, NYSC members, and early-career talent.
          </p>
        </div>

        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showPostForm ? 'Close Form' : 'Post New Vacancy'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Post Job Form */}
      {showPostForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Create Opportunity Listing</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graduate Trainee Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paystack, Flutterwave, Interswitch"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                  <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                  <option value="Ibadan, Nigeria">Ibadan, Nigeria</option>
                  <option value="Port Harcourt, Nigeria">Port Harcourt, Nigeria</option>
                  <option value="Benin City, Nigeria">Benin City, Nigeria</option>
                  <option value="Remote (Nigeria)">Remote (Nigeria)</option>
                  <option value="Remote (Worldwide)">Remote (Worldwide)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Graduate Trainee">Graduate Trainee</option>
                  <option value="NYSC Scheme">NYSC Scheme</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Salary & Currency (Optional)</label>
                <div className="flex gap-2">
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-20 px-2 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="₦">₦ (NGN)</option>
                    <option value="$">$ (USD)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="€">€ (EUR)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="e.g. 250,000 - 350,000 / mo"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Skills (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, SQL, React, Data Analysis"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Application URL (Direct Employer Portal) *</label>
              <input
                type="url"
                required
                placeholder="https://careers.yourcompany.com/apply/123"
                value={formData.applicationUrl}
                onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Description & Responsibilities *</label>
              <textarea
                required
                rows={4}
                placeholder="Provide accurate specifications, requirements, and qualifications for early-career Nigerian talent..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
              >
                {loading ? 'Submitting...' : 'Submit Vacancy for Approval'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Submitted Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Your Submitted Vacancies ({jobs.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Subject to administrator moderation
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>You haven't posted any vacancies yet.</p>
            <p className="mt-1">Click "Post New Vacancy" above to add opportunities for Nigerian talent.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        job.employerStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : job.employerStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {job.employerStatus || 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{job.employmentType}</span>
                    {job.salary && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">{job.salary}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <span>Application Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
