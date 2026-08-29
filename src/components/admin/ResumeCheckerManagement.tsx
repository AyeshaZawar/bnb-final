import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
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
  Sparkles,
  Calendar,
  Award,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { ResumeCheckerRecord, JobPagination } from '../../types';
import {
  getResumeCheckerRecords,
  getResumeCheckerById,
  deleteResumeCheckerRecord,
  downloadResumeCheckerFileBlob,
} from '../../services/api';

export function ResumeCheckerManagement() {
  const [records, setRecords] = useState<ResumeCheckerRecord[]>([]);
  const [pagination, setPagination] = useState<JobPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [atsScoreFilter, setAtsScoreFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Details Modal state
  const [selectedRecord, setSelectedRecord] = useState<ResumeCheckerRecord | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Delete Confirmation state
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [deleteRecordName, setDeleteRecordName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch Resume Checker records from backend API
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let minScore: number | undefined;
      let maxScore: number | undefined;

      if (atsScoreFilter === 'high') {
        minScore = 75;
      } else if (atsScoreFilter === 'mid') {
        minScore = 50;
        maxScore = 74;
      } else if (atsScoreFilter === 'low') {
        maxScore = 49;
      }

      const data = await getResumeCheckerRecords({
        search: searchTerm,
        minScore,
        maxScore,
        sort: sortOrder,
        page: currentPage,
        limit: 10,
      });

      setRecords(data.records || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load Resume Checker records from backend.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, atsScoreFilter, sortOrder, currentPage]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Auto clear success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle Details View
  const handleViewDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const record = await getResumeCheckerById(id);
      setSelectedRecord(record);
    } catch (err: any) {
      setError(err.message || 'Failed to load record details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle Download Resume File
  const handleDownloadFile = async (id: string, fileName?: string) => {
    try {
      await downloadResumeCheckerFileBlob(id, fileName);
      setSuccessMessage('Resume file download started.');
    } catch (err: any) {
      setError(err.message || 'Failed to download resume file.');
    }
  };

  // Handle Delete Record
  const handleConfirmDelete = (id: string, fileName: string) => {
    setDeleteRecordId(id);
    setDeleteRecordName(fileName);
  };

  const executeDelete = async () => {
    if (!deleteRecordId) return;
    setIsDeleting(true);
    try {
      await deleteResumeCheckerRecord(deleteRecordId);
      setSuccessMessage(`Resume record "${deleteRecordName}" deleted.`);
      setDeleteRecordId(null);
      if (selectedRecord && selectedRecord.id === deleteRecordId) {
        setSelectedRecord(null);
      }
      fetchRecords();
    } catch (err: any) {
      setError(err.message || 'Failed to delete record.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper color badge for ATS score
  const getScoreBadgeColor = (scoreStr: string) => {
    const score = parseInt(scoreStr, 10) || 0;
    if (score >= 75) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 50) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#011c30]">Resume Checker Records</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchRecords}
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
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by resume file name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          {/* ATS Score Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              ATS Score Range
            </label>
            <select
              value={atsScoreFilter}
              onChange={(e) => {
                setAtsScoreFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="all">All Scores</option>
              <option value="high">High Match (75% - 100%)</option>
              <option value="mid">Medium Match (50% - 74%)</option>
              <option value="low">Low Match (Below 50%)</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By Upload Date
            </label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
            >
              <option value="newest">Newest Scans First</option>
              <option value="oldest">Oldest Scans First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resume Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[#052842]" />
            <p className="text-sm font-medium text-slate-500">Loading Resume Checker records from backend...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Resume File Name</th>
                  <th className="py-3.5 px-4">ATS Match Score</th>
                  <th className="py-3.5 px-4">File Size</th>
                  <th className="py-3.5 px-4">Upload Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Resume File Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-[#052842] rounded-lg shrink-0">
                          <FileText size={16} />
                        </div>
                        <button
                          onClick={() => handleViewDetails(item.id)}
                          className="font-bold text-[#011c30] text-xs sm:text-sm hover:text-[#052842] hover:underline cursor-pointer text-left break-all"
                        >
                          {item.resumeFileName || 'Resume.pdf'}
                        </button>
                      </div>
                    </td>

                    {/* ATS Score */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(item.atsScore)}`}>
                        <Sparkles size={12} />
                        {item.atsScore ? `${item.atsScore}%` : 'N/A'}
                      </span>
                    </td>

                    {/* File Size */}
                    <td className="py-4 px-4 text-slate-500">
                      {item.resumeFileSize ? `${Math.round(item.resumeFileSize / 1024)} KB` : 'N/A'}
                    </td>

                    {/* Upload Date */}
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(item.uploadDate || item.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewDetails(item.id)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#052842] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleDownloadFile(item.id, item.resumeFileName)}
                          title="Download Resume"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Download size={16} />
                        </button>

                        <button
                          onClick={() => handleConfirmDelete(item.id, item.resumeFileName)}
                          title="Delete Record"
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
            <FileText size={36} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No Resume Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No resume checker scans match your filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setAtsScoreFilter('all');
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
              <span className="font-bold text-slate-900">{pagination.totalPages}</span> ({pagination.total} total records)
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

      {/* Details View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full border border-slate-200 text-left space-y-5"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold font-display text-[#011c30]">Resume Record Details</h3>
                <p className="text-xs text-slate-500">Scanned document details and AI score</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* ATS Score Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#052842] text-white rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#011c30] text-sm">ATS Relevance Score</h4>
                  <p className="text-[11px] text-slate-500 font-sans">Automated keyword analysis</p>
                </div>
              </div>
              <span className="text-2xl font-extrabold font-display text-[#052842]">
                {selectedRecord.atsScore ? `${selectedRecord.atsScore}%` : 'N/A'}
              </span>
            </div>

            {/* File Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs font-sans text-slate-700">
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">File Name:</span>
                <span className="font-semibold text-slate-900 break-all">{selectedRecord.resumeFileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">File Size:</span>
                <span className="font-semibold text-slate-900">
                  {selectedRecord.resumeFileSize ? `${Math.round(selectedRecord.resumeFileSize / 1024)} KB` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Upload Date:</span>
                <span className="font-semibold text-slate-900">
                  {new Date(selectedRecord.uploadDate || selectedRecord.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleConfirmDelete(selectedRecord.id, selectedRecord.resumeFileName)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete Record</span>
              </button>

              <button
                onClick={() => handleDownloadFile(selectedRecord.id, selectedRecord.resumeFileName)}
                className="px-5 py-2 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Download Resume</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Record Confirmation Modal */}
      {deleteRecordId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full text-center space-y-4 border border-slate-200"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Delete Resume Record</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete the resume record for{' '}
              <strong className="text-slate-900">"{deleteRecordName}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteRecordId(null)}
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
