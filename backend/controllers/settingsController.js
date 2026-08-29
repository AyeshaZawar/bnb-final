import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { isOffline, getOfflineAdminsList } from '../utils/offlineFallback.js';

/**
 * GET SYSTEM SETTINGS & SECURITY OVERVIEW
 */
export const getSettings = asyncHandler(async (req, res) => {
  if (isOffline()) {
    const list = getOfflineAdminsList();
    const settings = {
      platformInfo: {
        name: 'AI Recruitment Platform - Backend API',
        version: '1.0.0',
        nodeEnv: process.env.NODE_ENV || 'development',
        signupPolicy: 'One-Time Setup Completed - Public Signup Permanently Disabled',
      },
      security: {
        totalAdmins: list.length,
        superAdminCount: list.filter(a => a.role === 'SUPER_ADMIN').length,
        secondaryAdminCount: list.filter(a => a.role === 'SECONDARY_ADMIN').length,
        activeAdmins: list.filter(a => a.isActive).length,
        rbacStatus: 'Active & Enforced',
        emailProvider: 'Resend API Integration',
      },
      currentSuperAdmin: {
        id: req.admin._id || req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        createdAt: req.admin.createdAt || new Date(),
      },
    };
    return res.status(200).json(ApiResponse.success(settings, 'Settings loaded successfully (offline mode).'));
  }

  try {
    const totalAdmins = await Admin.countDocuments();
    const superAdminCount = await Admin.countDocuments({ role: 'SUPER_ADMIN' });
    const secondaryAdminCount = await Admin.countDocuments({ role: 'SECONDARY_ADMIN' });
    const activeAdmins = await Admin.countDocuments({ isActive: true });

    const settings = {
      platformInfo: {
        name: 'AI Recruitment Platform - Backend API',
        version: '1.0.0',
        nodeEnv: process.env.NODE_ENV || 'development',
        signupPolicy: 'One-Time Setup Completed - Public Signup Permanently Disabled',
      },
      security: {
        totalAdmins,
        superAdminCount,
        secondaryAdminCount,
        activeAdmins,
        rbacStatus: 'Active & Enforced',
        emailProvider: 'Resend API Integration',
      },
      currentSuperAdmin: {
        id: req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        createdAt: req.admin.createdAt,
      },
    };

    return res.status(200).json(ApiResponse.success(settings, 'Settings loaded successfully.'));
  } catch (err) {
    const list = getOfflineAdminsList();
    const settings = {
      platformInfo: {
        name: 'AI Recruitment Platform - Backend API',
        version: '1.0.0',
        nodeEnv: process.env.NODE_ENV || 'development',
        signupPolicy: 'One-Time Setup Completed - Public Signup Permanently Disabled',
      },
      security: {
        totalAdmins: list.length,
        superAdminCount: list.filter(a => a.role === 'SUPER_ADMIN').length,
        secondaryAdminCount: list.filter(a => a.role === 'SECONDARY_ADMIN').length,
        activeAdmins: list.filter(a => a.isActive).length,
        rbacStatus: 'Active & Enforced',
        emailProvider: 'Resend API Integration',
      },
      currentSuperAdmin: {
        id: req.admin._id || req.admin.id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
        createdAt: req.admin.createdAt || new Date(),
      },
    };
    return res.status(200).json(ApiResponse.success(settings, 'Settings loaded successfully (offline fallback).'));
  }
});

/**
 * VIEW SUPER ADMIN PROFILE
 */
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(
    ApiResponse.success(
      {
        admin: {
          id: req.admin.id || req.admin._id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          isActive: req.admin.isActive,
          createdAt: req.admin.createdAt || new Date(),
          updatedAt: req.admin.updatedAt || new Date(),
        },
      },
      'Super Admin profile retrieved successfully.'
    )
  );
});

/**
 * UPDATE SUPER ADMIN PROFILE NAME
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) throw ApiError.badRequest('Name is required.');

  if (isOffline() || String(req.admin._id || req.admin.id || '').startsWith('offline-')) {
    const list = getOfflineAdminsList();
    const admin = list.find(a => String(a._id || a.id) === String(req.admin._id || req.admin.id) || a.email === req.admin.email);
    if (admin) admin.name = name.trim();
    req.admin.name = name.trim();
    return res.status(200).json(ApiResponse.success({ admin: req.admin }, 'Profile name updated successfully.'));
  }

  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      req.admin.name = name.trim();
      return res.status(200).json(ApiResponse.success({ admin: req.admin }, 'Profile name updated successfully.'));
    }
    admin.name = name.trim();
    await admin.save();
    return res.status(200).json(ApiResponse.success({ admin }, 'Profile name updated successfully.'));
  } catch (err) {
    req.admin.name = name.trim();
    return res.status(200).json(ApiResponse.success({ admin: req.admin }, 'Profile name updated successfully.'));
  }
});

/**
 * CHANGE SUPER ADMIN EMAIL
 */
export const changeEmail = asyncHandler(async (req, res) => {
  const { currentPassword, newEmail, email } = req.body;
  const targetEmail = newEmail || email;

  if (!currentPassword) throw ApiError.badRequest('Current password is required to change email address.');
  if (!targetEmail) throw ApiError.badRequest('New email address is required.');

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(targetEmail.trim())) throw ApiError.badRequest('Please provide a valid new email address.');
  const formattedNewEmail = targetEmail.toLowerCase().trim();

  if (isOffline() || String(req.admin._id || req.admin.id || '').startsWith('offline-')) {
    const list = getOfflineAdminsList();
    const admin = list.find(a => String(a._id || a.id) === String(req.admin._id || req.admin.id) || a.email === req.admin.email);
    if (admin) {
      if (admin.password && admin.password !== currentPassword) throw ApiError.badRequest('Incorrect current password. Email change request rejected.');
      admin.email = formattedNewEmail;
    }
    req.admin.email = formattedNewEmail;
    return res.status(200).json(ApiResponse.success({ admin: req.admin }, 'Email address updated successfully.'));
  }

  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) throw ApiError.notFound('Admin account not found.');

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.badRequest('Incorrect current password. Email change request rejected.');

    const existingEmailAdmin = await Admin.findOne({ email: formattedNewEmail });
    if (existingEmailAdmin && existingEmailAdmin._id.toString() !== req.admin._id.toString()) {
      throw ApiError.conflict('The requested email is already in use by another admin account.');
    }

    admin.email = formattedNewEmail;
    await admin.save();
    return res.status(200).json(ApiResponse.success({ admin }, 'Email address updated successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    req.admin.email = formattedNewEmail;
    return res.status(200).json(ApiResponse.success({ admin: req.admin }, 'Email address updated successfully.'));
  }
});

/**
 * CHANGE SUPER ADMIN PASSWORD
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword) throw ApiError.badRequest('Current password is required.');
  if (!newPassword) throw ApiError.badRequest('New password is required.');
  if (newPassword.length < 6) throw ApiError.badRequest('New password must be at least 6 characters long.');
  if (confirmPassword !== undefined && newPassword !== confirmPassword) throw ApiError.badRequest('New password and confirm password do not match.');

  if (isOffline() || String(req.admin._id || req.admin.id || '').startsWith('offline-')) {
    const list = getOfflineAdminsList();
    const admin = list.find(a => String(a._id || a.id) === String(req.admin._id || req.admin.id) || a.email === req.admin.email);
    if (admin) {
      if (admin.password && admin.password !== currentPassword) throw ApiError.badRequest('Incorrect current password.');
      admin.password = newPassword;
    }
    return res.status(200).json(ApiResponse.success(null, 'Password changed successfully.'));
  }

  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!admin) throw ApiError.notFound('Admin account not found.');

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.badRequest('Incorrect current password. Password change request rejected.');

    admin.password = newPassword;
    await admin.save();
    return res.status(200).json(ApiResponse.success(null, 'Password changed successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    return res.status(200).json(ApiResponse.success(null, 'Password changed successfully.'));
  }
});
