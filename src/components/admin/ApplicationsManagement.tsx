import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Users,
  Building,
  Briefcase,
  Calendar,
  FileText,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Sparkles,
  Award,
  RefreshCw,
} from 'lucide-react';
import { ApplicationItem, ApplicationDetail, JobPagination } from '../../types';
import {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  downloadApplicationResumeFile,
} from '../../services/api';

export function ApplicationsManagement() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [pagination, setPagination] = useState<JobPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters and Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dynamic filter dropdown lists extracted from loaded data or typed
  const [companies, setCompanies] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Application Details Modal / Drawer state
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Delete Confirmation state
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [deleteCandidateName, setDeleteCandidateName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Status Updating state
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Fetch applications from backend API
  const fetchApplicationsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications({
        search: searchTerm,
        status: statusFilter,
        company: companyFilter,
        appliedPosition: positionFilter,
        sort: sortOrder,
        page: currentPage,
        limit: 10,
      });

      setApplications(data.applications || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }

      // Populate unique companies and positions for filter dropdowns if not set
      if (data.applications && data.applications.length > 0) {
        const uniqueCompanies = Array.from(new Set(data.applications.map((a) => a.companyName).filter(Boolean)));
        const uniquePositions = Array.from(new Set(data.applications.map((a) => a.jobTitle || a.appliedPosition).filter(Boolean)));
        
        setCompanies((prev) => Array.from(new Set([...prev, ...uniqueCompanies])));
        setPositions((prev) => Array.from(new Set([...prev, ...uniquePositions])));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load candidate applications from server.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, companyFilter, positionFilter, sortOrder, currentPage]);

  useEffect(() => {
    fetchApplicationsList();
  }, [fetchApplicationsList]);

  // Auto clear success notifications
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle viewing full candidate details
  const handleViewDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const detail = await getApplicationById(id);
      setSelectedApplication(detail);
    } catch (err: any) {
      setError(err.message || 'Failed to load application details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle Status Update
  const handleStatusChange = async (
    id: string,
    newStatus: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired'
  ) => {
    setUpdatingStatusId(id);
    try {
      await updateApplicationStatus(id, newStatus);
      setSuccessMessage(`Application status changed to "${newStatus}".`);

      // Update local state if details modal is open
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }

      fetchApplicationsList();
    } catch (err: any) {
      setError(err.message || 'Failed to update candidate status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle Resume Download
  const handleDownloadResume = async (id: string, fileName?: string) => {
    try {
      await downloadApplicationResumeFile(id, fileName);
      setSuccessMessage('Resume download started successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to download resume file.');
    }
  };

  // Handle Delete Candidate
  const handleConfirmDelete = (id: string, name: string) => {
    setDeleteCandidateId(id);
    setDeleteCandidateName(name);
  };

  const executeDelete = async () => {
    if (!deleteCandidateId) return;
    setIsDeleting(true);
    try {
      await deleteApplication(deleteCandidateId);
      setSuccessMessage(`Application record for "${deleteCandidateName}" deleted.`);
      setDeleteCandidateId(null);
      if (selectedApplication && selectedApplication.id === deleteCandidateId) {
        setSelectedApplication(null);
      }
      fetchApplicationsList();
    } catch (err: any) {
      setError(err.message || 'Failed to delete application record.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper badge color generator
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#011c30]">Candidate Applications</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchApplicationsList}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-[#052842]' : 'text-slate-500'} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <XCircle size={16} />
          </button>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-900 cursor-pointer">
            <XCircle size={16} />
          </button>
        </motion.div>
      )}

      {/* Controls Bar: Search & Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search candidate name, email, company, or position..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842] transition-colors"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Company
            </label>
            <select
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="All">All Companies</option>
              {companies.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Position
            </label>
            <select
              value={positionFilter}
              onChange={(e) => {
                setPositionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="All">All Positions</option>
              {positions.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By Date
            </label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="newest">Newest Submissions</option>
              <option value="oldest">Oldest Submissions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#052842]" />
            <p className="text-sm font-medium text-slate-500">Loading candidate applications from backend...</p>
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Candidate Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Position & Company</th>
                  <th className="py-3.5 px-4">ATS Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Candidate Name */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleViewDetails(app.id)}
                        className="font-bold text-[#011c30] text-sm hover:text-[#052842] hover:underline cursor-pointer block text-left"
                      >
                        {app.candidateName || `${app.firstName} ${app.lastName}`}
                      </button>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 px-4 space-y-0.5">
                      <div className="font-medium text-slate-700 flex items-center gap-1">
                        <Mail size={12} className="text-slate-400" />
                        <span>{app.email}</span>
                      </div>
                      <div className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Phone size={12} className="text-slate-400" />
                        <span>{app.phoneNumber}</span>
                      </div>
                    </td>

                    {/* Applied Position & Company */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{app.appliedPosition || app.jobTitle}</div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Building size={12} className="text-slate-400" />
                        <span>{app.companyName || app.company}</span>
                      </div>
                    </td>

                    {/* ATS Score */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full bg-blue-50 text-[#052842] border border-blue-100">
                        <Sparkles size={12} className="text-blue-600" />
                        {app.atsScore ? `${app.atsScore}%` : 'N/A'}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <div className="relative inline-block">
                        <select
                          value={app.status}
                          disabled={updatingStatusId === app.id}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(
                            app.status
                          )} focus:outline-none cursor-pointer disabled:opacity-50`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </div>
                    </td>

                    {/* Application Date */}
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {new Date(app.applicationDate || app.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* View Candidate Details */}
                        <button
                          onClick={() => handleViewDetails(app.id)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#052842] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Download Resume */}
                        <button
                          onClick={() => handleDownloadResume(app.id, app.resume?.fileName)}
                          title="Download Resume"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Download size={16} />
                        </button>

                        {/* Delete Candidate */}
                        <button
                          onClick={() => handleConfirmDelete(app.id, app.candidateName || `${app.firstName} ${app.lastName}`)}
                          title="Delete Candidate"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Users size={36} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No Candidate Applications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no applicant submissions matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setCompanyFilter('All');
                setPositionFilter('All');
                setCurrentPage(1);
              }}
              className="mt-2 text-xs font-bold text-[#052842] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-slate-600">
            <div>
              Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
              <span className="font-bold text-slate-900">{pagination.totalPages}</span> ({pagination.total} total applicants)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#052842] text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl w-full border border-slate-200 max-h-[90vh] flex flex-col text-left overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
                <h2 className="text-xl font-bold font-display text-[#011c30] mt-1">
                  {selectedApplication.personalInformation?.candidateName ||
                    `${selectedApplication.personalInformation?.firstName} ${selectedApplication.personalInformation?.lastName}`}
                </h2>
                <p className="text-xs text-slate-500">
                  Applied for <strong className="text-slate-800">{selectedApplication.appliedJob?.jobTitle}</strong> at{' '}
                  <strong className="text-slate-800">{selectedApplication.appliedJob?.companyName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <XCircle size={22} />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-4 overflow-y-auto space-y-6 text-xs font-sans text-slate-700">
              {/* ATS Score Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#052842] text-white rounded-xl shadow-xs">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#011c30] text-sm">ATS Match Score</h4>
                    <p className="text-[11px] text-slate-500">AI-computed relevance against job requirements</p>
                  </div>
                </div>
                <span className="text-2xl font-extrabold font-display text-[#052842]">
                  {selectedApplication.atsScore ? `${selectedApplication.atsScore}%` : 'N/A'}
                </span>
              </div>

              {/* Personal Information Grid */}
              <div>
                <h3 className="text-xs font-bold text-[#052842] uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
                  Personal & Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                    <span className="font-semibold text-slate-800 break-all">{selectedApplication.personalInformation?.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Country</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.country}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">City</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.currentCity || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted On</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(selectedApplication.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employment Information Grid */}
              <div>
                <h3 className="text-xs font-bold text-[#052842] uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
                  Employment Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Employment Status</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.employmentStatus || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Job Title</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.currentJobTitle || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Experience</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.yearsOfExperience || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Salary</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.currentSalary || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Salary</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.expectedSalary || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information Grid */}
              <div>
                <h3 className="text-xs font-bold text-[#052842] uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Qualification</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.academicQualification || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">University / Institute</span>
                    <span className="font-semibold text-slate-800">{selectedApplication.personalInformation?.university || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Resume File & Download Box */}
              <div>
                <h3 className="text-xs font-bold text-[#052842] uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
                  Resume Attachment
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-[#052842] rounded-xl">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">
                        {selectedApplication.resumeInformation?.fileName || 'Candidate_Resume.pdf'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {selectedApplication.resumeInformation?.fileSize
                          ? `${Math.round(selectedApplication.resumeInformation.fileSize / 1024)} KB`
                          : 'PDF/DOC Document'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDownloadResume(selectedApplication.id, selectedApplication.resumeInformation?.fileName)
                    }
                    className="px-4 py-2 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>

              {/* Status Change Selector inside Modal */}
              <div>
                <h3 className="text-xs font-bold text-[#052842] uppercase tracking-wider mb-2">
                  Update Candidate Pipeline Status
                </h3>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedApplication.status}
                    onChange={(e) => handleStatusChange(selectedApplication.id, e.target.value as any)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                  
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() =>
                  handleConfirmDelete(
                    selectedApplication.id,
                    selectedApplication.personalInformation?.candidateName || 'Candidate'
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete Candidate</span>
              </button>

              <button
                onClick={() => setSelectedApplication(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Candidate Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full text-center space-y-4 border border-slate-200"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Delete Candidate Application</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete the application record for{' '}
              <strong className="text-slate-900">"{deleteCandidateName}"</strong>? This will remove all submission data.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Confirm Delete</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
