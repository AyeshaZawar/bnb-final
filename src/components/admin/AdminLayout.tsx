import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileSearch,
  Settings as SettingsIcon,
  LogOut,
  Lock,
  User,
  ShieldAlert,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { VacancyManagement } from './VacancyManagement';
import { ApplicationsManagement } from './ApplicationsManagement';
import { ResumeCheckerManagement } from './ResumeCheckerManagement';
import { ContactMessagesManagement } from './ContactMessagesManagement';
import { SettingsManagement } from './SettingsManagement';
import { DashboardOverview } from './DashboardOverview';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { SuperAdminSetup } from './SuperAdminSetup';
import {
  getMe,
  adminLogin,
  removeAuthToken,
  getAuthToken,
  getSetupStatus,
  getAdminPanelRoute,
} from '../../services/api';
import { AdminUser } from '../../types';

interface AdminLayoutProps {
  subRoute?: 'setup' | 'login' | 'dashboard' | 'default';
  onNavigateSubRoute?: (subRoute: 'setup' | 'login' | 'dashboard') => void;
  onBackToPublic?: () => void;
}

export function AdminLayout({ subRoute = 'default', onNavigateSubRoute, onBackToPublic }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vacancies' | 'applications' | 'resume-checker' | 'contacts' | 'settings'>('vacancies');
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Check backend setup status and auth token
  const checkStatusAndAuth = async () => {
    setLoading(true);
    try {
      const status = await getSetupStatus();
      setAdminExists(status.adminExists);

      if (!status.adminExists) {
        // No admin in DB -> Public Setup MUST be shown
        removeAuthToken();
        setCurrentAdmin(null);
        if (onNavigateSubRoute && subRoute !== 'setup') {
          onNavigateSubRoute('setup');
        }
      } else {
        // Admin exists -> Setup page is disabled
        if (subRoute === 'setup' && onNavigateSubRoute) {
          onNavigateSubRoute('login');
        }

        const token = getAuthToken();
        if (token) {
          try {
            const admin = await getMe();
            setCurrentAdmin(admin);
            if (onNavigateSubRoute && (subRoute === 'login' || subRoute === 'default')) {
              onNavigateSubRoute('dashboard');
            }
          } catch {
            removeAuthToken();
            setCurrentAdmin(null);
            if (onNavigateSubRoute && subRoute !== 'login') {
              onNavigateSubRoute('login');
            }
          }
        } else {
          setCurrentAdmin(null);
          if (onNavigateSubRoute && subRoute !== 'login') {
            onNavigateSubRoute('login');
          }
        }
      }
    } catch (err) {
      // In case backend check fails, safely clear auth
      setCurrentAdmin(null);
      if (onNavigateSubRoute && subRoute !== 'login' && subRoute !== 'setup') {
        onNavigateSubRoute('login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatusAndAuth();
  }, [subRoute]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter email and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const data = await adminLogin(loginEmail.trim(), loginPassword);
      setCurrentAdmin(data.admin);
      setActiveTab('vacancies');
      if (onNavigateSubRoute) {
        onNavigateSubRoute('dashboard');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setCurrentAdmin(null);
    checkStatusAndAuth();
  };

  const handleSetupSuccess = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setAdminExists(true);
    if (onNavigateSubRoute) {
      onNavigateSubRoute('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#052842] text-white flex flex-col items-center justify-center p-6 antialiased">
        <Loader2 size={36} className="animate-spin mb-3 text-blue-400" />
        <p className="text-sm font-medium text-slate-300">Checking system setup and authentication...</p>
      </div>
    );
  }

  // 1. If NO admin exists in database, show First-Time Super Admin Signup
  if (adminExists === false) {
    return <SuperAdminSetup onSetupSuccess={handleSetupSuccess} onBackToPublic={onBackToPublic} />;
  }

  // 2. If admin exists but user is not logged in, show Admin Login
  if (!currentAdmin) {
    const adminPanelRoute = getAdminPanelRoute();
    return (
      <div className="min-h-screen bg-[#011c30] text-slate-100 flex flex-col items-center justify-center p-4 antialiased">
        <div className="bg-white text-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-left space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#052842] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Lock size={22} />
            </div>
            <h2 className="text-2xl font-bold font-display text-[#011c30]">Admin Portal Login</h2>
            <p className="text-xs text-slate-500">
              Enter your credentials 
            </p>
          </div>


          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert size={16} className="shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@bucksnbricks.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs font-semibold text-[#052842] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#052842] hover:bg-[#011c30] text-white text-sm font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <Loader2 size={18} className="animate-spin" /> : null}
              <span>Log In to Dashboard</span>
            </button>
          </form>

          {onBackToPublic && (
            <div className="text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onBackToPublic}
                className="text-xs font-semibold text-slate-500 hover:text-[#052842] hover:underline cursor-pointer"
              >
                ← Back to Public Website
              </button>
            </div>
          )}
        </div>

        {showForgotPasswordModal && (
          <ForgotPasswordModal
            onClose={() => setShowForgotPasswordModal(false)}
            onSuccessReturnToLogin={() => setShowForgotPasswordModal(false)}
          />
        )}
      </div>
    );
  }

  // 3. Admin is logged in -> Show Dashboard
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#052842] text-white flex flex-col shrink-0 border-r border-[#011c30]">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block">Portal</span>
            <h2 className="text-lg font-bold font-display tracking-tight text-white">Admin Dashboard</h2>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'vacancies' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Briefcase size={18} />
            <span>Vacancies</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'applications' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users size={18} />
            <span>Applications</span>
          </button>

          <button
            onClick={() => setActiveTab('resume-checker')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'resume-checker' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileSearch size={18} />
            <span>Resume Checker</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'contacts' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <MessageSquare size={18} />
            <span>Contact Messages</span>
          </button>

          {currentAdmin.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-white/15 text-white shadow-xs' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <SettingsIcon size={18} />
              <span>Settings</span>
            </button>
          )}
        </nav>

        {/* Footer Admin User Badge & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#011c30]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-white">
              <User size={18} />
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-white truncate">{currentAdmin.name}</p>
              <p className="text-[10px] text-blue-300 font-semibold truncate">{currentAdmin.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {onBackToPublic && (
              <button
                onClick={onBackToPublic}
                className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-center"
              >
                Website
              </button>
            )}
            <button
              onClick={handleLogout}
              className="py-1.5 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'vacancies' && <VacancyManagement />}

        {activeTab === 'dashboard' && <DashboardOverview onNavigateTab={(tab) => setActiveTab(tab)} />}

        {activeTab === 'applications' && <ApplicationsManagement />}

        {activeTab === 'resume-checker' && <ResumeCheckerManagement />}

        {activeTab === 'contacts' && <ContactMessagesManagement />}

        {activeTab === 'settings' && (
          <SettingsManagement
            currentAdmin={currentAdmin}
            onProfileUpdated={(updated) => setCurrentAdmin(updated)}
            onAdminDeleted={checkStatusAndAuth}
          />
        )}
      </main>
    </div>
  );
}

