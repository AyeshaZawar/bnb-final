import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Lock, Mail, User, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { setupSuperAdmin } from '../../services/api';
import { AdminUser } from '../../types';

interface SuperAdminSetupProps {
  onSetupSuccess: (admin: AdminUser) => void;
  onBackToPublic?: () => void;
}

export function SuperAdminSetup({ onSetupSuccess, onBackToPublic }: SuperAdminSetupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setupSuperAdmin(name.trim(), email.trim().toLowerCase(), password);
      onSetupSuccess(res.admin);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Super Admin account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#011c30] text-slate-100 flex flex-col items-center justify-center p-4 antialiased">
      <div className="bg-white text-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-left space-y-6 my-8">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold uppercase tracking-wider mb-1">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>Initial System Setup</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-[#011c30]">Create First Super Admin</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            No administrator accounts exist in the database. Initialize your recruitment platform by setting up your primary Super Admin credentials.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-900">
            <AlertTriangle size={15} className="shrink-0 text-blue-600" />
            <span>One-Time System Initialization</span>
          </div>
          <p className="text-blue-700 text-[11px]">
            This page is only accessible when 0 admins exist in the system. Once created, public registration will be permanently disabled automatically.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Super Admin Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. System Administrator"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bucksnbricks.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Master Password * (Min 6 chars)</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Master Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#052842] hover:bg-[#011c30] text-white text-sm font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 pt-3"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            <span>Initialize & Create Super Admin</span>
          </button>
        </form>

        {onBackToPublic && (
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onBackToPublic}
              className="text-xs font-semibold text-slate-500 hover:text-[#052842] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Public Website</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
