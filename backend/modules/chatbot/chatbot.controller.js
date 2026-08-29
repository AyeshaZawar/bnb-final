import { asyncHandler } from '../../middleware/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { processVisitorChatMessage } from './chatbot.service.js';

/**
 * Controller to handle visitor chatbot messages
 * POST /api/v1/chatbot/message
 */
export const handleChatMessage = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  const result = await processVisitorChatMessage(message, history || []);

  return res.status(200).json(
    ApiResponse.success(
      result,
      'Chatbot response generated successfully.'
    )
  );
});
