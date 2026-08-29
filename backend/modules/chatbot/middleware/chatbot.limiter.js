import rateLimit from 'express-rate-limit';

/**
 * Dedicated rate limiter for AI Chatbot endpoints
 * Limits requests to prevent abuse and API quota exhaustion
 */
export const chatbotLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 40, // Limit each IP to 40 chatbot requests per window
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
    forwardedHeader: false,
  },
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many messages sent to the AI Assistant from this IP. Please wait a few minutes before trying again.',
  },
});
