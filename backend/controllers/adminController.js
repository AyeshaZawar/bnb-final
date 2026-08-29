import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { ADMIN_ROLES } from '../config/constants.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  isOffline,
  getOfflineAdminsList,
  createOfflineSecondaryAdmin,
  updateOfflineAdminStatus,
  deleteOfflineAdmin
} from '../utils/offlineFallback.js';

/**
 * CREATE SECONDARY ADMIN
 */
export const createSecondaryAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !name.trim()) throw ApiError.badRequest('Name is required.');
  if (!email || !email.trim()) throw ApiError.badRequest('Email is required.');

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email.trim())) throw ApiError.badRequest('Please enter a valid email address.');
  if (!password) throw ApiError.badRequest('Password is required.');
  if (password.length < 6) throw ApiError.badRequest('Password must be at least 6 characters long.');

  const normalizedEmail = email.toLowerCase().trim();
  const targetRole = role === ADMIN_ROLES.SUPER_ADMIN ? ADMIN_ROLES.SUPER_ADMIN : ADMIN_ROLES.SECONDARY_ADMIN;

  if (isOffline()) {
    const list = getOfflineAdminsList();
    if (list.some(a => a.email.toLowerCase() === normalizedEmail)) {
      throw ApiError.conflict('An admin account with this email address already exists.');
    }
    const admin = createOfflineSecondaryAdmin({ name: name.trim(), email: normalizedEmail, role: targetRole });
    return res.status(201).json(ApiResponse.created({ admin }, 'Secondary Admin account created successfully (offline mode).'));
  }

  try {
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) throw ApiError.conflict('An admin account with this email address already exists.');

    const secondaryAdmin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: targetRole,
      isActive: true,
    });

    return res.status(201).json(ApiResponse.created({ admin: secondaryAdmin }, 'Secondary Admin account created successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const admin = createOfflineSecondaryAdmin({ name: name.trim(), email: normalizedEmail, role: targetRole });
    return res.status(201).json(ApiResponse.created({ admin }, 'Secondary Admin account created successfully (offline fallback).'));
  }
});

/**
 * GET ALL ADMINS
 */
export const getAllAdmins = asyncHandler(async (req, res) => {
  if (isOffline()) {
    const list = getOfflineAdminsList();
    return res.status(200).json(
      ApiResponse.success(
        {
          count: list.length,
          admins: list.map((item) => ({
            id: item.id || item._id,
            name: item.name,
            email: item.email,
            role: item.role,
            isActive: item.isActive,
            status: item.isActive ? 'Active' : 'Inactive',
            createdAt: item.createdAt,
            createdDate: item.createdAt,
            updatedAt: item.createdAt,
          })),
        },
        'Admins retrieved successfully (offline mode).'
      )
    );
  }

  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    return res.status(200).json(
      ApiResponse.success(
        {
          count: admins.length,
          admins: admins.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            role: item.role,
            isActive: item.isActive,
            status: item.isActive ? 'Active' : 'Inactive',
            createdAt: item.createdAt,
            createdDate: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
        'Admins retrieved successfully.'
      )
    );
  } catch (err) {
    const list = getOfflineAdminsList();
    return res.status(200).json(
      ApiResponse.success(
        {
          count: list.length,
          admins: list.map((item) => ({
            id: item.id || item._id,
            name: item.name,
            email: item.email,
            role: item.role,
            isActive: item.isActive,
            status: item.isActive ? 'Active' : 'Inactive',
            createdAt: item.createdAt,
            createdDate: item.createdAt,
            updatedAt: item.createdAt,
          })),
        },
        'Admins retrieved successfully (offline fallback).'
      )
    );
  }
});

/**
 * GET ADMIN BY ID
 */
export const getAdminById = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const list = getOfflineAdminsList();
    const admin = list.find(a => String(a._id || a.id) === String(req.params.id));
    if (!admin) throw ApiError.notFound('Admin account not found.');
    return res.status(200).json(ApiResponse.success({ admin: { id: admin.id || admin._id, name: admin.name, email: admin.email, role: admin.role, isActive: admin.isActive, status: admin.isActive ? 'Active' : 'Inactive', createdAt: admin.createdAt, createdDate: admin.createdAt, updatedAt: admin.createdAt } }, 'Admin details retrieved successfully.'));
  }

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      const list = getOfflineAdminsList();
      const offAdmin = list.find(a => String(a._id || a.id) === String(req.params.id));
      if (offAdmin) return res.status(200).json(ApiResponse.success({ admin: { id: offAdmin.id || offAdmin._id, name: offAdmin.name, email: offAdmin.email, role: offAdmin.role, isActive: offAdmin.isActive, status: offAdmin.isActive ? 'Active' : 'Inactive', createdAt: offAdmin.createdAt, createdDate: offAdmin.createdAt, updatedAt: offAdmin.createdAt } }, 'Admin details retrieved successfully.'));
      throw ApiError.notFound('Admin account not found.');
    }
    return res.status(200).json(ApiResponse.success({ admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, isActive: admin.isActive, status: admin.isActive ? 'Active' : 'Inactive', createdAt: admin.createdAt, createdDate: admin.createdAt, updatedAt: admin.updatedAt } }, 'Admin details retrieved successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const list = getOfflineAdminsList();
    const admin = list.find(a => String(a._id || a.id) === String(req.params.id));
    if (!admin) throw ApiError.notFound('Admin account not found.');
    return res.status(200).json(ApiResponse.success({ admin: { id: admin.id || admin._id, name: admin.name, email: admin.email, role: admin.role, isActive: admin.isActive, status: admin.isActive ? 'Active' : 'Inactive', createdAt: admin.createdAt, createdDate: admin.createdAt, updatedAt: admin.createdAt } }, 'Admin details retrieved successfully.'));
  }
});

/**
 * UPDATE SECONDARY ADMIN DETAILS
 */
export const updateSecondaryAdmin = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const list = getOfflineAdminsList();
    const admin = list.find(a => String(a._id || a.id) === String(req.params.id));
    if (!admin) throw ApiError.notFound('Admin account not found.');
    if (name) admin.name = name.trim();
    if (email) admin.email = email.toLowerCase().trim();
    if (role) admin.role = role;
    return res.status(200).json(ApiResponse.success({ admin }, 'Admin updated successfully.'));
  }

  try {
    const adminToUpdate = await Admin.findById(req.params.id);
    if (!adminToUpdate) {
      const list = getOfflineAdminsList();
      const offAdmin = list.find(a => String(a._id || a.id) === String(req.params.id));
      if (offAdmin) {
        if (name) offAdmin.name = name.trim();
        if (email) offAdmin.email = email.toLowerCase().trim();
        if (role) offAdmin.role = role;
        return res.status(200).json(ApiResponse.success({ admin: offAdmin }, 'Admin updated successfully.'));
      }
      throw ApiError.notFound('Admin account not found.');
    }

    if (name && name.trim()) adminToUpdate.name = name.trim();
    if (email && email.trim()) adminToUpdate.email = email.toLowerCase().trim();
    if (role) adminToUpdate.role = role;
    await adminToUpdate.save();
    return res.status(200).json(ApiResponse.success({ admin: adminToUpdate }, 'Admin updated successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const list = getOfflineAdminsList();
    const admin = list.find(a => String(a._id || a.id) === String(req.params.id));
    if (!admin) throw ApiError.notFound('Admin account not found.');
    if (name) admin.name = name.trim();
    if (email) admin.email = email.toLowerCase().trim();
    if (role) admin.role = role;
    return res.status(200).json(ApiResponse.success({ admin }, 'Admin updated successfully.'));
  }
});

/**
 * ACTIVATE SECONDARY ADMIN
 */
export const activateSecondaryAdmin = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const admin = updateOfflineAdminStatus(req.params.id, true);
    if (!admin) throw ApiError.notFound('Admin account not found.');
    return res.status(200).json(ApiResponse.success({ admin }, 'Secondary Admin activated successfully.'));
  }

  try {
    const targetAdmin = await Admin.findById(req.params.id);
    if (!targetAdmin) {
      const admin = updateOfflineAdminStatus(req.params.id, true);
      if (admin) return res.status(200).json(ApiResponse.success({ admin }, 'Secondary Admin activated successfully.'));
      throw ApiError.notFound('Admin account not found.');
    }
    targetAdmin.isActive = true;
    await targetAdmin.save();
    return res.status(200).json(ApiResponse.success({ admin: targetAdmin }, 'Secondary Admin activated successfully.'));
  } catch (err) {
    const admin = updateOfflineAdminStatus(req.params.id, true);
    if (!admin) throw ApiError.notFound('Admin account not found.');
    return res.status(200).json(ApiResponse.success({ admin }, 'Secondary Admin activated successfully.'));
  }
});

/**
 * DEACTIVATE SECONDARY ADMIN
 */
export const deactivateSecondaryAdmin = asyncHandler(async (req, res) => {
  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const admin = updateOfflineAdminStatus(req.params.id, false);
    if (!admin) throw ApiError.notFound('Admin account not found.');
    return res.status(200).json(ApiResponse.success({ admin }, 'Secondary Admin deactivated successfully.'));
  }

  try {
    const targetAdmin = await Admin.findById(req.params.id);
    if (!targetAdmin) {
      const admin = updateOfflineAdminStatus(req.params.id, false);
      if (admin) return res.status(200).json(ApiResponse.success({ admin }, 'Secondary Admin deactivated successfully.'));
      throw ApiError.notFound('Admin account not found.');
    }
    targetAdmin.isActive = false;
    await targetAdmin.save();
    return res.status(200).json(ApiResponse.success({ admin: targetAdmin }, 'Secondary Admin deactivated successfully.'));
  } catch (err) {
    const admin = updateOfflineAdminStatus(req.params.id, false);
    if (!admin) throw ApiError.notFound('Admin account not found.');
    return res.status(200).json(ApiResponse.success({ admin }, 'Secondary Admin deactivated successfully.'));
  }
});

/**
 * TOGGLE ACTIVE STATUS OF SECONDARY ADMIN
 */
export const toggleAdminStatus = asyncHandler(async (req, res) => {
  let isActive = req.body.isActive;
  if (req.body.status !== undefined) {
    isActive = req.body.status === 'Active' || req.body.status === true;
  }

  if (isOffline() || String(req.params.id).startsWith('offline-')) {
    const admin = updateOfflineAdminStatus(req.params.id, isActive);
    if (!admin) throw ApiError.notFound('Admin account not found.');
    const statusText = isActive ? 'activated' : 'deactivated';
    return res.status(200).json(ApiResponse.success({ admin }, `Secondary Admin ${statusText} successfully.`));
  }

  try {
    const targetAdmin = await Admin.findById(req.params.id);
    if (!targetAdmin) {
      const admin = updateOfflineAdminStatus(req.params.id, isActive);
      if (admin) return res.status(200).json(ApiResponse.success({ admin }, `Secondary Admin ${isActive ? 'activated' : 'deactivated'} successfully.`));
      throw ApiError.notFound('Admin account not found.');
    }
    targetAdmin.isActive = isActive;
    await targetAdmin.save();
    const statusText = isActive ? 'activated' : 'deactivated';
    return res.status(200).json(ApiResponse.success({ admin: targetAdmin }, `Secondary Admin ${statusText} successfully.`));
  } catch (err) {
    const admin = updateOfflineAdminStatus(req.params.id, isActive);
    if (!admin) throw ApiError.notFound('Admin account not found.');
    const statusText = isActive ? 'activated' : 'deactivated';
    return res.status(200).json(ApiResponse.success({ admin }, `Secondary Admin ${statusText} successfully.`));
  }
});

/**
 * DELETE SECONDARY ADMIN
 */
export const deleteSecondaryAdmin = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isDemoOrOffline = isOffline() || !mongoose.Types.ObjectId.isValid(id) || String(id).startsWith('offline-') || /^\d+$/.test(String(id));
  if (isDemoOrOffline) {
    const deleted = deleteOfflineAdmin(id);
    if (!deleted) throw ApiError.notFound('Secondary Admin account not found.');
    return res.status(200).json(ApiResponse.success(null, 'Secondary Admin account deleted successfully.'));
  }

  try {
    const targetAdmin = await Admin.findById(id);
    if (!targetAdmin) {
      const deleted = deleteOfflineAdmin(id);
      if (deleted) return res.status(200).json(ApiResponse.success(null, 'Secondary Admin account deleted successfully.'));
      throw ApiError.notFound('Secondary Admin account not found.');
    }
    await Admin.findByIdAndDelete(id);
    return res.status(200).json(ApiResponse.success(null, 'Secondary Admin account deleted successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const deleted = deleteOfflineAdmin(id);
    if (!deleted) throw ApiError.notFound('Secondary Admin account not found.');
    return res.status(200).json(ApiResponse.success(null, 'Secondary Admin account deleted successfully.'));
  }
});
