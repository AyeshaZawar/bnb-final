import { JobVacancy, JobPagination, AdminUser, ApplicationItem, ApplicationDetail, ResumeCheckerRecord, SystemSettings, ContactMessage } from '../types';

const API_BASE_URL = '/api/v1';

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// ==================== AUTH APIs ====================

export interface SetupStatusResponse {
  adminExists: boolean;
  adminCount: number;
  adminPanelRoute: string;
}

export function getAdminPanelRoute(): string {
  const envRoute = (import.meta.env.VITE_ADMIN_PANEL_ROUTE || '').trim().replace(/^\/+|\/+$/g, '');
  return envRoute || 'management-portal';
}

export async function getSetupStatus(): Promise<SetupStatusResponse> {
  const res = await request<{ data: SetupStatusResponse }>('/auth/setup-status', { method: 'GET' });
  return res.data;
}

export async function adminLogin(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await request<{ data: { token: string; admin: AdminUser } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data;
}

export async function setupSuperAdmin(name: string, email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await request<{ data: { token: string; admin: AdminUser } }>('/auth/setup-super-admin', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data;
}

export async function getMe(): Promise<AdminUser> {
  const res = await request<{ data: { admin: AdminUser } }>('/auth/me', { method: 'GET' }, true);
  return res.data.admin;
}

// ==================== VACANCY / JOB APIs ====================

export async function getPublicJobById(id: string): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>(`/jobs/${id}`, { method: 'GET', cache: 'no-store' } as RequestInit, false);
  return res.data.job;
}

export interface GetAdminJobsParams {
  search?: string;
  status?: string;
  workplaceType?: string;
  employmentType?: string;
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export async function getAdminJobs(params: GetAdminJobsParams = {}): Promise<{
  jobs: JobVacancy[];
  pagination: JobPagination;
}> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.workplaceType && params.workplaceType !== 'All') query.append('workplaceType', params.workplaceType);
  if (params.employmentType && params.employmentType !== 'All') query.append('employmentType', params.employmentType);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const res = await request<{
    data: {
      jobs: JobVacancy[];
      pagination: JobPagination;
    };
  }>(`/jobs/admin/all${queryString}`, { method: 'GET' }, true);

  return res.data;
}

export async function getAdminJobById(id: string): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>(`/jobs/admin/${id}`, { method: 'GET' }, true);
  return res.data.job;
}

export async function createJob(jobData: Partial<JobVacancy>): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }, true);
  return res.data.job;
}

export async function updateJob(id: string, jobData: Partial<JobVacancy>): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>(`/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(jobData),
  }, true);
  return res.data.job;
}

export async function deleteJob(id: string): Promise<void> {
  await request(`/jobs/${id}`, { method: 'DELETE' }, true);
}

export async function publishJob(id: string): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>(`/jobs/${id}/publish`, { method: 'PATCH' }, true);
  return res.data.job;
}

export async function unpublishJob(id: string): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>(`/jobs/${id}/unpublish`, { method: 'PATCH' }, true);
  return res.data.job;
}

export async function closeJob(id: string): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>(`/jobs/${id}/close`, { method: 'PATCH' }, true);
  return res.data.job;
}

export async function reopenJob(id: string, status: 'Published' | 'Draft' = 'Published'): Promise<JobVacancy> {
  const res = await request<{ data: { job: JobVacancy } }>(`/jobs/${id}/reopen`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, true);
  return res.data.job;
}

// ==================== APPLICATIONS APIs ====================

export interface GetApplicationsParams {
  search?: string;
  status?: string;
  company?: string;
  appliedPosition?: string;
  startDate?: string;
  endDate?: string;
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export async function getApplications(params: GetApplicationsParams = {}): Promise<{
  applications: ApplicationItem[];
  pagination: JobPagination;
}> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.company && params.company !== 'All') query.append('company', params.company);
  if (params.appliedPosition && params.appliedPosition !== 'All') query.append('appliedPosition', params.appliedPosition);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const res = await request<{
    data: {
      applications: ApplicationItem[];
      pagination: JobPagination;
    };
  }>(`/applications/admin/all${queryString}`, { method: 'GET' }, true);

  return res.data;
}

export async function getApplicationById(id: string): Promise<ApplicationDetail> {
  const res = await request<{ data: { application: ApplicationDetail } }>(`/applications/${id}`, { method: 'GET' }, true);
  return res.data.application;
}

export async function updateApplicationStatus(
  id: string,
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired'
): Promise<void> {
  await request(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, true);
}

export async function deleteApplication(id: string): Promise<void> {
  await request(`/applications/${id}`, { method: 'DELETE' }, true);
}

export async function downloadApplicationResumeFile(id: string, fileName?: string): Promise<void> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/applications/${id}/download`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to download resume file.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'Resume.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// ==================== RESUME CHECKER APIs ====================

export async function scoreMyResume(file: File): Promise<{ atsScore: string; record: { id: string; resumeFileName: string; atsScore: string; createdAt: string } }> {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await fetch(`${API_BASE_URL}/score-my-resume`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to analyze and score resume.');
  }
  return data.data;
}

export interface GetResumeCheckerParams {
  search?: string;
  atsScore?: string;
  minScore?: number;
  maxScore?: number;
  startDate?: string;
  endDate?: string;
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export async function getResumeCheckerRecords(params: GetResumeCheckerParams = {}): Promise<{
  records: ResumeCheckerRecord[];
  pagination: JobPagination;
}> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.atsScore) query.append('atsScore', params.atsScore);
  if (params.minScore) query.append('minScore', params.minScore.toString());
  if (params.maxScore) query.append('maxScore', params.maxScore.toString());
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const res = await request<{
    data: {
      records: ResumeCheckerRecord[];
      pagination: JobPagination;
    };
  }>(`/resume-checker/admin/all${queryString}`, { method: 'GET' }, true);

  return res.data;
}

export async function getResumeCheckerById(id: string): Promise<ResumeCheckerRecord> {
  const res = await request<{ data: { record: ResumeCheckerRecord } }>(`/resume-checker/${id}`, { method: 'GET' }, true);
  return res.data.record;
}

export async function deleteResumeCheckerRecord(id: string): Promise<void> {
  await request(`/resume-checker/${id}`, { method: 'DELETE' }, true);
}

export async function downloadResumeCheckerFileBlob(id: string, fileName?: string): Promise<void> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/resume-checker/${id}/download`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to download resume checker file.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'Resume_Checker.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// ==================== FORGOT & RESET PASSWORD APIs ====================

export async function forgotPassword(email: string): Promise<string> {
  const res = await request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return res.message || 'Password reset link sent to your email.';
}

export async function resetPassword(token: string, newPassword: string): Promise<string> {
  const res = await request<{ message: string }>(`/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ newPassword, password: newPassword }),
  });
  return res.message || 'Password reset successfully.';
}

// ==================== SETTINGS & PROFILE APIs ====================

export async function getSettingsOverview(): Promise<SystemSettings> {
  const res = await request<{ data: SystemSettings }>('/settings', { method: 'GET' }, true);
  return res.data;
}

export async function getSettingsProfile(): Promise<AdminUser> {
  const res = await request<{ data: { admin: AdminUser } }>('/settings/profile', { method: 'GET' }, true);
  return res.data.admin;
}

export async function updateSettingsProfile(name: string): Promise<AdminUser> {
  const res = await request<{ data: { admin: AdminUser } }>('/settings/profile', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  }, true);
  return res.data.admin;
}

export async function changeSettingsEmail(currentPassword: string, newEmail: string): Promise<AdminUser> {
  const res = await request<{ data: { admin: AdminUser } }>('/settings/change-email', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newEmail, email: newEmail }),
  }, true);
  return res.data.admin;
}

export async function changeSettingsPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword?: string
): Promise<void> {
  await request('/settings/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  }, true);
}

// ==================== SECONDARY ADMIN MANAGEMENT APIs ====================

export async function getAllSecondaryAdmins(): Promise<AdminUser[]> {
  const res = await request<{ data: { admins: AdminUser[] } }>('/settings/admins', { method: 'GET' }, true);
  return res.data.admins || [];
}

export async function createSecondaryAdmin(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AdminUser> {
  const res = await request<{ data: { admin: AdminUser } }>('/settings/admins', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true);
  return res.data.admin;
}

export async function updateSecondaryAdmin(
  id: string,
  data: { name?: string; email?: string; status?: string; role?: string }
): Promise<AdminUser> {
  const res = await request<{ data: { admin: AdminUser } }>(`/settings/admins/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, true);
  return res.data.admin;
}

export async function toggleSecondaryAdminStatus(id: string, isActive: boolean): Promise<AdminUser> {
  const res = await request<{ data: { admin: AdminUser } }>(`/settings/admins/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive, status: isActive ? 'Active' : 'Inactive' }),
  }, true);
  return res.data.admin;
}

export async function deleteSecondaryAdmin(id: string): Promise<void> {
  await request(`/settings/admins/${id}`, { method: 'DELETE' }, true);
}

export async function getDashboardStats(): Promise<any> {
  const res = await request<{ data: any }>('/dashboard', { method: 'GET' }, true);
  return res.data;
}

// ==================== CONTACT APIs ====================

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phoneNumber: string;
  subject?: string;
  message: string;
}): Promise<ContactMessage> {
  const res = await request<{ data: ContactMessage }>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }, false);
  return res.data;
}

export async function getContactMessages(params: {
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ pagination: any; messages: ContactMessage[] }> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const res = await request<{ data: { pagination: any; messages: ContactMessage[] } }>(
    `/contact?${query.toString()}`,
    { method: 'GET' },
    true
  );
  return res.data;
}

export async function deleteContactMessage(id: string): Promise<void> {
  await request(`/contact/${id}`, { method: 'DELETE' }, true);
}

// ==================== CHATBOT APIs ====================

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  error?: boolean;
}

export async function sendChatbotMessage(message: string, history: { role: string; content: string }[] = []): Promise<{ reply: string; timestamp: string }> {
  const res = await request<{ data: { reply: string; timestamp: string } }>(
    '/chatbot/message',
    {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    },
    false
  );
  return res.data;
}


