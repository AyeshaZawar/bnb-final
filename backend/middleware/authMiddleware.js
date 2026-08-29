import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwtHelper.js';
import { Admin } from '../models/Admin.js';
import { asyncHandler } from './asyncHandler.js';

/**
 * Middleware to verify JWT and authenticate Admin
 */
export const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required. Please provide a valid Bearer token.');
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please log in again.');
    }
    throw ApiError.unauthorized('Invalid authentication token. Please log in again.');
  }

  // 3. Check if admin still exists (with offline fallback resilience)
  let admin = null;
  const idStr = String(decoded.id || '');
  if (mongoose.connection.readyState === 1 && !idStr.startsWith('offline-')) {
    try {
      admin = await Admin.findById(decoded.id);
    } catch (err) {
      admin = null;
    }
  }

  if (!admin && global.offlineAdmins) {
    admin = global.offlineAdmins.find(a => String(a._id || a.id) === idStr || (decoded.email && a.email && a.email.toLowerCase() === decoded.email.toLowerCase()));
  }

  if (!admin && (idStr.startsWith('offline-') || mongoose.connection.readyState !== 1)) {
    admin = {
      _id: decoded.id,
      id: decoded.id,
      email: decoded.email || 'admin@bucksnbricks.com',
      role: decoded.role || 'SUPER_ADMIN',
      isActive: true,
      name: 'Super Admin',
    };
    global.offlineAdmins = global.offlineAdmins || [];
    if (!global.offlineAdmins.some(a => a.email && admin.email && a.email.toLowerCase() === admin.email.toLowerCase())) {
      global.offlineAdmins.push(admin);
    }
  }

  if (!admin) {
    throw ApiError.unauthorized('The admin account belonging to this token no longer exists.');
  }

  // 4. Check if admin account is active
  if (!admin.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact the Super Admin.');
  }

  // 5. Grant access by storing admin in request object
  req.admin = admin;
  next();
});

/**
 * Middleware to restrict access to specific Admin Roles
 * @param {...string} allowedRoles - Allowed roles (e.g. 'SUPER_ADMIN')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return next(
        ApiError.forbidden(
          `Forbidden Access: Role '${req.admin.role}' does not have permission to access this resource.`
        )
      );
    }

    next();
  };
};
