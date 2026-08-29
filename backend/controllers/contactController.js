import mongoose from 'mongoose';
import { Contact } from '../models/Contact.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  isOffline,
  getOfflineContactsResult,
  getOfflineContactById,
  createOfflineContact,
  deleteOfflineContact
} from '../utils/offlineFallback.js';

/**
 * PUBLIC: SUBMIT CONTACT US FORM
 */
export const submitContact = asyncHandler(async (req, res) => {
  const { name, fullName, email, phoneNumber, phone, subject, message } = req.body;
  const candidateName = name || fullName;
  const candidatePhone = phoneNumber || phone;

  if (!candidateName || !email || !candidatePhone || !message) {
    throw ApiError.badRequest('Full Name, Email, Phone Number, and Message are required.');
  }

  if (isOffline()) {
    const newContact = createOfflineContact({
      name: candidateName,
      email,
      phoneNumber: candidatePhone,
      subject: subject || 'General Inquiry',
      message
    });
    return res.status(201).json(
      ApiResponse.created(newContact, 'Contact inquiry submitted successfully (offline mode).')
    );
  }

  const contact = await Contact.create({
    name: candidateName.trim(),
    email: email.toLowerCase().trim(),
    phoneNumber: candidatePhone.trim(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
  });

  return res.status(201).json(
    ApiResponse.created(contact, 'Contact inquiry submitted successfully.')
  );
});

/**
 * ADMIN: GET ALL CONTACT MESSAGES (PAGINATED WITH SEARCH)
 */
export const getContacts = asyncHandler(async (req, res) => {
  if (isOffline()) {
    const result = getOfflineContactsResult(req.query);
    return res.status(200).json(
      ApiResponse.success(result, 'Contact messages fetched successfully (offline mode).')
    );
  }

  const { search, page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (search) {
    const q = search.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { subject: { $regex: q, $options: 'i' } },
      { message: { $regex: q, $options: 'i' } }
    ];
  }

  const [total, messages] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
  ]);

  return res.status(200).json(
    ApiResponse.success(
      {
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
          hasNextPage: pageNum * limitNum < total,
          hasPrevPage: pageNum > 1,
        },
        messages,
      },
      'Contact messages fetched successfully.'
    )
  );
});

/**
 * ADMIN: GET SINGLE CONTACT MESSAGE BY ID
 */
export const getContactById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isDemoOrOffline = isOffline() || !mongoose.Types.ObjectId.isValid(id) || String(id).startsWith('offline-') || /^\d+$/.test(String(id));
  if (isDemoOrOffline) {
    const contact = getOfflineContactById(id);
    if (!contact) throw ApiError.notFound('Contact message not found.');
    return res.status(200).json(ApiResponse.success(contact, 'Contact message fetched successfully.'));
  }

  const contact = await Contact.findById(id);
  if (!contact) {
    const offlineContact = getOfflineContactById(id);
    if (offlineContact) return res.status(200).json(ApiResponse.success(offlineContact, 'Contact message fetched successfully.'));
    throw ApiError.notFound('Contact message not found.');
  }

  return res.status(200).json(ApiResponse.success(contact, 'Contact message fetched successfully.'));
});

/**
 * ADMIN: DELETE CONTACT MESSAGE
 */
export const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const isDemoOrOffline = isOffline() || !mongoose.Types.ObjectId.isValid(id) || String(id).startsWith('offline-') || /^\d+$/.test(String(id));
  if (isDemoOrOffline) {
    const deleted = deleteOfflineContact(id);
    if (!deleted) throw ApiError.notFound('Contact message not found.');
    return res.status(200).json(ApiResponse.success(null, 'Contact message deleted successfully.'));
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      const deleted = deleteOfflineContact(id);
      if (deleted) return res.status(200).json(ApiResponse.success(null, 'Contact message deleted successfully.'));
      throw ApiError.notFound('Contact message not found.');
    }
    await Contact.findByIdAndDelete(id);
    return res.status(200).json(ApiResponse.success(null, 'Contact message deleted successfully.'));
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const deleted = deleteOfflineContact(id);
    if (!deleted) throw ApiError.notFound('Contact message not found.');
    return res.status(200).json(ApiResponse.success(null, 'Contact message deleted successfully.'));
  }
});
