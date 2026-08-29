import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  FileSearch,
  Loader2,
  AlertCircle,
  Building,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getDashboardStats } from '../../services/api';

interface DashboardOverviewProps {
  onNavigateTab?: (tab: 'vacancies' | 'applications' | 'resume-checker') => void;
}

export function DashboardOverview({ onNavigateTab }: DashboardOverviewProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const overview = stats?.overview || {};
  const recentApps = stats?.recentApplications || [];

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#011c30]">Dashboard Overview</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-[#052842]' : 'text-slate-500'} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 text-sm">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigateTab && onNavigateTab('vacancies')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Vacancies</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#011c30]">
            {loading ? <Loader2 size={24} className="animate-spin text-slate-400" /> : (overview.totalJobs ?? 0)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-bold">{overview.publishedJobs ?? 0} Published</span>
            <span>•</span>
            <span>{overview.draftJobs ?? 0} Drafts</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('applications')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applications</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#011c30]">
            {loading ? <Loader2 size={24} className="animate-spin text-slate-400" /> : (overview.totalApplications ?? 0)}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-amber-600 font-bold">{overview.pendingApplications ?? 0} Pending</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">{overview.shortlistedApplications ?? 0} Shortlisted</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab && onNavigateTab('resume-checker')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Resume Scans</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <FileSearch size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#011c30]">
            {loading ? <Loader2 size={24} className="animate-spin text-slate-400" /> : (overview.totalResumeCheckerRecords ?? overview.resumeCheckerRecords ?? 0)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <Sparkles size={13} className="text-amber-500" />
            <span>AI powered public ATS evaluations</span>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-[#011c30]">Recent Candidate Submissions</h2>
            
          </div>
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#052842] hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>View All Applications</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {loading && !stats ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 size={28} className="animate-spin text-[#052842]" />
            <span className="text-xs font-bold">Loading dashboard metrics...</span>
          </div>
        ) : recentApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-6">Candidate</th>
                  <th className="py-3 px-6">Applied Position</th>
                  <th className="py-3 px-6">ATS Score</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Applied At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentApps.map((app: any) => {
                  const score = typeof app.atsScore === 'number' ? app.atsScore : parseInt(app.atsScore || '0', 10);
                  const statusColor = 
                    app.status === 'Hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    app.status === 'Shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    app.status === 'Interviewing' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <tr key={app._id || app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#011c30]">
                        <div className="flex flex-col">
                          <span>{app.applicantName || `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'Candidate'}</span>
                          <span className="text-[11px] font-normal text-slate-500">{app.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-slate-400 shrink-0" />
                          <span className="font-medium">{app.job?.jobTitle || app.jobTitle || 'General Application'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          <Sparkles size={12} className="text-amber-500" />
                          <span>{score > 0 ? `${score}%` : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColor}`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            No recent applications received yet.
          </div>
        )}
      </div>
    </div>
  );
}
