import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connect to MongoDB Atlas via Mongoose
 */
export const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI || mongoURI === 'YOUR_MONGODB_URI' || mongoURI.startsWith('YOUR_') || (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://'))) {
      const msg = 'MONGODB_URI environment variable is missing or placeholder. Running without direct MongoDB connection.';
      logger.warn(`⚠️ [DATABASE NOTICE] ${msg}`);
      mongoose.set('bufferCommands', false);
      return false;
    }

    // Sanitize user typos such as angle brackets around username/password placeholders in Atlas URIs
    mongoURI = mongoURI.replace(/<([^>]+)>/g, '$1');

    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      dbName: 'ai_recruitment',
      authSource: 'admin',
    };

    const conn = await mongoose.connect(mongoURI, options);

    logger.info(`MongoDB Connected Successfully: ${conn.connection.host} / Database: ${conn.connection.name}`);

    // Connection Event Listeners
    mongoose.connection.on('error', (err) => {
      logger.warn(`MongoDB connection notice: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected.');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully.');
    });

    return true;
  } catch (error) {
    logger.warn(`⚠️ [DATABASE NOTICE] MongoDB connection notice: ${error.message}. Running in offline fallback mode.`);
    mongoose.set('bufferCommands', false);
    return false;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected cleanly.');
  } catch (error) {
    logger.error(`Error disconnecting MongoDB: ${error.message}`);
  }
};
