import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Mail, Lock, CheckCircle, AlertCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { forgotPassword, resetPassword } from '../../services/api';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSuccessReturnToLogin: () => void;
}

export function ForgotPasswordModal({ onClose, onSuccessReturnToLogin }: ForgotPasswordModalProps) {
  // Steps: 'email' | 'reset' | 'success'
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');

  // Step 1 state
  const [email, setEmail] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Step 2 state
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingReset, setLoadingReset] = useState(false);

  // General feedback
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Step 1: Request Password Reset
  const handleRequestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoadingEmail(true);
    setError(null);
    try {
      const msg = await forgotPassword(email.trim());
      setSuccessMsg(msg || 'Password reset instruction has been sent to your email.');
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset. Please verify your email address.');
    } finally {
      setLoadingEmail(false);
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim()) {
      setError('Please enter the verification code / token.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    setLoadingReset(true);
    setError(null);
    try {
      const msg = await resetPassword(resetToken.trim(), newPassword);
      setSuccessMsg(msg || 'Password reset successfully.');
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired reset token.');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
        >
          <XCircle size={22} />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-[#052842] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <KeyRound size={24} />
          </div>
          <h2 className="text-xl font-bold font-display text-[#011c30]">Forgot Password</h2>
          <p className="text-xs text-slate-500">
            {step === 'email' && 'Enter your administrator email address to request a reset.'}
            {step === 'reset' && 'Enter the reset token received and choose a new password.'}
            {step === 'success' && 'Your password has been successfully reset!'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && step !== 'success' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Email Request */}
        {step === 'email' && (
          <form onSubmit={handleRequestEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Administrator Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingEmail}
              className="w-full py-2.5 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingEmail ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>Send Verification Code</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('reset')}
              className="w-full text-center text-xs text-slate-500 hover:text-[#052842] font-semibold hover:underline cursor-pointer block"
            >
              Already have a reset token? Skip to reset password →
            </button>
          </form>
        )}

        {/* STEP 2: Reset Password Form */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reset Token / Verification Code</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Enter reset token"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loadingReset}
                className="flex-1 py-2.5 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingReset ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Reset Password</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <p className="text-xs text-slate-600">
              Your password has been changed successfully. You can now log in using your new password.
            </p>
            <button
              onClick={() => {
                onClose();
                onSuccessReturnToLogin();
              }}
              className="w-full py-2.5 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
