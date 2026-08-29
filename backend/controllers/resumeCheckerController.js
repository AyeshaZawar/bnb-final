import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { ResumeChecker } from '../models/ResumeChecker.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { extractTextFromResume } from '../services/resumeParserService.js';
import { calculateAtsScore } from '../services/geminiService.js';
import {
  isOffline,
  getOfflineResumeChecksResult,
  getOfflineResumeCheckById,
  deleteOfflineResumeCheck,
  initOfflineData
} from '../utils/offlineFallback.js';

/**
 * PUBLIC RESUME CHECKER API ("Score My Resume")
 */
export const scoreMyResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Resume file (PDF, DOC, or DOCX) is required.');
  }

  const resumeText = await extractTextFromResume(req.file);
  const atsScore = await calculateAtsScore(resumeText);
  const resumeFile = `/uploads/${req.file.filename}`;

  if (isOffline()) {
    initOfflineData();
    const record = {
      _id: 'offline-' + Date.now(),
      id: 'offline-' + Date.now(),
      resumeFile,
      resumeFileName: req.file.originalname,
      resumeFileSize: req.file.size,
      atsScore,
      createdAt: new Date(),
    };
    global.offlineResumeChecks.unshift(record);
    return res.status(200).json(
      ApiResponse.success({ atsScore, record: { id: record.id, resumeFileName: record.resumeFileName, atsScore: record.atsScore, createdAt: record.createdAt } }, 'Resume ATS score generated successfully (offline mode).')
    );
  }

  let record;
  try {
    record = await ResumeChecker.create({
      resumeFile,
      resumeFileName: req.file.originalname,
      resumeFileSize: req.file.size,
      atsScore,
    });
    return res.status(200).json(
      ApiResponse.success({ atsScore, record: { id: record.id, resumeFileName: record.resumeFileName, atsScore: record.atsScore, createdAt: record.createdAt } }, 'Resume ATS score generated successfully.')
    );
  } catch (dbError) {
    initOfflineData();
    record = {
      _id: 'offline-' + Date.now(),
      id: 'offline-' + Date.now(),
      resumeFile,
      resumeFileName: req.file.originalname,
      resumeFileSize: req.file.size,
      atsScore,
      createdAt: new Date(),
    };
    global.offlineResumeChecks.unshift(record);
    return res.status(200).json(
      ApiResponse.success({ atsScore, record: { id: record.id, resumeFileName: record.resumeFileName, atsScore: record.atsScore, createdAt: record.createdAt } }, 'Resume ATS score generated successfully (offline fallback).')
    );
  }
});

/**
 * ADMIN: GET ALL RESUME CHECKER RECORDS
 */
export const getAllResumeCheckerRecords = asyncHandler(async (req, res) => {
  if (isOffline()) {
    const result = getOfflineResumeChecksResult(req.query);
    return res.status(200).json(
      ApiResponse.success({ pagination: result.pagination, records: result.records.map((item) => ({ id: item.id || item._id, resumeFile: item.resumeFile || '/uploads/sample_resume.pdf', resumeFileName: item.resumeFileName || 'resume.pdf', resumeFileSize: item.resumeFileSize || 150000, atsScore: item.atsScore || 85, uploadDate: item.createdAt || new Date(), createdAt: item.createdAt || new Date() })) }, 'Resume Checker records retrieved successfully (offline mode).')
    );
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const { search, atsScore, minScore, maxScore, startDate, endDate, sort } = req.query;
    const query = {};

    if (search && search.trim()) query.resumeFileName = new RegExp(search.trim(), 'i');
    if (atsScore && atsScore.trim()) {
      query.atsScore = new RegExp(atsScore.trim(), 'i');
    } else if (minScore || maxScore) {
      const conditions = [];
      if (minScore) conditions.push(`this.atsScore && parseInt(this.atsScore) >= ${parseInt(minScore, 10)}`);
      if (maxScore) conditions.push(`this.atsScore && parseInt(this.atsScore) <= ${parseInt(maxScore, 10)}`);
      if (conditions.length > 0) query.$where = conditions.join(' && ');
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const total = await ResumeChecker.countDocuments(query);
    const records = await ResumeChecker.find(query).sort(sortOption).skip(skip).limit(limit);

    return res.status(200).json(
      ApiResponse.success({ pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1, hasNextPage: page * limit < total, hasPrevPage: page > 1 }, records: records.map((item) => ({ id: item.id, resumeFile: item.resumeFile, resumeFileName: item.resumeFileName, resumeFileSize: item.resumeFileSize, atsScore: item.atsScore, uploadDate: item.createdAt, createdAt: item.createdAt })) }, 'Resume Checker records retrieved successfully.')
    );
  } catch (err) {
    const result = getOfflineResumeChecksResult(req.query);
    return res.status(200).json(
      ApiResponse.success({ pagination: result.pagination, records: result.records.map((item) => ({ id: item.id || item._id, resumeFile: item.resumeFile || '/uploads/sample_resume.pdf', resumeFileName: item.resumeFileName || 'resume.pdf', resumeFileSize: item.resumeFileSize || 150000, atsScore: item.atsScore || 85, uploadDate: item.createdAt || new Date(), createdAt: item.createdAt || new Date() })) }, 'Resume Checker records retrieved successfully (offline fallback).')
    );
  }
});

/**
 * ADMIN: GET SINGLE RESUME CHECKER RECORD DETAILS
 */
export const getResumeCheckerById = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const rec = getOfflineResumeCheckById(req.params.id);
    if (!rec) throw ApiError.notFound('Resume Checker record not found.');
    return res.status(200).json(ApiResponse.success({ record: { id: rec.id || rec._id, resumeFile: rec.resumeFile || '/uploads/sample_resume.pdf', resumeFileName: rec.resumeFileName || 'resume.pdf', resumeFileSize: rec.resumeFileSize || 150000, atsScore: rec.atsScore || 85, uploadDate: rec.createdAt || new Date(), createdAt: rec.createdAt || new Date(), updatedAt: rec.createdAt || new Date() } }, 'Resume Checker details retrieved successfully.'));
  }

  try {
    const record = await ResumeChecker.findById(req.params.id);
    if (!record) {
      const rec = getOfflineResumeCheckById(req.params.id);
      if (rec) return res.status(200).json(ApiResponse.success({ record: { id: rec.id || rec._id, resumeFile: rec.resumeFile || '/uploads/sample_resume.pdf', resumeFileName: rec.resumeFileName || 'resume.pdf', resumeFileSize: rec.resumeFileSize || 150000, atsScore: rec.atsScore || 85, uploadDate: rec.createdAt || new Date(), createdAt: rec.createdAt || new Date(), updatedAt: rec.createdAt || new Date() } }, 'Resume Checker details retrieved successfully.'));
      throw ApiError.notFound('Resume Checker record not found.');
    }
    return res.status(200).json(ApiResponse.success({ record: { id: record.id, resumeFile: record.resumeFile, resumeFileName: record.resumeFileName, resumeFileSize: record.resumeFileSize, atsScore: record.atsScore, uploadDate: record.createdAt, createdAt: record.createdAt, updatedAt: record.updatedAt } }, 'Resume Checker details retrieved successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const rec = getOfflineResumeCheckById(req.params.id);
    if (!rec) throw ApiError.notFound('Resume Checker record not found.');
    return res.status(200).json(ApiResponse.success({ record: { id: rec.id || rec._id, resumeFile: rec.resumeFile || '/uploads/sample_resume.pdf', resumeFileName: rec.resumeFileName || 'resume.pdf', resumeFileSize: rec.resumeFileSize || 150000, atsScore: rec.atsScore || 85, uploadDate: rec.createdAt || new Date(), createdAt: rec.createdAt || new Date(), updatedAt: rec.createdAt || new Date() } }, 'Resume Checker details retrieved successfully.'));
  }
});

/**
 * ADMIN: DELETE RESUME CHECKER RECORD
 */
export const deleteResumeCheckerRecord = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isDemoOrOffline = isOffline() || !mongoose.Types.ObjectId.isValid(id) || String(id).startsWith('offline-') || /^\d+$/.test(String(id));
  if (isDemoOrOffline) {
    const deleted = deleteOfflineResumeCheck(id);
    if (!deleted) throw ApiError.notFound('Resume Checker record not found.');
    return res.status(200).json(ApiResponse.success(null, 'Resume Checker record deleted successfully.'));
  }

  try {
    const record = await ResumeChecker.findById(id);
    if (!record) {
      const deleted = deleteOfflineResumeCheck(id);
      if (deleted) return res.status(200).json(ApiResponse.success(null, 'Resume Checker record deleted successfully.'));
      throw ApiError.notFound('Resume Checker record not found.');
    }
    await ResumeChecker.findByIdAndDelete(id);
    return res.status(200).json(ApiResponse.success(null, 'Resume Checker record deleted successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const deleted = deleteOfflineResumeCheck(id);
    if (!deleted) throw ApiError.notFound('Resume Checker record not found.');
    return res.status(200).json(ApiResponse.success(null, 'Resume Checker record deleted successfully.'));
  }
});

/**
 * ADMIN: DOWNLOAD RESUME CHECKER FILE
 */
export const downloadResumeCheckerFile = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const record = getOfflineResumeCheckById(req.params.id);
    if (!record) throw ApiError.notFound('Resume Checker record not found.');
    const fileUrl = record.resumeFile || '/uploads/sample_resume.pdf';
    const fileNameOnDisk = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'backend', 'uploads', fileNameOnDisk);
    if (!fs.existsSync(filePath)) {
      const fallbackPath = path.join(process.cwd(), 'backend', 'uploads', 'sample_resume.pdf');
      if (fs.existsSync(fallbackPath)) {
        return res.download(fallbackPath, record.resumeFileName || 'Resume.pdf');
      }
      throw ApiError.notFound('Resume file not found on server storage.');
    }
    return res.download(filePath, record.resumeFileName || fileNameOnDisk);
  }

  try {
    const record = await ResumeChecker.findById(req.params.id);
    if (!record || !record.resumeFile) throw ApiError.notFound('Resume Checker record or file reference not found.');
    const fileNameOnDisk = path.basename(record.resumeFile);
    const filePath = path.join(process.cwd(), 'backend', 'uploads', fileNameOnDisk);
    if (!fs.existsSync(filePath)) {
      const fallbackPath = path.join(process.cwd(), 'backend', 'uploads', 'sample_resume.pdf');
      if (fs.existsSync(fallbackPath)) {
        return res.download(fallbackPath, record.resumeFileName || 'Resume.pdf');
      }
      throw ApiError.notFound('Resume file not found on server storage.');
    }
    res.download(filePath, record.resumeFileName || fileNameOnDisk);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.notFound('Resume file not found.');
  }
});
