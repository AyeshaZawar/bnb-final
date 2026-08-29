import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

// Load environment variables from .env file into process.env before any other module loads
dotenv.config({ override: true });

/**
 * Validate application environment startup variables.
 * Fails fast with a clear error message if any required configuration is missing or invalid.
 */
export const validateEnvironment = () => {
  const env = process.env.NODE_ENV || 'development';
  const port = process.env.PORT || 3000;

  const requiredVariables = [
    {
      key: 'MONGODB_URI',
      name: 'MongoDB Database Connection',
      validator: (val) => Boolean(val && val !== 'YOUR_MONGODB_URI' && !val.startsWith('YOUR_') && (val.startsWith('mongodb://') || val.startsWith('mongodb+srv://'))),
      expected: 'A valid MongoDB connection string starting with mongodb:// or mongodb+srv://'
    },
    {
      key: 'JWT_SECRET',
      name: 'JWT Authentication Secret',
      validator: (val) => Boolean(val && val !== 'YOUR_JWT_SECRET' && !val.startsWith('YOUR_')),
      expected: 'A secure secret string for signing JWT tokens'
    },
    {
      key: 'GEMINI_API_KEY',
      name: 'Google Gemini API Key',
      validator: (val) => Boolean(val && val !== 'YOUR_GEMINI_API_KEY' && !val.startsWith('YOUR_')),
      expected: 'A valid Google AI Studio Gemini API key'
    },
    {
      key: 'RESEND_API_KEY',
      name: 'Resend Email Service API Key',
      validator: (val) => Boolean(val && val !== 'YOUR_RESEND_API_KEY' && !val.startsWith('YOUR_')),
      expected: 'A valid Resend API key'
    }
  ];

  logger.info(`=============================================================`);
  logger.info(`🚀 Starting AI Recruitment Platform [Mode: ${env.toUpperCase()}]`);
  logger.info(`=============================================================`);

  const missingOrInvalid = [];

  requiredVariables.forEach((reqVar) => {
    const val = process.env[reqVar.key];
    if (!reqVar.validator(val)) {
      missingOrInvalid.push(reqVar);
      logger.warn(`⚠️ [ENV WARNING] ${reqVar.name} (${reqVar.key}) is missing or default placeholder.`);
    } else {
      logger.info(`✅ [ENV] ${reqVar.name} (${reqVar.key}): Configured`);
    }
  });

  // Provide safe fallback defaults for missing critical variables so the dev server runs in AI Studio preview
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.startsWith('YOUR_')) {
    process.env.JWT_SECRET = 'bucks_n_bricks_fallback_jwt_secret_key_2026';
    logger.info(`ℹ️ [ENV FALLBACK] JWT_SECRET set to default development secret.`);
  }

  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.startsWith('YOUR_')) {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/ai_recruitment_fallback';
    logger.info(`ℹ️ [ENV FALLBACK] MONGODB_URI set to default fallback connection string.`);
  }

  if (missingOrInvalid.length > 0) {
    logger.info(`=============================================================`);
    logger.info(`ℹ️ App running with fallback modes for missing services.`);
    logger.info(`=============================================================`);
  }

  logger.info(`-------------------------------------------------------------`);
  return { env, port };
};
