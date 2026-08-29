import { Router } from 'express';
import {
  createJob,
  getPublicJobs,
  getPublicJobById,
  getAdminJobs,
  getAdminJobById,
  updateJob,
  deleteJob,
  publishJob,
  unpublishJob,
  closeJob,
  reopenJob,
} from '../controllers/jobController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * PUBLIC JOB ROUTES (No authentication required)
 */
// View all published jobs (with search, filter, pagination, sorting)
router.get('/', getPublicJobs);

/**
 * PROTECTED ADMIN JOB ROUTES (Requires Admin JWT Token)
 */

// Get all jobs for admin dashboard (includes Draft, Published, Closed)
router.get('/admin/all', protectAdmin, getAdminJobs);

// Get single job details for admin
router.get('/admin/:id', protectAdmin, getAdminJobById);

// Add new job
router.post('/', protectAdmin, createJob);

// Update existing job
router.patch('/:id', protectAdmin, updateJob);

// Delete job
router.delete('/:id', protectAdmin, deleteJob);

// Job Status Actions
router.patch('/:id/publish', protectAdmin, publishJob);
router.patch('/:id/unpublish', protectAdmin, unpublishJob);
router.patch('/:id/close', protectAdmin, closeJob);
router.patch('/:id/reopen', protectAdmin, reopenJob);

/**
 * PUBLIC SINGLE JOB ROUTE (Must be at the end to prevent parameter collision)
 */
router.get('/:id', getPublicJobById);

export default router;
