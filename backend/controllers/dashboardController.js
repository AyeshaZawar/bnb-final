import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { ResumeChecker } from '../models/ResumeChecker.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { isOffline, getOfflineDashboardStatsResult } from '../utils/offlineFallback.js';

/**
 * GET ADMIN DASHBOARD STATS
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const getFormattedOfflineStats = () => {
    const offlineData = getOfflineDashboardStatsResult();
    const ov = offlineData.overview;
    return {
      overview: {
        totalJobs: ov.totalJobs,
        publishedJobs: ov.publishedJobs,
        totalActiveJobs: ov.publishedJobs,
        closedJobs: ov.closedJobs,
        totalClosedJobs: ov.closedJobs,
        draftJobs: ov.draftJobs,
        totalDraftJobs: ov.draftJobs,
        totalApplications: ov.totalApplications,
        pendingApplications: ov.newApplications,
        reviewedApplications: ov.underReviewApplications,
        shortlistedApplications: ov.shortlistedApplications,
        rejectedApplications: ov.rejectedApplications,
        hiredApplications: ov.hiredApplications,
        resumeCheckerRecords: 2,
        totalResumeCheckerRecords: 2,
      },
      system: {
        serverTime: new Date().toISOString(),
        authenticatedAdmin: {
          id: req.admin._id || req.admin.id,
          name: req.admin.name,
          role: req.admin.role,
        },
      },
      recentApplications: offlineData.recentApplications || [],
    };
  };

  if (isOffline()) {
    return res.status(200).json(
      ApiResponse.success(getFormattedOfflineStats(), 'Dashboard metrics fetched successfully (offline mode).')
    );
  }

  try {
    const [
      totalJobs,
      publishedJobs,
      closedJobs,
      draftJobs,
      totalApplications,
      pendingApplications,
      reviewedApplications,
      shortlistedApplications,
      rejectedApplications,
      hiredApplications,
      resumeCheckerRecords,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'Published' }),
      Job.countDocuments({ status: 'Closed' }),
      Job.countDocuments({ status: 'Draft' }),
      Application.countDocuments(),
      Application.countDocuments({ status: { $in: ['New', 'Pending'] } }),
      Application.countDocuments({ status: { $in: ['Under Review', 'Reviewed', 'Interviewing'] } }),
      Application.countDocuments({ status: 'Shortlisted' }),
      Application.countDocuments({ status: 'Rejected' }),
      Application.countDocuments({ status: 'Hired' }),
      ResumeChecker.countDocuments(),
    ]);

    const stats = {
      overview: {
        totalJobs,
        publishedJobs,
        totalActiveJobs: publishedJobs,
        closedJobs,
        totalClosedJobs: closedJobs,
        draftJobs,
        totalDraftJobs: draftJobs,
        totalApplications,
        pendingApplications,
        reviewedApplications,
        shortlistedApplications,
        rejectedApplications,
        hiredApplications,
        resumeCheckerRecords,
        totalResumeCheckerRecords: resumeCheckerRecords,
      },
      system: {
        serverTime: new Date().toISOString(),
        authenticatedAdmin: {
          id: req.admin._id || req.admin.id,
          name: req.admin.name,
          role: req.admin.role,
        },
      },
    };

    return res.status(200).json(
      ApiResponse.success(stats, 'Dashboard metrics fetched successfully.')
    );
  } catch (err) {
    return res.status(200).json(
      ApiResponse.success(getFormattedOfflineStats(), 'Dashboard metrics fetched successfully (offline fallback).')
    );
  }
});
