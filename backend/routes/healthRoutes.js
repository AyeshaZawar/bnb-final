import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Get API health status, DB connectivity, uptime, memory stats
 * @access  Public
 */
router.get('/health', getHealthStatus);

export default router;
