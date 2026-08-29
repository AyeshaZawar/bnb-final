import { Router } from 'express';
import {
  getSettings,
  getProfile,
  updateProfile,
  changeEmail,
  changePassword,
} from '../controllers/settingsController.js';
import {
  createSecondaryAdmin,
  getAllAdmins,
  getAdminById,
  updateSecondaryAdmin,
  activateSecondaryAdmin,
  deactivateSecondaryAdmin,
  toggleAdminStatus,
  deleteSecondaryAdmin,
} from '../controllers/adminController.js';
import { protectAdmin, authorize } from '../middleware/authMiddleware.js';
import { ADMIN_ROLES } from '../config/constants.js';

const router = Router();

// Protect ALL Settings routes - SUPER_ADMIN ONLY
// Secondary Admin accessing any Settings API will receive 403 Forbidden
router.use(protectAdmin);
router.use(authorize(ADMIN_ROLES.SUPER_ADMIN));

/**
 * Settings Overview
 */
router.get('/', getSettings);

/**
 * Settings Profile Section
 */
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

/**
 * Settings Security Section
 */
router.patch('/change-email', changeEmail);
router.patch('/email', changeEmail);
router.patch('/change-password', changePassword);
router.patch('/password', changePassword);

/**
 * Admin Management Section inside Settings
 */
router.post('/admins', createSecondaryAdmin);
router.get('/admins', getAllAdmins);
router.get('/admins/:id', getAdminById);
router.patch('/admins/:id', updateSecondaryAdmin);
router.patch('/admins/:id/activate', activateSecondaryAdmin);
router.patch('/admins/:id/deactivate', deactivateSecondaryAdmin);
router.patch('/admins/:id/status', toggleAdminStatus);
router.delete('/admins/:id', deleteSecondaryAdmin);

export default router;
