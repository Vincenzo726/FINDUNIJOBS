import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, RefreshCw, Server, ExternalLink, Activity, AlertTriangle } from 'lucide-react';
import { NormalizedJob } from '../types/job';

export const AdminDashboard: React.FC = () => {
  const [providerHealth, setProviderHealth] = useState<any>(null);
  const [pendingJobs, setPendingJobs] = useState<NormalizedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [healthRes, pendingRes] = await Promise.all([
        fetch('/api/health/providers'),
        fetch('/api/admin/jobs/pending'),
      ]);

      if (healthRes.ok) {
        const health = await healthRes.json();
        setProviderHealth(health.providers);
      }

      if (pendingRes.ok) {
        const jobs = await pendingRes.json();
        setPendingJobs(jobs);
      }
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModerate = async (jobId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/approval`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setActionMsg(`Job listing ${status === 'approved' ? 'approved & published' : 'rejected'}.`);
        loadData();
      }
    } catch (err) {
      console.error('Moderation error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Platform Administration & Security</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            System Operations & Job Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real provider connectivity, employer vacancy review, and security health checks.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Health</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Real Provider Integration Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <span>Live Job Provider Health Status</span>
        </h2>

        {providerHealth ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Jobicy */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{providerHealth.jobicy?.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      providerHealth.jobicy?.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {providerHealth.jobicy?.status}
                  </span>
                </div>
                <p className="text-slate-500 mb-2">
                  Public feed for international & remote jobs accepting candidates in Africa / Nigeria.
                </p>
                <div className="text-[11px] text-slate-600">
                  Sample Jobs Loaded: <strong>{providerHealth.jobicy?.sampleReturned || 0}</strong>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] text-slate-400">
                Authentication: Not required (Public)
              </div>
            </div>

            {/* Jooble Nigeria */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{providerHealth.jooble?.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      providerHealth.jooble?.keyConfigured
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {providerHealth.jooble?.keyConfigured ? 'Connected' : 'Setup Required'}
                  </span>
                </div>
                <p className="text-slate-500 mb-2">
                  Dedicated regional feed for on-site & hybrid vacancies in Lagos, Abuja, and Nigerian states.
                </p>
                <div className="text-[11px] text-slate-600">
                  Key Status: {providerHealth.jooble?.keyConfigured ? 'Active' : 'Missing'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] text-amber-700">
                {providerHealth.jooble?.setupInstructions}
              </div>
            </div>

            {/* Gemini AI */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{providerHealth.gemini?.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      providerHealth.gemini?.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {providerHealth.gemini?.status}
                  </span>
                </div>
                <p className="text-slate-500 mb-2">
                  Server-side semantic candidate matching and job ranking.
                </p>
                <div className="text-[11px] text-slate-600">
                  Model: <strong>{providerHealth.gemini?.model}</strong>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] text-slate-400">
                Injected securely via Google AI Studio
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            <span>Checking provider endpoints...</span>
          </div>
        )}
      </div>

      {/* Moderation Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Employer Vacancy Moderation Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and approve vacancies submitted by Nigerian companies before they are displayed.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            {pendingJobs.length} Pending
          </span>
        </div>

        {pendingJobs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Moderation Queue Clear</p>
            <p className="text-slate-400 mt-1">There are no pending employer job submissions awaiting review.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {pendingJobs.map((job) => (
              <div key={job.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{job.company}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.employmentType}</span>
                      {job.salary && <span className="text-emerald-700 font-semibold">{job.salary}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerate(job.id, 'rejected')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg font-bold"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleModerate(job.id, 'approved')}
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Verify Application Link: {job.applicationUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>ID: {job.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
