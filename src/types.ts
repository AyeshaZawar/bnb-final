
export interface JobVacancy {
  id: string;
  _id?: string;
  companyName: string;
  jobTitle: string;
  category?: string;
  city: string;
  country?: string;
  workplaceType: 'On-Site' | 'Remote' | 'Hybrid';
  employmentType: 'Full Time' | 'Part Time' | 'Internship' | 'Contract';
  description: string;
  responsibilities: string[];
  requirements: string[];
  perksAndBenefits: string[];
  experienceRequired: string;
  education?: string;
  salary?: string;
  applicationDeadline?: string | null;
  status: 'Draft' | 'Published' | 'Closed';
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

export interface JobPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SECONDARY_ADMIN';
  isActive: boolean;
}

export interface ApplicationItem {
  id: string;
  candidateName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  appliedPosition: string;
  jobTitle: string;
  companyName: string;
  company: string;
  applicationDate: string;
  createdAt: string;
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';
  atsScore: string;
  resume: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  };
  jobId: string;
}

export interface ApplicationDetail {
  id: string;
  personalInformation: {
    firstName: string;
    lastName: string;
    candidateName: string;
    email: string;
    phoneNumber: string;
    country: string;
    currentCity?: string;
    employmentStatus?: string;
    currentJobTitle?: string;
    yearsOfExperience: string;
    currentSalary?: string;
    expectedSalary?: string;
    academicQualification?: string;
    university?: string;
    primaryLanguage: string;
    additionalLanguage?: string;
  };
  resumeInformation: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  };
  atsScore: string;
  appliedJob: {
    jobId: string | null;
    jobTitle: string;
    companyName: string;
    jobDetails?: JobVacancy | null;
  };
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';
  createdAt: string;
  updatedAt?: string;
}

export interface ResumeCheckerRecord {
  id: string;
  resumeFile: string;
  resumeFileName: string;
  resumeFileSize: number;
  atsScore: string;
  uploadDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SystemSettings {
  platformInfo: {
    name: string;
    version: string;
    nodeEnv: string;
    signupPolicy: string;
  };
  security: {
    totalAdmins: number;
    superAdminCount: number;
    secondaryAdminCount: number;
    activeAdmins: number;
    rbacStatus: string;
    emailProvider: string;
  };
  currentSuperAdmin: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export interface TimelineMilestone {
  id: string;
  year: string;
  number: string;
  title: string;
  description: string;
  position: 'top' | 'bottom';
  popupContent?: {
    title: string;
    description: string;
    icon?: string;
    metric?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bgColor: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  category: string;
  date: string;
  title: string;
  image: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconType: 'search' | 'cloud' | 'learning';
  color: string;
}

export interface FeaturePoint {
  id: string;
  title: string;
  description: string;
}

export interface ContactMessage {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  createdAt: string;
}
