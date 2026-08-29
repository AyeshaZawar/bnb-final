import mongoose from 'mongoose';
import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  isOffline,
  getOfflineJobsResult,
  getOfflineJobById,
  createOfflineJob,
  updateOfflineJob,
  deleteOfflineJob,
  changeOfflineJobStatus
} from '../utils/offlineFallback.js';

/**
 * Helper to build search and filter query for Jobs
 */
const buildJobQuery = (queryParams, isPublic = false) => {
  const { search, workplaceType, employmentType, status } = queryParams;
  const query = {};

  if (isPublic) {
    query.status = 'Published';
  } else if (status && status.toUpperCase() !== 'ALL') {
    query.status = status;
  }

  if (workplaceType && workplaceType.toUpperCase() !== 'ALL') {
    query.workplaceType = workplaceType;
  }

  if (employmentType && employmentType.toUpperCase() !== 'ALL') {
    query.employmentType = employmentType;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { companyName: searchRegex },
      { jobTitle: searchRegex },
      { city: searchRegex },
      { category: searchRegex },
    ];
  }

  return query;
};

/**
 * CREATE A NEW JOB (ADMIN)
 */
export const createJob = asyncHandler(async (req, res) => {
  const {
    companyName,
    jobTitle,
    category,
    city,
    country,
    workplaceType,
    employmentType,
    description,
    responsibilities,
    requirements,
    perksAndBenefits,
    experienceRequired,
    education,
    salary,
    applicationDeadline,
    status,
  } = req.body;

  if (!companyName || !jobTitle || !city || !description || !experienceRequired) {
    throw ApiError.badRequest(
      'Missing required fields: companyName, jobTitle, city, description, and experienceRequired are mandatory.'
    );
  }

  if (isOffline()) {
    const job = createOfflineJob(req.body, req.admin);
    return res.status(201).json(
      ApiResponse.created({ job }, 'Job listing created successfully (offline mode).')
    );
  }

  try {
    const job = await Job.create({
      companyName,
      jobTitle,
      category: category || 'General',
      city,
      country: country || '',
      workplaceType: workplaceType || 'On-Site',
      employmentType: employmentType || 'Full Time',
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      perksAndBenefits: Array.isArray(perksAndBenefits) ? perksAndBenefits : [],
      experienceRequired,
      education: education || '',
      salary: salary || '',
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      status: status || 'Draft',
      createdBy: req.admin._id,
    });

    return res.status(201).json(
      ApiResponse.created({ job }, 'Job listing created successfully.')
    );
  } catch (err) {
    const job = createOfflineJob(req.body, req.admin);
    return res.status(201).json(
      ApiResponse.created({ job }, 'Job listing created successfully (offline fallback).')
    );
  }
});

/**
 * GET PUBLIC PUBLISHED JOBS (PUBLIC)
 */
export const getPublicJobs = asyncHandler(async (req, res) => {
  if (isOffline()) {
    return res.status(200).json(
      ApiResponse.success(getOfflineJobsResult(req.query, true), 'Published jobs retrieved successfully.')
    );
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortOption = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const query = buildJobQuery(req.query, true);

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json(
      ApiResponse.success(
        {
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
          jobs,
        },
        'Published jobs retrieved successfully.'
      )
    );
  } catch (err) {
    return res.status(200).json(
      ApiResponse.success(getOfflineJobsResult(req.query, true), 'Published jobs retrieved successfully (offline fallback).')
    );
  }
});

/**
 * GET SINGLE PUBLIC PUBLISHED JOB (PUBLIC)
 */
export const getPublicJobById = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const job = getOfflineJobById(req.params.id);
    if (!job || job.status !== 'Published') {
      throw ApiError.notFound('Job listing not found or is no longer accepting applications.');
    }
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job details retrieved successfully.')
    );
  }

  try {
    const job = await Job.findOne({ _id: req.params.id, status: 'Published' });

    if (!job) {
      const offlineJob = getOfflineJobById(req.params.id);
      if (offlineJob && offlineJob.status === 'Published') {
        return res.status(200).json(
          ApiResponse.success({ job: offlineJob }, 'Job details retrieved successfully.')
        );
      }
      throw ApiError.notFound('Job listing not found or is no longer accepting applications.');
    }

    return res.status(200).json(
      ApiResponse.success({ job }, 'Job details retrieved successfully.')
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = getOfflineJobById(req.params.id);
    if (!job || job.status !== 'Published') {
      throw ApiError.notFound('Job listing not found or is no longer accepting applications.');
    }
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job details retrieved successfully.')
    );
  }
});

/**
 * GET ALL JOBS FOR ADMIN (ADMIN)
 */
export const getAdminJobs = asyncHandler(async (req, res) => {
  if (isOffline()) {
    return res.status(200).json(
      ApiResponse.success(getOfflineJobsResult(req.query, false), 'Admin jobs retrieved successfully.')
    );
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortOption = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const query = buildJobQuery(req.query, false);

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('createdBy', 'name email role')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json(
      ApiResponse.success(
        {
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
          jobs,
        },
        'Admin jobs retrieved successfully.'
      )
    );
  } catch (err) {
    return res.status(200).json(
      ApiResponse.success(getOfflineJobsResult(req.query, false), 'Admin jobs retrieved successfully (offline fallback).')
    );
  }
});

/**
 * GET SINGLE JOB FOR ADMIN
 */
export const getAdminJobById = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const job = getOfflineJobById(req.params.id);
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Admin job details retrieved successfully.')
    );
  }

  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email role');
    if (!job) {
      const offlineJob = getOfflineJobById(req.params.id);
      if (offlineJob) return res.status(200).json(ApiResponse.success({ job: offlineJob }, 'Admin job details retrieved successfully.'));
      throw ApiError.notFound('Job listing not found.');
    }
    return res.status(200).json(
      ApiResponse.success({ job }, 'Admin job details retrieved successfully.')
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = getOfflineJobById(req.params.id);
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Admin job details retrieved successfully.')
    );
  }
});

/**
 * UPDATE JOB (ADMIN)
 */
export const updateJob = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const job = updateOfflineJob(req.params.id, req.body);
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job updated successfully.')
    );
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      const offJob = updateOfflineJob(req.params.id, req.body);
      if (offJob) return res.status(200).json(ApiResponse.success({ job: offJob }, 'Job updated successfully.'));
      throw ApiError.notFound('Job listing not found.');
    }

    const allowedUpdates = [
      'companyName', 'jobTitle', 'category', 'city', 'country',
      'workplaceType', 'employmentType', 'description', 'responsibilities',
      'requirements', 'perksAndBenefits', 'experienceRequired', 'education',
      'salary', 'applicationDeadline', 'status'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'applicationDeadline') {
          job[field] = req.body[field] ? new Date(req.body[field]) : null;
        } else {
          job[field] = req.body[field];
        }
      }
    });

    await job.save();
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job updated successfully.')
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = updateOfflineJob(req.params.id, req.body);
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job updated successfully.')
    );
  }
});

/**
 * DELETE JOB (ADMIN)
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isDemoOrOffline = isOffline() || !mongoose.Types.ObjectId.isValid(id) || String(id).startsWith('offline-') || /^\d+$/.test(String(id));
  if (isDemoOrOffline) {
    const deleted = deleteOfflineJob(id);
    if (!deleted) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success(null, 'Job listing deleted successfully.')
    );
  }

  try {
    const job = await Job.findById(id);
    if (!job) {
      const deleted = deleteOfflineJob(id);
      if (deleted) return res.status(200).json(ApiResponse.success(null, 'Job listing deleted successfully.'));
      throw ApiError.notFound('Job listing not found.');
    }

    await Job.findByIdAndDelete(id);
    return res.status(200).json(
      ApiResponse.success(null, 'Job listing deleted successfully.')
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const deleted = deleteOfflineJob(id);
    if (!deleted) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success(null, 'Job listing deleted successfully.')
    );
  }
});

/**
 * PUBLISH JOB
 */
export const publishJob = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const job = changeOfflineJobStatus(req.params.id, 'Published');
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job published successfully.')
    );
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      const offJob = changeOfflineJobStatus(req.params.id, 'Published');
      if (offJob) return res.status(200).json(ApiResponse.success({ job: offJob }, 'Job published successfully.'));
      throw ApiError.notFound('Job listing not found.');
    }

    job.status = 'Published';
    await job.save();
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job published successfully.')
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = changeOfflineJobStatus(req.params.id, 'Published');
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job published successfully.')
    );
  }
});

/**
 * UNPUBLISH JOB
 */
export const unpublishJob = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const job = changeOfflineJobStatus(req.params.id, 'Draft');
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job unpublished (moved to Draft) successfully.')
    );
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      const offJob = changeOfflineJobStatus(req.params.id, 'Draft');
      if (offJob) return res.status(200).json(ApiResponse.success({ job: offJob }, 'Job unpublished successfully.'));
      throw ApiError.notFound('Job listing not found.');
    }

    job.status = 'Draft';
    await job.save();
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job unpublished (moved to Draft) successfully.')
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = changeOfflineJobStatus(req.params.id, 'Draft');
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job unpublished (moved to Draft) successfully.')
    );
  }
});

/**
 * CLOSE JOB
 */
export const closeJob = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const job = changeOfflineJobStatus(req.params.id, 'Closed');
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job closed successfully.')
    );
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      const offJob = changeOfflineJobStatus(req.params.id, 'Closed');
      if (offJob) return res.status(200).json(ApiResponse.success({ job: offJob }, 'Job closed successfully.'));
      throw ApiError.notFound('Job listing not found.');
    }

    job.status = 'Closed';
    await job.save();
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job closed successfully.')
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = changeOfflineJobStatus(req.params.id, 'Closed');
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, 'Job closed successfully.')
    );
  }
});

/**
 * REOPEN JOB
 */
export const reopenJob = asyncHandler(async (req, res) => {
  const newStatus = req.body.status === 'Draft' ? 'Draft' : 'Published';

  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const job = changeOfflineJobStatus(req.params.id, newStatus);
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, `Job reopened as ${newStatus} successfully.`)
    );
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      const offJob = changeOfflineJobStatus(req.params.id, newStatus);
      if (offJob) return res.status(200).json(ApiResponse.success({ job: offJob }, `Job reopened as ${newStatus} successfully.`));
      throw ApiError.notFound('Job listing not found.');
    }

    job.status = newStatus;
    await job.save();
    return res.status(200).json(
      ApiResponse.success({ job }, `Job reopened as ${newStatus} successfully.`)
    );
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = changeOfflineJobStatus(req.params.id, newStatus);
    if (!job) throw ApiError.notFound('Job listing not found.');
    return res.status(200).json(
      ApiResponse.success({ job }, `Job reopened as ${newStatus} successfully.`)
    );
  }
});
