import { ApiError } from '../../../utils/ApiError.js';

/**
 * Validator for chatbot message request
 */
export const validateChatMessage = (req, res, next) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return next(ApiError.badRequest('Message is required and must be a valid string.'));
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return next(ApiError.badRequest('Message cannot be empty.'));
  }

  if (trimmedMessage.length > 1000) {
    return next(ApiError.badRequest('Message exceeds maximum allowed length of 1000 characters.'));
  }

  // Validate history if provided
  if (history && !Array.isArray(history)) {
    return next(ApiError.badRequest('Chat history must be an array of previous messages.'));
  }

  if (history && Array.isArray(history)) {
    if (history.length > 20) {
      // Keep only last 20 messages to prevent excessive token usage
      req.body.history = history.slice(-20);
    }
  }

  req.body.message = trimmedMessage;
  next();
};
