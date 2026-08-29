import { ApiError } from '../utils/ApiError.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundMiddleware = (req, res, next) => {
  next(ApiError.notFound(`Route non-existent or endpoint not found: ${req.originalUrl}`));
};
