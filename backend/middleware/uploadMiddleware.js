import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { FILE_UPLOAD_CONFIG } from '../config/constants.js';
import { ApiError } from '../utils/ApiError.js';

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File Filter Validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isAllowedExt = FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(ext);
  const isAllowedMime = FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (isAllowedExt && isAllowedMime) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file format. Allowed formats: ${FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: FILE_UPLOAD_CONFIG.MAX_FILE_SIZE,
  },
  fileFilter,
});
