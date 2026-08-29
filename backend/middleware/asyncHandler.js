/**
 * Async Handler Middleware Wrapper
 * Wraps async express routes to eliminate try-catch blocks
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
