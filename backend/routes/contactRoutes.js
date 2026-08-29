import { Router } from 'express';
import {
  submitContact,
  getContacts,
  getContactById,
  deleteContact
} from '../controllers/contactController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * PUBLIC CONTACT ROUTE (No login required)
 */
// Route: POST /api/v1/contact
router.post('/', submitContact);

/**
 * PROTECTED ADMIN CONTACT ROUTES
 */
// Route: GET /api/v1/contact
router.get('/', protectAdmin, getContacts);

// Route: GET /api/v1/contact/:id
router.get('/:id', protectAdmin, getContactById);

// Route: DELETE /api/v1/contact/:id
router.delete('/:id', protectAdmin, deleteContact);

export default router;
