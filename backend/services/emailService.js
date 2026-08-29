import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

let resendClient = null;

const getResendClient = () => {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY' || apiKey.startsWith('YOUR_')) {
      throw new Error('RESEND_API_KEY environment variable is missing or invalid in .env.');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

/**
 * Send an email using Resend API
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body content
 * @param {string} [options.text] - Optional plain text body content
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const resend = getResendClient();
    const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const response = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
      ...(text && { text }),
    });

    if (response.error) {
      logger.error(`Resend Email Error: ${response.error.message}`);
      throw new Error(`Email delivery failed: ${response.error.message}`);
    }

    logger.info(`Email sent successfully via Resend to ${to} (ID: ${response.data?.id})`);
    return { success: true, id: response.data?.id };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
};

/**
 * Helper to send password reset emails
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Complete URL for resetting password
 */
export const sendPasswordResetEmail = async (to, resetToken, resetUrl) => {
  const subject = 'Password Reset Request - AI Recruitment Platform';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #011c30;">Password Reset Request</h2>
      <p>You requested a password reset for your AI Recruitment Platform account.</p>
      <p>Please click the button below to reset your password. This link is valid for 10 minutes.</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #1d78bc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 15px 0;">Reset Password</a>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">If you did not request this email, please ignore it.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
};
