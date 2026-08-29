import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Shield,
  ShieldAlert,
  Users,
  UserPlus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Edit2,
  Trash2,
  Power,
  Key,
  Server,
  RefreshCw,
} from 'lucide-react';
import { AdminUser, SystemSettings } from '../../types';
import {
  getSettingsOverview,
  updateSettingsProfile,
  changeSettingsEmail,
  changeSettingsPassword,
  getAllSecondaryAdmins,
  createSecondaryAdmin,
  updateSecondaryAdmin,
  toggleSecondaryAdminStatus,
  deleteSecondaryAdmin,
} from '../../services/api';

interface SettingsManagementProps {
  currentAdmin: AdminUser;
  onProfileUpdated?: (updatedAdmin: AdminUser) => void;
  onAdminDeleted?: () => void;
}

export function SettingsManagement({ currentAdmin, onProfileUpdated, onAdminDeleted }: SettingsManagementProps) {
  // Check if current user is Super Admin
  const isSuperAdmin = currentAdmin?.role === 'SUPER_ADMIN';

  // Active sub-tab inside Settings: 'profile' | 'security' | 'admins' | 'overview'
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'admins' | 'overview'>('profile');

  // Overview / System Stats state
  const [settingsData, setSettingsData] = useState<SystemSettings | null>(null);
  const [loadingOverview, setLoadingOverview] = useState<boolean>(false);

  // Profile Form state
  const [profileName, setProfileName] = useState<string>(currentAdmin?.name || '');
  const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);

  // Email Form state
  const [emailCurrentPassword, setEmailCurrentPassword] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [updatingEmail, setUpdatingEmail] = useState<boolean>(false);

  // Password Form state
  const [passCurrentPassword, setPassCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);

  // Secondary Admins List state
  const [secondaryAdmins, setSecondaryAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState<boolean>(false);

  // Create Admin Modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newAdminName, setNewAdminName] = useState<string>('');
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [newAdminPassword, setNewAdminPassword] = useState<string>('');
  const [creatingAdmin, setCreatingAdmin] = useState<boolean>(false);

  // Edit Admin Modal state
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editAdminName, setEditAdminName] = useState<string>('');
  const [editAdminStatus, setEditAdminStatus] = useState<boolean>(true);
  const [updatingAdmin, setUpdatingAdmin] = useState<boolean>(false);

  // Delete Admin Confirmation state
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
  const [deleteAdminName, setDeleteAdminName] = useState<string>('');
  const [deletingAdmin, setDeletingAdmin] = useState<boolean>(false);

  // Global Feedback state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load Settings Overview data
  const fetchOverview = async () => {
    if (!isSuperAdmin) return;
    setLoadingOverview(true);
    try {
      const data = await getSettingsOverview();
      setSettingsData(data);
    } catch (err: any) {
      // Catch unauthorized error
      setError(err.message || 'Failed to load system settings.');
    } finally {
      setLoadingOverview(false);
    }
  };

  // Load Secondary Admins
  const fetchAdmins = async () => {
    if (!isSuperAdmin) return;
    setLoadingAdmins(true);
    try {
      const list = await getAllSecondaryAdmins();
      setSecondaryAdmins(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load secondary admin accounts.');
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchOverview();
      fetchAdmins();
      setProfileName(currentAdmin.name);
    }
  }, [currentAdmin, isSuperAdmin]);

  // Clear messages automatically
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // 403 Forbidden Screen if user is NOT Super Admin
  if (!isSuperAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-10 shadow-xs font-sans">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold font-display text-[#011c30]">403 - Access Denied</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          You do not have sufficient permissions to access System Settings or Secondary Admin Management. This section is strictly restricted to Super Administrators.
        </p>
        <div className="pt-2">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
            Current Role: {currentAdmin?.role || 'SECONDARY_ADMIN'}
          </span>
        </div>
      </div>
    );
  }

  // Handle Profile Name Update
  const handleUpdateProfileName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setError('Profile name cannot be empty.');
      return;
    }
    setUpdatingProfile(true);
    setError(null);
    try {
      const updated = await updateSettingsProfile(profileName.trim());
      setSuccess('Profile name updated successfully.');
      if (onProfileUpdated) onProfileUpdated(updated);
      fetchOverview();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile name.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Handle Email Change
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCurrentPassword) {
      setError('Please enter your current password to verify identity.');
      return;
    }
    if (!newEmail.trim()) {
      setError('Please enter a new email address.');
      return;
    }
    setUpdatingEmail(true);
    setError(null);
    try {
      const updated = await changeSettingsEmail(emailCurrentPassword, newEmail.trim());
      setSuccess('Email address updated successfully.');
      setEmailCurrentPassword('');
      setNewEmail('');
      if (onProfileUpdated) onProfileUpdated(updated);
      fetchOverview();
    } catch (err: any) {
      setError(err.message || 'Failed to change email address.');
    } finally {
      setUpdatingEmail(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passCurrentPassword) {
      setError('Please enter your current password.');
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
    setUpdatingPassword(true);
    setError(null);
    try {
      await changeSettingsPassword(passCurrentPassword, newPassword, confirmPassword);
      setSuccess('Password updated successfully.');
      setPassCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Handle Create Secondary Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword) {
      setError('Please fill in all required fields for the new Secondary Admin.');
      return;
    }
    setCreatingAdmin(true);
    setError(null);
    try {
      await createSecondaryAdmin({
        name: newAdminName.trim(),
        email: newAdminEmail.trim(),
        password: newAdminPassword,
      });
      setSuccess(`Secondary Admin "${newAdminName}" created successfully.`);
      setShowCreateModal(false);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      fetchAdmins();
      fetchOverview();
    } catch (err: any) {
      setError(err.message || 'Failed to create Secondary Admin.');
    } finally {
      setCreatingAdmin(false);
    }
  };

  // Handle Edit Admin
  const handleEditAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setUpdatingAdmin(true);
    setError(null);
    try {
      await updateSecondaryAdmin(editingAdmin.id, {
        name: editAdminName.trim(),
      });
      await toggleSecondaryAdminStatus(editingAdmin.id, editAdminStatus);
      setSuccess(`Secondary Admin "${editAdminName}" updated.`);
      setEditingAdmin(null);
      fetchAdmins();
      fetchOverview();
    } catch (err: any) {
      setError(err.message || 'Failed to update admin account.');
    } finally {
      setUpdatingAdmin(false);
    }
  };

  // Handle Toggle Admin Active Status
  const handleToggleAdminStatus = async (id: string, currentActive: boolean, name: string) => {
    try {
      const nextActive = !currentActive;
      await toggleSecondaryAdminStatus(id, nextActive);
      setSuccess(`Admin account "${name}" ${nextActive ? 'activated' : 'deactivated'}.`);
      fetchAdmins();
      fetchOverview();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle admin status.');
    }
  };

  // Handle Delete Admin
  const executeDeleteAdmin = async () => {
    if (!deleteAdminId) return;
    setDeletingAdmin(true);
    setError(null);
    try {
      await deleteSecondaryAdmin(deleteAdminId);
      setSuccess(`Secondary Admin "${deleteAdminName}" deleted.`);
      setDeleteAdminId(null);
      fetchAdmins();
      fetchOverview();
      if (onAdminDeleted) onAdminDeleted();
    } catch (err: any) {
      setError(err.message || 'Failed to delete Secondary Admin.');
    } finally {
      setDeletingAdmin(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#011c30]">Settings & Security</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your Admin profile, security credentials, and secondary administrator accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-600" />
            Super Admin Protected
          </span>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <XCircle size={16} />
          </button>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-900 cursor-pointer">
            <XCircle size={16} />
          </button>
        </motion.div>
      )}

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#052842] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <User size={15} />
          <span>Profile Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#052842] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Lock size={15} />
          <span>Security & Credentials</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'admins'
              ? 'bg-[#052842] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users size={15} />
          <span>Secondary Admins ({secondaryAdmins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#052842] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Server size={15} />
          <span>System Overview</span>
        </button>
      </div>

      {/* TAB 1: PROFILE SECTION */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold font-display text-[#011c30]">Super Admin Profile</h2>
            <p className="text-xs text-slate-500">View and modify your public administrator identity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Details Display Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="p-3 bg-[#052842] text-white rounded-xl">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentAdmin.name}</h3>
                  <p className="text-slate-500">{currentAdmin.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">System Role</span>
                  <span className="font-bold text-[#052842]">{currentAdmin.role}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Status</span>
                  <span className="font-bold text-emerald-600">Active & Operational</span>
                </div>
              </div>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={handleUpdateProfileName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter administrator name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email Address (Read Only)</label>
                <input
                  type="email"
                  value={currentAdmin.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 text-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">To update email, use the Security tab.</span>
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="px-5 py-2.5 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2 disabled:opacity-50"
              >
                {updatingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & CREDENTIALS */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Email Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 text-[#052842] rounded-xl">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Change Email Address</h3>
                <p className="text-[11px] text-slate-500">Update your primary Super Admin contact email</p>
              </div>
            </div>

            <form onSubmit={handleChangeEmail} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={emailCurrentPassword}
                  onChange={(e) => setEmailCurrentPassword(e.target.value)}
                  placeholder="Verify identity with current password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. admin@company.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
              </div>

              <button
                type="submit"
                disabled={updatingEmail}
                className="w-full py-2.5 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updatingEmail ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Update Email Address</span>
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Change Password</h3>
                <p className="text-[11px] text-slate-500">Ensure account password is strong and unique</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passCurrentPassword}
                  onChange={(e) => setPassCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#052842]"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full py-2.5 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updatingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Change Password</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: SECONDARY ADMIN MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-bold font-display text-[#011c30]">Secondary Administrators</h2>
              <p className="text-xs text-slate-500">
                Grant or revoke secondary management access for recruiters and team members.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2 shrink-0"
            >
              <UserPlus size={16} />
              <span>Add Secondary Admin</span>
            </button>
          </div>

          {/* Admins Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loadingAdmins ? (
              <div className="py-16 text-center space-y-2">
                <Loader2 size={28} className="animate-spin text-[#052842] mx-auto" />
                <p className="text-xs text-slate-500">Loading administrator accounts...</p>
              </div>
            ) : secondaryAdmins.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Name & Email</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Created Date</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-700">
                    {secondaryAdmins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-bold text-[#011c30]">{adm.name}</div>
                          <div className="text-slate-500 text-[11px]">{adm.email}</div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                              adm.role === 'SUPER_ADMIN'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {adm.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Secondary Admin'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              adm.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {adm.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-500">
                          {new Date(adm.createdAt || Date.now()).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Toggle Active Status */}
                            {adm.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => handleToggleAdminStatus(adm.id, adm.isActive, adm.name)}
                                title={adm.isActive ? 'Deactivate Account' : 'Activate Account'}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  adm.isActive
                                    ? 'text-amber-600 hover:bg-amber-50'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                <Power size={16} />
                              </button>
                            )}

                            {/* Edit Admin */}
                            {adm.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => {
                                  setEditingAdmin(adm);
                                  setEditAdminName(adm.name);
                                  setEditAdminStatus(adm.isActive);
                                }}
                                title="Edit Admin Details"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#052842] hover:bg-slate-100 cursor-pointer transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}

                            {/* Delete Admin */}
                            {adm.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => {
                                  setDeleteAdminId(adm.id);
                                  setDeleteAdminName(adm.name);
                                }}
                                title="Delete Admin"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                No secondary admin accounts created yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold font-display text-[#011c30]">System & Security Overview</h2>
              <p className="text-xs text-slate-500">Live platform status and administrator analytics</p>
            </div>
            <button
              onClick={fetchOverview}
              className="p-2 text-slate-500 hover:text-[#052842] rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              title="Refresh System Stats"
            >
              <RefreshCw size={18} className={loadingOverview ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Admin Accounts</span>
              <span className="text-2xl font-extrabold text-[#052842] mt-1 block">
                {settingsData?.security?.totalAdmins ?? secondaryAdmins.length}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Super Administrators</span>
              <span className="text-2xl font-extrabold text-purple-700 mt-1 block">
                {settingsData?.security?.superAdminCount ?? 1}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Secondary Admins</span>
              <span className="text-2xl font-extrabold text-blue-700 mt-1 block">
                {settingsData?.security?.secondaryAdminCount ?? 0}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">RBAC Security Status</span>
              <span className="text-sm font-bold text-emerald-600 mt-1.5 block">
                {settingsData?.security?.rbacStatus || 'Active & Enforced'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SECONDARY ADMIN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-slate-200 text-left space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-display text-[#011c30]">Add Secondary Administrator</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. John Smith"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. john@company.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Initial Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingAdmin}
                  className="px-5 py-2 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl font-bold cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {creatingAdmin ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* EDIT SECONDARY ADMIN MODAL */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-slate-200 text-left space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-display text-[#011c30]">Edit Secondary Admin</h3>
              <button
                onClick={() => setEditingAdmin(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleEditAdminSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editAdminName}
                  onChange={(e) => setEditAdminName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#052842]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingAdmin.email}
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                <select
                  value={editAdminStatus ? 'Active' : 'Inactive'}
                  onChange={(e) => setEditAdminStatus(e.target.value === 'Active')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAdmin}
                  className="px-5 py-2 bg-[#052842] hover:bg-[#011c30] text-white rounded-xl font-bold cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {updatingAdmin ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteAdminId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full text-center space-y-4 border border-slate-200"
          >
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Delete Secondary Admin</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete the administrator account for{' '}
              <strong className="text-slate-900">"{deleteAdminName}"</strong>? This will revoke all dashboard access.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteAdminId(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteAdmin}
                disabled={deletingAdmin}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
              >
                {deletingAdmin ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Confirm Delete</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
