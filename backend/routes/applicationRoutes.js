import { Router } from 'express';
import {
  applyForJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  downloadApplicationResume,
} from '../controllers/applicationController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * PUBLIC APPLICATION ROUTES (No login required)
 */

// Route: POST /api/v1/applications/apply (jobId in form field or body)
router.post('/apply', upload.single('resume'), applyForJob);

// Route: POST /api/v1/applications/jobs/:jobId/apply
router.post('/jobs/:jobId/apply', upload.single('resume'), applyForJob);

/**
 * PROTECTED ADMIN APPLICATION ROUTES (Requires Admin JWT Token)
 */

// Get all applications (with search, status filter, sorting & pagination)
router.get('/', protectAdmin, getAllApplications);
router.get('/admin/all', protectAdmin, getAllApplications);

// Get single application details
router.get('/:id', protectAdmin, getApplicationById);

// Update candidate status (Pending, Reviewed, Shortlisted, Rejected, Hired)
router.patch('/:id/status', protectAdmin, updateApplicationStatus);

// Delete application (Super Admin & Secondary Admin allowed)
router.delete('/:id', protectAdmin, deleteApplication);

// Download application resume file
router.get('/:id/download', protectAdmin, downloadApplicationResume);

export default router;
