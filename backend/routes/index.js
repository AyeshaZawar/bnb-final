import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import adminRoutes from './adminRoutes.js';
import jobRoutes from './jobRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import resumeCheckerRoutes from './resumeCheckerRoutes.js';
import contactRoutes from './contactRoutes.js';
import chatbotRoutes from '../modules/chatbot/chatbot.routes.js';
import { scoreMyResume } from '../controllers/resumeCheckerController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

/**
 * API Version 1 Main Router
 * Base Path: /api/v1
 */

// Mount Sub-routers
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);
router.use('/jobs', jobRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/applications', applicationRoutes);
router.use('/resume-checker', resumeCheckerRoutes);
router.use('/contact', contactRoutes);
router.use('/admin/contact', contactRoutes);
router.use('/chatbot', chatbotRoutes);
router.post('/score-my-resume', upload.single('resume'), scoreMyResume);

export default router;
