import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Health Check Controller
 * GET /api/v1/health
 */
export const getHealthStatus = asyncHandler(async (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  const healthInfo = {
    status: 'ONLINE',
    service: 'AI Recruitment Platform API',
    apiVersion: 'v1',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStateMap[dbState] || 'unknown',
      connected: dbState === 1,
    },
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
  };

  return res.status(200).json(ApiResponse.success(healthInfo, 'Server is healthy and operational'));
});
