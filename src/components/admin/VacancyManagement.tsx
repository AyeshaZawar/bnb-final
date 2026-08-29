import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Plus,
  Briefcase,
  MapPin,
  Clock,
  Building,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Globe,
} from 'lucide-react';
import { JobVacancy, JobPagination } from '../../types';
import {
  getAdminJobs,
  deleteJob,
  publishJob,
  unpublishJob,
  closeJob,
  reopenJob,
} from '../../services/api';
import { VacancyFormModal } from './VacancyFormModal';

export function VacancyManagement() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [pagination, setPagination] = useState<JobPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [workplaceFilter, setWorkplaceFilter] = useState<string>('All');
  const [employmentFilter, setEmploymentFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  // Delete Confirmation Modal state
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);
  const [deleteCandidateTitle, setDeleteCandidateTitle] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Single Job Detail View Modal
  const [viewJob, setViewJob] = useState<JobVacancy | null>(null);

  // Fetch jobs from backend API
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminJobs({
        search: searchTerm,
        status: statusFilter,
        workplaceType: workplaceFilter,
        employmentType: employmentFilter,
        sort: sortOrder,
        page: currentPage,
        limit: 10,
      });

      setJobs(data.jobs || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vacancies from server.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, workplaceFilter, employmentFilter, sortOrder, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Auto-clear success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleOpenAddModal = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (job: JobVacancy) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = (id: string, title: string) => {
    setDeleteCandidateId(id);
    setDeleteCandidateTitle(title);
  };

  const executeDelete = async () => {
    if (!deleteCandidateId) return;
    setIsDeleting(true);
    try {
      await deleteJob(deleteCandidateId);
      setSuccessMessage(`Job listing "${deleteCandidateTitle}" deleted successfully.`);
      setDeleteCandidateId(null);
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to delete job listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Status Actions
  const handlePublish = async (id: string) => {
    try {
      await publishJob(id);
      setSuccessMessage('Job status updated to Published.');
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to publish job.');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await unpublishJob(id);
      setSuccessMessage('Job unpublished and moved to Draft.');
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to unpublish job.');
    }
  };

  const handleClose = async (id: string) => {
    try {
      await closeJob(id);
      setSuccessMessage('Job listing closed.');
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to close job.');
    }
  };

  const handleReopen = async (id: string) => {
    try {
      await reopenJob(id, 'Published');
      setSuccessMessage('Job reopened and Published.');
      fetchJobs();
    } catch (err: any) {
      setError(err.message || 'Failed to reopen job.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#011c30]">Vacancy Management</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-[#052842]' : 'text-slate-500'} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#052842] hover:bg-[#011c30] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Add New Vacancy</span>
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

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Company, Position, or City..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842] transition-colors"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
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
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Workplace Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Workplace Type
            </label>
            <select
              value={workplaceFilter}
              onChange={(e) => {
                setWorkplaceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="All">All Workplace Types</option>
              <option value="Remote">Remote</option>
              <option value="On-Site">On-Site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Employment Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Employment Type
            </label>
            <select
              value={employmentFilter}
              onChange={(e) => {
                setEmploymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="All">All Employment Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vacancy Table / Cards List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#052842]" />
            <p className="text-sm font-medium text-slate-500">Loading vacancies from backend...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Job Title & Company</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Workplace</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
                {jobs.map((job) => (
                  <tr key={job.id || job._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Job Title & Company */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#011c30] text-sm">{job.jobTitle}</div>
                      <div className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                        <Building size={12} className="text-slate-400" />
                        <span>{job.companyName}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-4 px-4 font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-[#052842]" />
                        {job.city}
                      </span>
                    </td>

                    {/* Workplace Type */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {job.workplaceType}
                      </span>
                    </td>

                    {/* Employment Type */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-[#052842] border border-blue-100">
                        {job.employmentType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {new Date(job.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* View Button */}
                        <button
                          onClick={() => setViewJob(job)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#052842] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(job)}
                          title="Edit Job"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>

                        {/* Status Toggle Actions Dropdown / Quick Buttons */}
                        {job.status === 'Draft' && (
                          <button
                            onClick={() => handlePublish(job._id || job.id)}
                            title="Publish Job"
                            className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Publish
                          </button>
                        )}

                        {job.status === 'Published' && (
                          <>
                            <button
                              onClick={() => handleUnpublish(job._id || job.id)}
                              title="Unpublish to Draft"
                              className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Unpublish
                            </button>
                            <button
                              onClick={() => handleClose(job._id || job.id)}
                              title="Close Job"
                              className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Close
                            </button>
                          </>
                        )}

                        {job.status === 'Closed' && (
                          <button
                            onClick={() => handleReopen(job._id || job.id)}
                            title="Reopen Job"
                            className="px-2 py-1 rounded-md bg-blue-50 text-[#052842] hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Reopen
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleConfirmDelete(job._id || job.id, job.jobTitle)}
                          title="Delete Job"
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
            <Briefcase size={36} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No Job Vacancies Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no job positions matching your filter parameters. Try clearing your filters or create a new vacancy.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setWorkplaceFilter('All');
                setEmploymentFilter('All');
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
              Showing page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
              <span className="font-bold text-slate-900">{pagination.totalPages}</span> ({pagination.total} total vacancies)
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

      {/* Modal 1: Vacancy Form (Add / Edit) */}
      <VacancyFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedJob}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          fetchJobs();
        }}
      />

      {/* Modal 2: Delete Confirmation Modal */}
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
            <h3 className="text-lg font-bold text-slate-900 font-display">Confirm Deletion</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete the job vacancy{' '}
              <strong className="text-slate-900">"{deleteCandidateTitle}"</strong>? This action cannot be undone.
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
                <span>Delete Vacancy</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal 3: View Single Job Modal */}
      {viewJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl w-full border border-slate-200 max-h-[85vh] flex flex-col text-left"
          >
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(viewJob.status)}`}>
                  {viewJob.status}
                </span>
                <h2 className="text-xl font-bold font-display text-[#011c30] mt-1">{viewJob.jobTitle}</h2>
                <p className="text-xs text-slate-500">{viewJob.companyName} • {viewJob.city}, {viewJob.country}</p>
              </div>
              <button onClick={() => setViewJob(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <XCircle size={22} />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 text-xs font-sans text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Workplace</span>
                  <span className="font-semibold text-slate-800">{viewJob.workplaceType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Employment</span>
                  <span className="font-semibold text-slate-800">{viewJob.employmentType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
                  <span className="font-semibold text-slate-800">{viewJob.experienceRequired}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">Job Description</h4>
                <p className="leading-relaxed text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                  {viewJob.description}
                </p>
              </div>

              {viewJob.responsibilities && viewJob.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    {viewJob.responsibilities.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {viewJob.requirements && viewJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    {viewJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {viewJob.perksAndBenefits && viewJob.perksAndBenefits.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">Perks & Benefits</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    {viewJob.perksAndBenefits.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
