import { validateEnvironment } from './config/env.js';
import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { logger } from './utils/logger.js';

// Handle Uncaught Exceptions first so fatal startup errors exit cleanly
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.name} - ${err.message}`);
  if (err.stack) logger.error(err.stack);
  process.exit(1);
});

// Validate environment variables at startup (fails fast if missing or invalid)
try {
  validateEnvironment();
} catch (err) {
  logger.error(`❌ Fatal Configuration Error: ${err.message}`);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

async function startServer() {
  // Create Express App first so HTTP server starts immediately
  const app = await createApp();

  const server = app.listen(PORT, HOST, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://${HOST}:${PORT}`);
    logger.info(`Health check endpoint available at: http://${HOST}:${PORT}/api/v1/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${PORT} is busy (EADDRINUSE).`);
    } else {
      logger.error(`Server error: ${err.message}`);
    }
  });

  // Connect to MongoDB
  connectDB().catch((err) => {
    logger.warn(`Database connection notice: ${err.message}`);
  });

  // Handle Unhandled Promise Rejections gracefully without killing the server
  process.on('unhandledRejection', (err) => {
    logger.error(`UNHANDLED REJECTION: ${err?.name || 'Error'} - ${err?.message || err}`);
  });

  // Graceful Shutdown Signals (SIGTERM, SIGINT)
  const shutdown = (signal) => {
    logger.info(`${signal} received. Closing HTTP server gracefully...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.error(`Failed to start server: ${err.message}`);
});

