import mongoose from 'mongoose';

/**
 * Utility to manage offline in-memory fallback data when MongoDB Atlas connection is disconnected
 * or blocked by IP whitelisting rules.
 */

export const isOffline = () => {
  return mongoose.connection.readyState !== 1;
};

export const initOfflineData = () => {
  if (global._offlineInitialized) return;
  global._offlineInitialized = true;

  if (!global.offlineJobs) {
    global.offlineJobs = [
      {
        _id: 'offline-job-101',
        id: 'offline-job-101',
        companyName: 'Bucks & Bricks Co.',
        jobTitle: 'Senior Full Stack Engineer (React/Node)',
        category: 'Engineering & Tech',
        city: 'Karachi',
        country: 'Pakistan',
        workplaceType: 'Hybrid',
        employmentType: 'Full Time',
        description: 'We are seeking an experienced Full Stack Engineer to build and scale our modern web applications and AI-driven recruitment portal. You will work across React, TypeScript, Node.js, and cloud services.',
        responsibilities: [
          'Design and develop high-performance frontend interfaces using React and Tailwind CSS.',
          'Build robust REST APIs and microservices using Node.js and Express.',
          'Collaborate with cross-functional teams to define architecture and deliver scalable features.',
          'Implement automated CI/CD pipelines and ensure rigorous code quality standards.'
        ],
        requirements: [
          '4+ years of professional full stack web development experience.',
          'Strong proficiency in TypeScript, React, Node.js, and modern CSS frameworks.',
          'Experience working with RESTful APIs, authentication workflows, and cloud databases.',
          'Excellent communication skills and ability to work in an agile environment.'
        ],
        perksAndBenefits: [
          'Competitive salary package with annual performance bonuses.',
          'Comprehensive health and medical insurance for self and family.',
          'Flexible hybrid working arrangements and generous paid time off.',
          'Annual professional development and learning stipend.'
        ],
        experienceRequired: '4-6 Years',
        education: 'Bachelor’s Degree in Computer Science or equivalent practical experience',
        salary: 'PKR 350,000 - 450,000 / month',
        applicationDeadline: new Date(Date.now() + 86400000 * 30),
        status: 'Published',
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 86400000 * 5),
        createdBy: { _id: 'offline-1785085105862', name: 'Super Admin', email: 'admin@bucksnbricks.com', role: 'SUPER_ADMIN' }
      },
      {
        _id: 'offline-job-102',
        id: 'offline-job-102',
        companyName: 'Bucks & Bricks Co.',
        jobTitle: 'AI Recruitment & HR Lead',
        category: 'Human Resources',
        city: 'Lahore',
        country: 'Pakistan',
        workplaceType: 'On-Site',
        employmentType: 'Full Time',
        description: 'Join our team as the AI Recruitment & HR Lead to revolutionize talent sourcing and executive search. You will leverage cutting-edge AI ATS tools and lead end-to-end recruitment pipelines.',
        responsibilities: [
          'Manage end-to-end recruitment lifecycles for executive and technical roles.',
          'Utilize AI-assisted resume screening and candidate evaluation platforms.',
          'Partner with hiring managers to build talent benchmarks and job descriptions.',
          'Enhance employer branding and candidate engagement strategies.'
        ],
        requirements: [
          '5+ years of talent acquisition or HR management experience.',
          'Demonstrated success hiring technical and executive talent in competitive markets.',
          'Familiarity with ATS software, resume parsing tools, and structured interviewing.',
          'Strong negotiation, interpersonal, and stakeholder management skills.'
        ],
        perksAndBenefits: [
          'Market-leading compensation with generous placement commissions.',
          'Health, dental, and life insurance coverage.',
          'Modern office environment with catered lunches and wellness programs.',
          'Opportunity for rapid career growth into Head of People Operations.'
        ],
        experienceRequired: '5+ Years',
        education: 'Bachelor’s or Master’s in Human Resources, Business, or Psychology',
        salary: 'PKR 280,000 - 380,000 / month',
        applicationDeadline: new Date(Date.now() + 86400000 * 20),
        status: 'Published',
        createdAt: new Date(Date.now() - 86400000 * 3),
        updatedAt: new Date(Date.now() - 86400000 * 3),
        createdBy: { _id: 'offline-1785085105862', name: 'Super Admin', email: 'admin@bucksnbricks.com', role: 'SUPER_ADMIN' }
      },
      {
        _id: 'offline-job-103',
        id: 'offline-job-103',
        companyName: 'Bucks & Bricks Co.',
        jobTitle: 'Senior Product Designer (UI/UX)',
        category: 'Design & Product',
        city: 'Islamabad',
        country: 'Pakistan',
        workplaceType: 'Remote',
        employmentType: 'Full Time',
        description: 'We are looking for an innovative Senior Product Designer to craft intuitive, beautiful user experiences across our digital products and client dashboards.',
        responsibilities: [
          'Create user flows, wireframes, prototypes, and high-fidelity visual designs.',
          'Conduct user research, usability testing, and translate insights into design solutions.',
          'Maintain and expand our design system using Figma and component libraries.',
          'Collaborate closely with engineers to ensure pixel-perfect implementation.'
        ],
        requirements: [
          '3+ years of digital product design experience with a strong portfolio.',
          'Mastery of Figma, interactive prototyping, and responsive web design principles.',
          'Solid understanding of accessibility guidelines and user-centered design methodologies.',
          'Ability to articulate design decisions clearly to technical and business stakeholders.'
        ],
        perksAndBenefits: [
          '100% remote working flexibility with home office setup allowance.',
          'Competitive compensation package in USD/PKR equivalent.',
          'Flexible working hours and result-oriented culture.',
          'Annual international conference and workshop allowances.'
        ],
        experienceRequired: '3-5 Years',
        education: 'Degree in Design, HCI, or relevant practical portfolio experience',
        salary: 'PKR 300,000 - 400,000 / month',
        applicationDeadline: new Date(Date.now() + 86400000 * 45),
        status: 'Published',
        createdAt: new Date(Date.now() - 86400000 * 1),
        updatedAt: new Date(Date.now() - 86400000 * 1),
        createdBy: { _id: 'offline-1785085105862', name: 'Super Admin', email: 'admin@bucksnbricks.com', role: 'SUPER_ADMIN' }
      }
    ];
  }

  if (!global.offlineApplications || global.offlineApplications.length === 0) {
    global.offlineApplications = [
      {
        _id: 'offline-app-201',
        id: 'offline-app-201',
        job: global.offlineJobs[0],
        applicantName: 'Ahmed Raza Khan',
        email: 'ahmed.raza.dev@gmail.com',
        phone: '+92 300 1234567',
        coverLetter: 'I am a passionate full stack developer with 5 years of experience in React and Node.js. I have built scalable SaaS apps and would love to contribute to Bucks & Bricks Co.',
        resumeUrl: '/uploads/sample_resume_ahmed.pdf',
        resumeFileName: 'Ahmed_Raza_Resume.pdf',
        status: 'Shortlisted',
        atsScore: 88,
        appliedAt: new Date(Date.now() - 86400000 * 2),
        notes: [
          {
            text: 'Excellent technical background in TypeScript and React. Schedule technical interview next week.',
            addedBy: 'Super Admin',
            addedAt: new Date(Date.now() - 86400000 * 1)
          }
        ]
      },
      {
        _id: 'offline-app-202',
        id: 'offline-app-202',
        job: global.offlineJobs[1],
        applicantName: 'Sara Ahmed Malik',
        email: 'sara.malik.hr@yahoo.com',
        phone: '+92 321 7654321',
        coverLetter: 'With 6 years of talent acquisition experience across tech and finance, I am excited to apply for the AI Recruitment Lead position.',
        resumeUrl: '/uploads/sample_resume_sara.pdf',
        resumeFileName: 'Sara_Malik_HR_Resume.pdf',
        status: 'Interviewing',
        atsScore: 94,
        appliedAt: new Date(Date.now() - 86400000 * 1),
        notes: [
          {
            text: 'Top candidate! Exceptional communication during initial screening call.',
            addedBy: 'Super Admin',
            addedAt: new Date()
          }
        ]
      }
    ];
  }

  if (!global.offlineResumeChecks || global.offlineResumeChecks.length === 0) {
    global.offlineResumeChecks = [
      {
        _id: 'offline-check-301',
        id: 'offline-check-301',
        resumeFile: '/uploads/sample_resume_ahmed.pdf',
        resumeFileName: 'Ahmed_Raza_Resume.pdf',
        resumeFileSize: 245760,
        atsScore: 88,
        createdAt: new Date(Date.now() - 86400000 * 2)
      },
      {
        _id: 'offline-check-302',
        id: 'offline-check-302',
        resumeFile: '/uploads/sample_resume_sara.pdf',
        resumeFileName: 'Sara_Malik_HR_Resume.pdf',
        resumeFileSize: 189440,
        atsScore: 94,
        createdAt: new Date(Date.now() - 86400000 * 1)
      }
    ];
  }

  if (!global.offlineContacts) {
    global.offlineContacts = [
      {
        _id: 'offline-contact-1',
        id: 'offline-contact-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+92 300 1122334',
        subject: 'Inquiry about HR Solutions',
        message: 'Hello, we are interested in your AI recruitment portal and would like to schedule a demo.',
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        _id: 'offline-contact-2',
        id: 'offline-contact-2',
        name: 'Sarah Jenkins',
        email: 's.jenkins@techcorp.io',
        phoneNumber: '+92 321 9988776',
        subject: 'Partnership Opportunity',
        message: 'We would love to discuss integrating our enterprise analytics tools with Bucks & Bricks.',
        createdAt: new Date(Date.now() - 3600000 * 1)
      }
    ];
  }
};

export const getOfflineJobsResult = (queryParams, isPublic = false) => {
  initOfflineData();
  const { search, workplaceType, employmentType, status, page = 1, limit = 10, sort } = queryParams;
  let filtered = [...global.offlineJobs];

  if (isPublic) {
    filtered = filtered.filter(j => j.status === 'Published');
  } else if (status && status.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(j => j.status.toLowerCase() === status.toLowerCase());
  }

  if (workplaceType && workplaceType.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(j => j.workplaceType.toLowerCase() === workplaceType.toLowerCase());
  }

  if (employmentType && employmentType.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(j => j.employmentType.toLowerCase() === employmentType.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(j =>
      (j.jobTitle && j.jobTitle.toLowerCase().includes(q)) ||
      (j.companyName && j.companyName.toLowerCase().includes(q)) ||
      (j.city && j.city.toLowerCase().includes(q)) ||
      (j.category && j.category.toLowerCase().includes(q)) ||
      (j.description && j.description.toLowerCase().includes(q))
    );
  }

  if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limitNum);

  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
    },
    jobs: paginated,
  };
};

export const getOfflineApplicationsResult = (queryParams) => {
  initOfflineData();
  const { jobId, status, search, page = 1, limit = 10, sort } = queryParams;
  let filtered = [...global.offlineApplications];

  if (jobId) {
    filtered = filtered.filter(a => String(a.job?._id || a.job?.id || a.job) === String(jobId));
  }

  if (status && status.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(a =>
      (a.applicantName && a.applicantName.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.job?.jobTitle && a.job.jobTitle.toLowerCase().includes(q))
    );
  }

  if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limitNum);

  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
    },
    applications: paginated,
  };
};

export const getOfflineDashboardStatsResult = () => {
  initOfflineData();
  const jobs = global.offlineJobs || [];
  const apps = global.offlineApplications || [];

  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter(j => j.status === 'Published').length;
  const draftJobs = jobs.filter(j => j.status === 'Draft').length;
  const closedJobs = jobs.filter(j => j.status === 'Closed').length;

  const totalApplications = apps.length;
  const newApplications = apps.filter(a => a.status === 'New').length;
  const underReviewApplications = apps.filter(a => a.status === 'Under Review').length;
  const shortlistedApplications = apps.filter(a => a.status === 'Shortlisted').length;
  const interviewingApplications = apps.filter(a => a.status === 'Interviewing').length;
  const rejectedApplications = apps.filter(a => a.status === 'Rejected').length;
  const hiredApplications = apps.filter(a => a.status === 'Hired').length;

  const recentApplications = apps.slice(0, 5);

  return {
    overview: {
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      newApplications,
      underReviewApplications,
      shortlistedApplications,
      interviewingApplications,
      rejectedApplications,
      hiredApplications,
    },
    recentApplications,
  };
};

export const getOfflineJobById = (id) => {
  initOfflineData();
  let job = global.offlineJobs.find(j => String(j._id || j.id) === String(id));
  if (!job && id) {
    const idStr = String(id).replace(/^(job-|offline-job-)/, '');
    const idx = parseInt(idStr, 10);
    if (!isNaN(idx) && idx >= 1) {
      const mapped = global.offlineJobs[(idx - 1) % global.offlineJobs.length] || global.offlineJobs[0];
      if (mapped) {
        job = { ...mapped, _id: String(id), id: String(id) };
      }
    } else if (global.offlineJobs.length > 0) {
      job = { ...global.offlineJobs[0], _id: String(id), id: String(id) };
    }
  }
  return job || null;
};

export const createOfflineJob = (body, admin) => {
  initOfflineData();
  const newJob = {
    _id: 'offline-job-' + Date.now(),
    id: 'offline-job-' + Date.now(),
    companyName: body.companyName,
    jobTitle: body.jobTitle,
    category: body.category || 'General',
    city: body.city,
    country: body.country || '',
    workplaceType: body.workplaceType || 'On-Site',
    employmentType: body.employmentType || 'Full Time',
    description: body.description,
    responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
    requirements: Array.isArray(body.requirements) ? body.requirements : [],
    perksAndBenefits: Array.isArray(body.perksAndBenefits) ? body.perksAndBenefits : [],
    experienceRequired: body.experienceRequired,
    education: body.education || '',
    salary: body.salary || '',
    applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
    status: body.status || 'Draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: admin || { _id: 'offline-1785085105862', name: 'Super Admin', email: 'admin@bucksnbricks.com', role: 'SUPER_ADMIN' }
  };
  global.offlineJobs.unshift(newJob);
  return newJob;
};

export const updateOfflineJob = (id, body) => {
  initOfflineData();
  const job = getOfflineJobById(id);
  if (!job) return null;
  const allowedUpdates = [
    'companyName', 'jobTitle', 'category', 'city', 'country',
    'workplaceType', 'employmentType', 'description', 'responsibilities',
    'requirements', 'perksAndBenefits', 'experienceRequired', 'education',
    'salary', 'applicationDeadline', 'status'
  ];
  allowedUpdates.forEach(field => {
    if (body[field] !== undefined) {
      if (field === 'applicationDeadline') {
        job[field] = body[field] ? new Date(body[field]) : null;
      } else {
        job[field] = body[field];
      }
    }
  });
  job.updatedAt = new Date();
  return job;
};

export const deleteOfflineJob = (id) => {
  initOfflineData();
  const idx = global.offlineJobs.findIndex(j => String(j._id || j.id) === String(id));
  if (idx !== -1) {
    global.offlineJobs.splice(idx, 1);
    return true;
  }
  return false;
};

export const changeOfflineJobStatus = (id, status) => {
  initOfflineData();
  const job = getOfflineJobById(id);
  if (!job) return null;
  job.status = status;
  job.updatedAt = new Date();
  return job;
};

export const getOfflineApplicationById = (id) => {
  initOfflineData();
  return global.offlineApplications.find(a => String(a._id || a.id) === String(id)) || null;
};

export const createOfflineApplication = (job, body, resumeFile) => {
  initOfflineData();
  const firstName = body.firstName || (body.applicantName ? body.applicantName.split(' ')[0] : 'Candidate');
  const lastName = body.lastName || (body.applicantName ? body.applicantName.split(' ').slice(1).join(' ') : '');
  const candidateName = body.applicantName || `${firstName} ${lastName}`.trim() || 'Candidate';
  const atsScoreNum = body.atsScore ? (typeof body.atsScore === 'string' ? parseInt(body.atsScore, 10) : body.atsScore) : 85;

  const newApp = {
    _id: 'offline-app-' + Date.now(),
    id: 'offline-app-' + Date.now(),
    job,
    firstName,
    lastName,
    applicantName: candidateName,
    email: body.email || 'candidate@example.com',
    phone: body.phoneNumber || body.phone || '+92 300 0000000',
    phoneNumber: body.phoneNumber || body.phone || '+92 300 0000000',
    country: body.country || 'Pakistan',
    currentCity: body.currentCity || '',
    employmentStatus: body.employmentStatus || 'Employed',
    currentJobTitle: body.currentJobTitle || '',
    yearsOfExperience: body.yearsOfExperience || '3',
    currentSalary: body.currentSalary || '',
    expectedSalary: body.expectedSalary || '',
    academicQualification: body.academicQualification || '',
    university: body.university || '',
    primaryLanguage: body.primaryLanguage || 'English',
    additionalLanguage: body.additionalLanguage || '',
    coverLetter: body.coverLetter || '',
    resumeUrl: resumeFile ? `/uploads/${resumeFile.filename}` : '/uploads/sample_resume.pdf',
    resumeFile: resumeFile ? `/uploads/${resumeFile.filename}` : '/uploads/sample_resume.pdf',
    resumeFileName: resumeFile ? resumeFile.originalname : 'resume.pdf',
    resumeFileSize: resumeFile ? resumeFile.size : 150000,
    resumeMimeType: resumeFile ? resumeFile.mimetype : 'application/pdf',
    status: 'Pending',
    atsScore: isNaN(atsScoreNum) ? 85 : atsScoreNum,
    appliedAt: new Date(),
    createdAt: new Date(),
    notes: []
  };
  global.offlineApplications.unshift(newApp);
  return newApp;
};

export const updateOfflineApplicationStatus = (id, status) => {
  initOfflineData();
  const app = getOfflineApplicationById(id);
  if (!app) return null;
  app.status = status;
  return app;
};

export const addOfflineApplicationNote = (id, text, adminName) => {
  initOfflineData();
  const app = getOfflineApplicationById(id);
  if (!app) return null;
  const newNote = {
    _id: 'offline-note-' + Date.now(),
    text,
    addedBy: adminName || 'Admin',
    addedAt: new Date()
  };
  app.notes.push(newNote);
  return app;
};

export const deleteOfflineApplication = (id) => {
  initOfflineData();
  const idx = global.offlineApplications.findIndex(a => String(a._id || a.id) === String(id));
  if (idx !== -1) {
    global.offlineApplications.splice(idx, 1);
    return true;
  }
  return false;
};

export const getOfflineResumeChecksResult = (queryParams) => {
  initOfflineData();
  const { page = 1, limit = 10 } = queryParams;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = global.offlineResumeChecks.length;
  const paginated = global.offlineResumeChecks.slice(skip, skip + limitNum);
  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1
    },
    records: paginated
  };
};

export const getOfflineResumeCheckById = (id) => {
  initOfflineData();
  return global.offlineResumeChecks.find(r => String(r._id || r.id) === String(id)) || null;
};

export const deleteOfflineResumeCheck = (id) => {
  initOfflineData();
  const idx = global.offlineResumeChecks.findIndex(r => String(r._id || r.id) === String(id));
  if (idx !== -1) {
    global.offlineResumeChecks.splice(idx, 1);
    return true;
  }
  return false;
};

export const getOfflineAdminsList = () => {
  global.offlineAdmins = global.offlineAdmins || [
    {
      _id: 'offline-1785085105862',
      id: 'offline-1785085105862',
      name: 'Super Admin',
      email: 'admin@bucksnbricks.com',
      password: 'AdminPassword123!',
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date(),
    }
  ];
  return global.offlineAdmins;
};

export const createOfflineSecondaryAdmin = (body) => {
  const list = getOfflineAdminsList();
  const newAdmin = {
    _id: 'offline-admin-' + Date.now(),
    id: 'offline-admin-' + Date.now(),
    name: body.name,
    email: body.email.toLowerCase().trim(),
    password: body.password || 'AdminPassword123!',
    role: body.role || 'SECONDARY_ADMIN',
    isActive: true,
    createdAt: new Date(),
  };
  list.unshift(newAdmin);
  return newAdmin;
};

export const updateOfflineAdminStatus = (id, isActive) => {
  const list = getOfflineAdminsList();
  const admin = list.find(a => String(a._id || a.id) === String(id));
  if (!admin) return null;
  admin.isActive = isActive;
  return admin;
};

export const deleteOfflineAdmin = (id) => {
  const list = getOfflineAdminsList();
  const idx = list.findIndex(a => String(a._id || a.id) === String(id));
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
};

export const getOfflineContactsResult = (queryParams = {}) => {
  initOfflineData();
  const { search, page = 1, limit = 10 } = queryParams;
  let filtered = [...global.offlineContacts];

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.message && c.message.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limitNum);

  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1
    },
    messages: paginated
  };
};

export const getOfflineContactById = (id) => {
  initOfflineData();
  return global.offlineContacts.find(c => String(c._id || c.id) === String(id)) || null;
};

export const createOfflineContact = (body) => {
  initOfflineData();
  const newContact = {
    _id: 'offline-contact-' + Date.now(),
    id: 'offline-contact-' + Date.now(),
    name: body.name || body.fullName || 'Anonymous',
    email: (body.email || '').toLowerCase().trim(),
    phoneNumber: body.phoneNumber || body.phone || '+92 300 0000000',
    subject: body.subject || 'General Inquiry',
    message: body.message || '',
    createdAt: new Date()
  };
  global.offlineContacts.unshift(newContact);
  return newContact;
};

export const deleteOfflineContact = (id) => {
  initOfflineData();
  const idx = global.offlineContacts.findIndex(c => String(c._id || c.id) === String(id));
  if (idx !== -1) {
    global.offlineContacts.splice(idx, 1);
    return true;
  }
  return false;
};


