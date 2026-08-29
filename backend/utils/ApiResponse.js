import { HTTP_STATUS } from '../config/constants.js';

/**
 * Standardized API Response Formatter
 */
export class ApiResponse {
  constructor(statusCode = HTTP_STATUS.OK, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return new ApiResponse(statusCode, data, message);
  }

  static created(data = null, message = 'Resource Created Successfully') {
    return new ApiResponse(HTTP_STATUS.CREATED, data, message);
  }
}
