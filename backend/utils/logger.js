/**
 * Logger Utility
 */
const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, ...meta) => {
    console.log(`[${getTimestamp()}] [INFO] ${message}`, ...meta);
  },
  warn: (message, ...meta) => {
    console.warn(`[${getTimestamp()}] [WARN] ${message}`, ...meta);
  },
  error: (message, ...meta) => {
    console.error(`[${getTimestamp()}] [ERROR] ${message}`, ...meta);
  },
  debug: (message, ...meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${getTimestamp()}] [DEBUG] ${message}`, ...meta);
    }
  },
};
