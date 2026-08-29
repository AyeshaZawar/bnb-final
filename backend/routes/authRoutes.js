import { Router } from 'express';
import {
  getSetupStatus,
  setupSuperAdmin,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
} from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * Public Authentication Routes
 */
// Check setup status (if admin exists)
router.get('/setup-status', getSetupStatus);

// One-time Super Admin Signup
router.post('/setup-super-admin', setupSuperAdmin);

// Admin Login
router.post('/login', login);

// Forgot & Reset Password Flow
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/reset-password', resetPassword);

/**
 * Protected Authentication Routes
 */
router.use(protectAdmin);

// Change Password
router.patch('/change-password', changePassword);

// Get Current Logged-in Admin Profile
router.get('/me', getMe);

export default router;
