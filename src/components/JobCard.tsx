import React from 'react';
import { MapPin, Bookmark, Sparkles, Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import { NormalizedJob } from '../types/job';

interface JobCardProps {
  job: NormalizedJob;
  isSaved: boolean;
  onToggleSave: (job: NormalizedJob) => void;
  onSelectJob: (job: NormalizedJob) => void;
  onQuickMatch: (job: NormalizedJob) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onSelectJob,
  onQuickMatch,
}) => {
  const companyInitials = job.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'JB';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-11 h-11 rounded-lg border border-slate-200 object-contain p-1 shrink-0 bg-white"
                onError={(e) => {
                  (e.currentTarget as any).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0">
                {companyInitials}
              </div>
            )}

            <div>
              <h3
                onClick={() => onSelectJob(job)}
                className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
              >
                {job.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{job.company}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job);
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isSaved
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
          </button>
        </div>

        {/* Location, Remote, and Level metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location}</span>
          </div>

          <span className="text-slate-300">·</span>

          <span className="font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded text-[11px]">
            {job.employmentType}
          </span>

          {job.isRemote && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                Remote Eligible
              </span>
            </>
          )}

          {job.salary && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 font-semibold">{job.salary}</span>
            </>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {job.description}
        </p>

        {/* Skills Chips */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="font-medium truncate max-w-[140px]">{job.sourceAttribution}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onQuickMatch(job)}
            title="Evaluate AI match score with your candidate profile"
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">AI Match</span>
          </button>

          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-colors shadow-xs"
          >
            <span>Apply</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
