import { Router } from 'express';
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

// Protect ALL Admin Management routes - SUPER_ADMIN ONLY
router.use(protectAdmin);
router.use(authorize(ADMIN_ROLES.SUPER_ADMIN));

/**
 * Secondary Admin Management Routes
 */
router.post('/secondary-admins', createSecondaryAdmin);
router.get('/secondary-admins', getAllAdmins);
router.get('/secondary-admins/:id', getAdminById);
router.patch('/secondary-admins/:id', updateSecondaryAdmin);
router.patch('/secondary-admins/:id/activate', activateSecondaryAdmin);
router.patch('/secondary-admins/:id/deactivate', deactivateSecondaryAdmin);
router.patch('/secondary-admins/:id/status', toggleAdminStatus);
router.delete('/secondary-admins/:id', deleteSecondaryAdmin);

export default router;
