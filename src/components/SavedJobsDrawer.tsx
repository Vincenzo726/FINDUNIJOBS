import React from 'react';
import { X, Bookmark, Trash2, ExternalLink, Building2, MapPin } from 'lucide-react';
import { NormalizedJob } from '../types/job';

interface SavedJobsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedJobs: NormalizedJob[];
  onSelectJob: (job: NormalizedJob) => void;
  onRemoveJob: (jobId: string) => void;
  onClearAll: () => void;
}

export const SavedJobsDrawer: React.FC<SavedJobsDrawerProps> = ({
  isOpen,
  onClose,
  savedJobs,
  onSelectJob,
  onRemoveJob,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Saved Jobs ({savedJobs.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bookmark className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No saved opportunities yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click the bookmark icon on any real job card to save it for later.
              </p>
            </div>
          ) : (
            savedJobs.map((job) => (
              <div
                key={job.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-white shadow-2xs group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4
                    onClick={() => {
                      onSelectJob(job);
                      onClose();
                    }}
                    className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {job.title}
                  </h4>
                  <button
                    onClick={() => onRemoveJob(job.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{job.company}</span>
                  <span>·</span>
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="font-semibold text-emerald-700">{job.salary || 'Salary not disclosed'}</span>
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    <span>Apply</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedJobs.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
