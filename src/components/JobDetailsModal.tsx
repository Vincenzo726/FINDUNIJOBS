import React from 'react';
import { X, MapPin, Building2, Bookmark, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { NormalizedJob } from '../types/job';

interface JobDetailsModalProps {
  job: NormalizedJob | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (job: NormalizedJob) => void;
  onRunAiMatch: (job: NormalizedJob) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onRunAiMatch,
}) => {
  if (!isOpen || !job) return null;

  const companyInitials = job.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'JB';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div className="flex items-start gap-4">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-13 h-13 rounded-xl border border-slate-200 object-contain p-1.5 shrink-0 bg-white shadow-xs"
                onError={(e) => {
                  (e.currentTarget as any).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-13 h-13 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                {companyInitials}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {job.employmentType}
                </span>
                {job.isRemote && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Remote Eligible
                  </span>
                )}
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {job.sourceAttribution}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {job.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{job.company}</span>
                <span>·</span>
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{job.location}</span>
                {job.salary && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">{job.salary}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Attribution Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Verified Job Opportunity</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Indexed from <strong>{job.sourceAttribution}</strong>. Clicking "Apply on Official Portal" redirects directly to the employer or partner application website.
              </p>
            </div>
          </div>

          {/* Role Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              Job Description & Details
            </h4>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {job.description}
            </div>
          </div>

          {/* Skills if present */}
          {job.skills.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2.5">
                Target Sectors & Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(job)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isSaved
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
              <span>{isSaved ? 'Saved to Bookmarks' : 'Save Opportunity'}</span>
            </button>

            <button
              onClick={() => onRunAiMatch(job)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>AI Candidate Check</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Close
            </button>

            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
