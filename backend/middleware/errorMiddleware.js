import { HTTP_STATUS } from '../config/constants.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

/**
 * Centralized Error Handling Middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Log error stack for debugging
  logger.error(`Error processing ${req.method} ${req.url}: ${err.message}`, {
    stack: err.stack,
  });

  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  // Handle Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    error = new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, errors);
  }

  // Handle JWT JsonWebTokenError
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token. Please log in again.');
  }

  // Handle JWT TokenExpiredError
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Your token has expired. Please log in again.');
  }

  // Handle Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, 'File size exceeds maximum allowed limit (10MB).');
  }

  // Fallback for generic/unhandled errors
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';
  const errors = error.errors || [];

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
