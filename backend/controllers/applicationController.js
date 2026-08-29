import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { Application, APPLICATION_STATUSES_ENUM } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { extractTextFromResume } from '../services/resumeParserService.js';
import { calculateAtsScore } from '../services/geminiService.js';
import {
  isOffline,
  getOfflineApplicationsResult,
  getOfflineApplicationById,
  createOfflineApplication,
  updateOfflineApplicationStatus,
  getOfflineJobById,
  deleteOfflineApplication
} from '../utils/offlineFallback.js';

/**
 * PUBLIC JOB APPLICATION API WITH AUTOMATIC ATS RESUME SCORING
 */
export const applyForJob = asyncHandler(async (req, res) => {
  const jobId = req.body.jobId || req.params.jobId;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    country,
    currentCity,
    yearsOfExperience,
    primaryLanguage,
    additionalLanguage,
    employmentStatus,
    currentJobTitle,
    currentSalary,
    expectedSalary,
    academicQualification,
    university,
  } = req.body;

  if (!firstName || !firstName.trim()) throw ApiError.badRequest('First name is required.');
  if (!lastName || !lastName.trim()) throw ApiError.badRequest('Last name is required.');
  if (!email || !email.trim()) throw ApiError.badRequest('Email is required.');

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email.trim())) throw ApiError.badRequest('Please enter a valid email address.');
  if (!phoneNumber || !phoneNumber.trim()) throw ApiError.badRequest('Phone number is required.');
  if (!country || !country.trim()) throw ApiError.badRequest('Country is required.');
  if (yearsOfExperience === undefined || yearsOfExperience === null || String(yearsOfExperience).trim() === '') throw ApiError.badRequest('Years of experience is required.');
  if (!primaryLanguage || !primaryLanguage.trim()) throw ApiError.badRequest('Primary language is required.');
  if (!jobId) throw ApiError.badRequest('Job ID is required.');

  const isValidMongoId = mongoose.Types.ObjectId.isValid(jobId);
  const isDemoOrOfflineId = isOffline() || !isValidMongoId || String(jobId).startsWith('offline-') || String(jobId).startsWith('job-') || /^\d+$/.test(String(jobId));

  if (!req.file) throw ApiError.badRequest('Resume file (PDF, DOC, or DOCX) is required.');

  if (isDemoOrOfflineId) {
    const job = getOfflineJobById(jobId) || {
      _id: jobId,
      id: jobId,
      jobTitle: 'Applied Position',
      companyName: 'Bucks & Bricks Co.',
      status: 'Published',
      description: 'We are seeking an experienced professional to join our dynamic team.'
    };
    if (job.status !== 'Published') throw ApiError.notFound('Job listing not found or is no longer open for applications.');

    let resumeText = '';
    try {
      resumeText = await extractTextFromResume(req.file);
    } catch (e) {
      resumeText = 'Candidate Resume text';
    }
    const atsScoreStr = await calculateAtsScore(resumeText, job.description || '');
    const atsScoreNum = parseInt(atsScoreStr, 10) || 85;

    const app = createOfflineApplication(job, { ...req.body, atsScore: atsScoreNum }, req.file);
    return res.status(201).json(ApiResponse.created({ atsScore: `${atsScoreNum}%`, application: app }, 'Application Submitted Successfully (offline mode)'));
  }

  try {
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'Published') throw ApiError.notFound('Job listing not found or is no longer open for applications.');

    const resumeText = await extractTextFromResume(req.file);
    const atsScore = await calculateAtsScore(resumeText, job.description);
    const resumeFile = `/uploads/${req.file.filename}`;

    const application = await Application.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      country: country.trim(),
      currentCity: currentCity ? currentCity.trim() : '',
      employmentStatus: employmentStatus ? employmentStatus.trim() : '',
      currentJobTitle: currentJobTitle ? currentJobTitle.trim() : '',
      yearsOfExperience: String(yearsOfExperience).trim(),
      currentSalary: currentSalary ? currentSalary.trim() : '',
      expectedSalary: expectedSalary ? expectedSalary.trim() : '',
      academicQualification: academicQualification ? academicQualification.trim() : '',
      university: university ? university.trim() : '',
      primaryLanguage: primaryLanguage ? primaryLanguage.trim() : '',
      additionalLanguage: additionalLanguage ? additionalLanguage.trim() : '',
      jobId: job._id,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      resumeFile,
      resumeFileName: req.file.originalname,
      resumeFileSize: req.file.size,
      resumeMimeType: req.file.mimetype,
      atsScore,
      status: 'Pending',
    });

    return res.status(201).json(ApiResponse.created({ atsScore, application }, 'Application Submitted Successfully'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const job = getOfflineJobById(jobId) || { _id: jobId, jobTitle: 'Applied Position', companyName: 'Bucks & Bricks Co.', status: 'Published' };
    const app = createOfflineApplication(job, req.body, req.file);
    return res.status(201).json(ApiResponse.created({ atsScore: app.atsScore, application: app }, 'Application Submitted Successfully (offline fallback)'));
  }
});

/**
 * ADMIN: GET ALL APPLICATIONS
 */
export const getAllApplications = asyncHandler(async (req, res) => {
  if (isOffline()) {
    const result = getOfflineApplicationsResult(req.query);
    const formatted = {
      pagination: result.pagination,
      applications: result.applications.map((app) => ({
        id: app.id || app._id,
        candidateName: app.applicantName || `${app.firstName || ''} ${app.lastName || ''}`.trim(),
        firstName: app.firstName || (app.applicantName ? app.applicantName.split(' ')[0] : 'Candidate'),
        lastName: app.lastName || (app.applicantName ? app.applicantName.split(' ').slice(1).join(' ') : ''),
        email: app.email,
        phoneNumber: app.phone || app.phoneNumber || '+92 300 0000000',
        appliedPosition: app.job?.jobTitle || app.jobTitle || 'General Application',
        jobTitle: app.job?.jobTitle || app.jobTitle || 'General Application',
        companyName: app.job?.companyName || app.companyName || 'Bucks & Bricks Co.',
        company: app.job?.companyName || app.companyName || 'Bucks & Bricks Co.',
        applicationDate: app.appliedAt || app.createdAt || new Date(),
        createdAt: app.appliedAt || app.createdAt || new Date(),
        status: app.status,
        atsScore: app.atsScore,
        resume: {
          fileUrl: app.resumeUrl || app.resumeFile || '/uploads/sample_resume.pdf',
          fileName: app.resumeFileName || 'resume.pdf',
          fileSize: app.resumeFileSize || 150000,
          mimeType: app.resumeMimeType || 'application/pdf',
        },
        jobId: app.job?._id || app.jobId || null,
      })),
    };
    return res.status(200).json(ApiResponse.success(formatted, 'Applications retrieved successfully (offline mode).'));
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const { search, status, appliedPosition, jobTitle, company, companyName, startDate, endDate, sort } = req.query;
    const query = {};

    if (status && status.trim() && status.trim().toUpperCase() !== 'ALL') query.status = status.trim();
    const targetPosition = appliedPosition || jobTitle;
    if (targetPosition && targetPosition.trim()) query.jobTitle = new RegExp(targetPosition.trim(), 'i');
    const targetCompany = company || companyName;
    if (targetCompany && targetCompany.trim()) query.companyName = new RegExp(targetCompany.trim(), 'i');
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { jobTitle: searchRegex },
        { companyName: searchRegex },
      ];
    }
    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query).sort(sortOption).skip(skip).limit(limit);

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
          applications: applications.map((app) => ({
            id: app.id,
            candidateName: `${app.firstName} ${app.lastName}`,
            firstName: app.firstName,
            lastName: app.lastName,
            email: app.email,
            phoneNumber: app.phoneNumber,
            appliedPosition: app.jobTitle,
            jobTitle: app.jobTitle,
            companyName: app.companyName,
            company: app.companyName,
            applicationDate: app.createdAt,
            createdAt: app.createdAt,
            status: app.status,
            atsScore: app.atsScore,
            resume: {
              fileUrl: app.resumeFile,
              fileName: app.resumeFileName,
              fileSize: app.resumeFileSize,
              mimeType: app.resumeMimeType,
            },
            jobId: app.jobId,
          })),
        },
        'Applications retrieved successfully.'
      )
    );
  } catch (err) {
    const result = getOfflineApplicationsResult(req.query);
    const formatted = {
      pagination: result.pagination,
      applications: result.applications.map((app) => ({
        id: app.id || app._id,
        candidateName: app.applicantName || `${app.firstName || ''} ${app.lastName || ''}`.trim(),
        firstName: app.firstName || 'Candidate',
        lastName: app.lastName || '',
        email: app.email,
        phoneNumber: app.phone || app.phoneNumber || '+92 300 0000000',
        appliedPosition: app.job?.jobTitle || app.jobTitle || 'General Application',
        jobTitle: app.job?.jobTitle || app.jobTitle || 'General Application',
        companyName: app.job?.companyName || app.companyName || 'Bucks & Bricks Co.',
        company: app.job?.companyName || app.companyName || 'Bucks & Bricks Co.',
        applicationDate: app.appliedAt || app.createdAt || new Date(),
        createdAt: app.appliedAt || app.createdAt || new Date(),
        status: app.status,
        atsScore: app.atsScore,
        resume: {
          fileUrl: app.resumeUrl || app.resumeFile || '/uploads/sample_resume.pdf',
          fileName: app.resumeFileName || 'resume.pdf',
          fileSize: app.resumeFileSize || 150000,
          mimeType: app.resumeMimeType || 'application/pdf',
        },
        jobId: app.job?._id || app.jobId || null,
      })),
    };
    return res.status(200).json(ApiResponse.success(formatted, 'Applications retrieved successfully (offline fallback).'));
  }
});

/**
 * ADMIN: GET SINGLE APPLICATION DETAILS
 */
export const getApplicationById = asyncHandler(async (req, res) => {
    const formatAppDetails = (a) => ({
      id: a.id || a._id,
      personalInformation: {
        firstName: a.firstName || 'Candidate',
        lastName: a.lastName || '',
        candidateName: a.candidateName || a.applicantName || `${a.firstName || ''} ${a.lastName || ''}`.trim() || 'Candidate',
        email: a.email,
        phoneNumber: a.phoneNumber || a.phone || '+92 300 0000000',
        country: a.country || 'Pakistan',
        currentCity: a.currentCity || '',
        yearsOfExperience: a.yearsOfExperience || '',
        primaryLanguage: a.primaryLanguage || 'English',
        additionalLanguage: a.additionalLanguage || '',
        employmentStatus: a.employmentStatus || '',
        currentJobTitle: a.currentJobTitle || '',
        currentSalary: a.currentSalary || '',
        expectedSalary: a.expectedSalary || '',
        academicQualification: a.academicQualification || '',
        university: a.university || '',
      },
      resumeInformation: {
        fileUrl: a.resumeFile || a.resumeUrl || '/uploads/sample_resume.pdf',
        fileName: a.resumeFileName || 'resume.pdf',
        fileSize: a.resumeFileSize || 150000,
        mimeType: a.resumeMimeType || 'application/pdf',
      },
      atsScore: a.atsScore || 85,
      appliedJob: {
        jobId: a.jobId ? (a.jobId._id || a.jobId) : (a.job?._id || null),
        jobTitle: a.jobTitle || a.job?.jobTitle || 'General Position',
        companyName: a.companyName || a.job?.companyName || 'Bucks & Bricks Co.',
        jobDetails: a.jobId || a.job || null,
      },
      status: a.status,
      createdAt: a.createdAt || a.appliedAt || new Date(),
      updatedAt: a.updatedAt || a.appliedAt || new Date(),
    });

    if (isOffline() || String(req.params.id).startsWith('offline-')) {
      const app = getOfflineApplicationById(req.params.id);
      if (!app) throw ApiError.notFound('Application record not found.');
      return res.status(200).json(ApiResponse.success({ application: formatAppDetails(app) }, 'Application details retrieved successfully.'));
    }

    try {
      const application = await Application.findById(req.params.id).populate('jobId');
      if (!application) {
        const app = getOfflineApplicationById(req.params.id);
        if (app) return res.status(200).json(ApiResponse.success({ application: formatAppDetails(app) }, 'Application details retrieved successfully.'));
        throw ApiError.notFound('Application record not found.');
      }
      return res.status(200).json(ApiResponse.success({ application: formatAppDetails(application) }, 'Application details retrieved successfully.'));
    } catch (err) {
      if (err instanceof ApiError) throw err;
      const app = getOfflineApplicationById(req.params.id);
      if (!app) throw ApiError.notFound('Application record not found.');
      return res.status(200).json(ApiResponse.success({ application: formatAppDetails(app) }, 'Application details retrieved successfully.'));
    }
});

/**
 * ADMIN: UPDATE CANDIDATE APPLICATION STATUS
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw ApiError.badRequest('Status is required.');

  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const app = updateOfflineApplicationStatus(req.params.id, status);
    if (!app) throw ApiError.notFound('Application record not found.');
    return res.status(200).json(ApiResponse.success({ application: app }, `Application status updated to '${status}' successfully.`));
  }

  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      const app = updateOfflineApplicationStatus(req.params.id, status);
      if (app) return res.status(200).json(ApiResponse.success({ application: app }, `Application status updated to '${status}' successfully.`));
      throw ApiError.notFound('Application record not found.');
    }
    application.status = status;
    await application.save();
    return res.status(200).json(ApiResponse.success({ application }, `Application status updated to '${status}' successfully.`));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const app = updateOfflineApplicationStatus(req.params.id, status);
    if (!app) throw ApiError.notFound('Application record not found.');
    return res.status(200).json(ApiResponse.success({ application: app }, `Application status updated to '${status}' successfully.`));
  }
});

/**
 * ADMIN: DELETE APPLICATION
 */
export const deleteApplication = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isDemoOrOffline = isOffline() || !mongoose.Types.ObjectId.isValid(id) || String(id).startsWith('offline-') || /^\d+$/.test(String(id));
  if (isDemoOrOffline) {
    const deleted = deleteOfflineApplication(id);
    if (!deleted) throw ApiError.notFound('Application record not found.');
    return res.status(200).json(ApiResponse.success(null, 'Application record deleted successfully.'));
  }

  try {
    const application = await Application.findById(id);
    if (!application) {
      const deleted = deleteOfflineApplication(id);
      if (deleted) return res.status(200).json(ApiResponse.success(null, 'Application record deleted successfully.'));
      throw ApiError.notFound('Application record not found.');
    }
    await Application.findByIdAndDelete(id);
    return res.status(200).json(ApiResponse.success(null, 'Application record deleted successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const deleted = deleteOfflineApplication(id);
    if (!deleted) throw ApiError.notFound('Application record not found.');
    return res.status(200).json(ApiResponse.success(null, 'Application record deleted successfully.'));
  }
});

/**
 * ADMIN: DOWNLOAD APPLICATION RESUME FILE
 */
export const downloadApplicationResume = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const app = getOfflineApplicationById(req.params.id);
    if (!app) throw ApiError.notFound('Application record not found.');
    const fileUrl = app.resumeUrl || app.resumeFile || '/uploads/sample_resume.pdf';
    const fileNameOnDisk = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'backend', 'uploads', fileNameOnDisk);
    if (!fs.existsSync(filePath)) {
      const fallbackPath = path.join(process.cwd(), 'backend', 'uploads', 'sample_resume.pdf');
      if (fs.existsSync(fallbackPath)) {
        return res.download(fallbackPath, app.resumeFileName || 'Resume.pdf');
      }
      throw ApiError.notFound('Resume file not found on server storage.');
    }
    return res.download(filePath, app.resumeFileName || fileNameOnDisk);
  }

  try {
    const application = await Application.findById(req.params.id);
    if (!application || !application.resumeFile) throw ApiError.notFound('Application or resume file reference not found.');
    const fileNameOnDisk = path.basename(application.resumeFile);
    const filePath = path.join(process.cwd(), 'backend', 'uploads', fileNameOnDisk);
    if (!fs.existsSync(filePath)) {
      const fallbackPath = path.join(process.cwd(), 'backend', 'uploads', 'sample_resume.pdf');
      if (fs.existsSync(fallbackPath)) {
        return res.download(fallbackPath, application.resumeFileName || 'Resume.pdf');
      }
      throw ApiError.notFound('Resume file not found on server storage.');
    }
    res.download(filePath, application.resumeFileName || fileNameOnDisk);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.notFound('Resume file not found.');
  }
});
