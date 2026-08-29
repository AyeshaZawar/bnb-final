import { Router } from 'express';
import { handleChatMessage } from './chatbot.controller.js';
import { validateChatMessage } from './validators/chatbot.validator.js';
import { chatbotLimiter } from './middleware/chatbot.limiter.js';

const router = Router();

/**
 * Isolated Chatbot Module Routes
 * Base path: /api/v1/chatbot
 */

// POST /api/v1/chatbot/message - Process visitor questions with rate limiting & validation
router.post('/message', chatbotLimiter, validateChatMessage, handleChatMessage);

export default router;
