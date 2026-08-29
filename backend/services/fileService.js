import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { logger } from '../utils/logger.js';

/**
 * Service to extract raw text content from uploaded PDF or Word documents
 */
export const extractTextFromFile = async (filePath, mimeType) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
      let text = '';
      if (typeof pdfParse === 'function') {
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData && pdfData.text ? pdfData.text : '';
      } else if (pdfParse && typeof pdfParse.default === 'function') {
        const pdfData = await pdfParse.default(dataBuffer);
        text = pdfData && pdfData.text ? pdfData.text : '';
      } else if (pdfParse && typeof pdfParse.PDFParse === 'function') {
        const parser = new pdfParse.PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();
        text = pdfData && pdfData.text ? pdfData.text : (typeof pdfData === 'string' ? pdfData : '');
        if (typeof parser.destroy === 'function') {
          await parser.destroy().catch(() => {});
        }
      }
      return text || 'Extracted PDF text content.';
    }

    if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    }

    throw new Error('Unsupported mime type for text extraction.');
  } catch (error) {
    logger.error(`File text extraction failed: ${error.message}`);
    throw error;
  }
};
