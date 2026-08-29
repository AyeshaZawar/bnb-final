import { Router } from 'express';
import {
  scoreMyResume,
  getAllResumeCheckerRecords,
  getResumeCheckerById,
  deleteResumeCheckerRecord,
  downloadResumeCheckerFile,
} from '../controllers/resumeCheckerController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * PUBLIC RESUME CHECKER ROUTE ("Score My Resume")
 * Accepts multipart/form-data with file field 'resume'
 */
router.post('/score-my-resume', upload.single('resume'), scoreMyResume);

/**
 * PROTECTED ADMIN RESUME CHECKER ROUTES (Requires Admin JWT Token)
 */

// Get all resume checker records (with search, filter, sort, pagination)
router.get('/', protectAdmin, getAllResumeCheckerRecords);
router.get('/admin/all', protectAdmin, getAllResumeCheckerRecords);

// Get single resume checker record details
router.get('/:id', protectAdmin, getResumeCheckerById);

// Delete resume checker record (Super Admin & Secondary Admin allowed)
router.delete('/:id', protectAdmin, deleteResumeCheckerRecord);

// Download resume checker file
router.get('/:id/download', protectAdmin, downloadResumeCheckerFile);

/**
 * PUBLIC ROOT POST HANDLER (Must be placed after specific routes to handle direct POST /api/v1/resume-checker)
 */
router.post('/', upload.single('resume'), scoreMyResume);

export default router;
