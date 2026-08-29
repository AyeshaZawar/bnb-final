import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protect ALL Dashboard routes - SUPER_ADMIN and SECONDARY_ADMIN allowed
router.use(protectAdmin);

/**
 * @route   GET /api/v1/dashboard
 * @desc    Get dashboard metrics (Total jobs, active jobs, closed jobs, draft jobs, applications, ATS scans)
 * @access  Private (SUPER_ADMIN, SECONDARY_ADMIN)
 */
router.get('/', getDashboardStats);

export default router;
