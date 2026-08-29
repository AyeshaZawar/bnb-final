import { getPublishedJobsKnowledge, getFullWebsiteKnowledge } from './knowledge.service.js';
import { generateChatReplyWithGemini } from './gemini.service.js';
import { logger } from '../../utils/logger.js';

/**
 * Chatbot Orchestration Service
 * Connects the secure knowledge gatekeeper with the AI response generator
 */
export const processVisitorChatMessage = async (userMessage, chatHistory = []) => {
  try {
    // 1. Retrieve secure filtered knowledge (ONLY Published Jobs + Dynamic Public Website Info)
    const publishedJobs = await getPublishedJobsKnowledge();
    const websiteKnowledge = await getFullWebsiteKnowledge();

    logger.debug(`Chatbot service processing message. Published jobs loaded: ${publishedJobs.length}, Dynamic pages: ${websiteKnowledge.dynamicSections?.length || 0}`);

    // 2. Generate secure AI reply
    const aiReply = await generateChatReplyWithGemini(
      userMessage,
      chatHistory,
      publishedJobs,
      websiteKnowledge
    );

    return {
      reply: aiReply,
      timestamp: new Date().toISOString(),
      knowledgeSourcesCount: {
        publishedJobs: publishedJobs.length,
        staticSections: Object.keys(websiteKnowledge).filter(k => k !== 'dynamicSections').length,
        dynamicPages: websiteKnowledge.dynamicSections ? websiteKnowledge.dynamicSections.length : 0
      }
    };
  } catch (error) {
    logger.error(`Error in processVisitorChatMessage: ${error.message}`);
    throw new Error('Failed to generate chatbot response. Please try again later.');
  }
};
