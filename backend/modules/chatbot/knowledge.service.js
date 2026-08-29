import { Job } from '../../models/Job.js';
import { isOffline, getOfflineJobsResult } from '../../utils/offlineFallback.js';
import { logger } from '../../utils/logger.js';
import { getDynamicWebsiteKnowledge } from './contentIndexer.service.js';

/**
 * Knowledge Gatekeeper Service for AI Chatbot
 * STRICT SECURITY MANDATE:
 * 1. Never returns complete MongoDB collections or documents.
 * 2. Only queries jobs where status === 'Published'.
 * 3. Never returns Draft, Deleted, or Closed jobs.
 * 4. Never accesses private candidate applications, resumes, ATS scores, contact submissions, or admin accounts.
 * 5. Returns only minimum required public fields.
 */

/**
 * Format raw job object to minimum required public fields
 */
const formatJobForChatbot = (job) => {
  if (!job) return null;
  const location = [job.city, job.country].filter(Boolean).join(', ') || 'Pakistan';
  return {
    id: job._id || job.id,
    position: job.jobTitle || job.title || 'Untitled Position',
    company: job.companyName || job.company || 'Bucks & Bricks Co.',
    location,
    employmentType: job.employmentType || 'Full Time',
    workMode: job.workplaceType || job.workType || 'On-Site',
    shortDescription: job.description ? String(job.description).substring(0, 350) + (String(job.description).length > 350 ? '...' : '') : 'No description provided.',
    requirements: Array.isArray(job.requirements) ? job.requirements.slice(0, 5) : [],
    salary: job.salary || 'Competitive',
    experienceRequired: job.experienceRequired || 'Relevant experience required',
    publishedDate: job.createdAt || job.updatedAt || new Date().toISOString()
  };
};

/**
 * Fetch ONLY published job vacancies from database or offline fallback
 */
export const getPublishedJobsKnowledge = async () => {
  try {
    if (isOffline()) {
      logger.debug('Chatbot gatekeeper: fetching published jobs from offline fallback.');
      const res = getOfflineJobsResult({ status: 'Published' }, true);
      const jobs = res.jobs || [];
      return jobs.filter(j => j.status === 'Published').map(formatJobForChatbot).filter(Boolean);
    }

    // Secure MongoDB Query: strictly filter by status = 'Published'
    const jobs = await Job.find({ status: 'Published' })
      .select('jobTitle companyName city country workplaceType employmentType description requirements salary experienceRequired createdAt updatedAt')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return jobs.map(formatJobForChatbot).filter(Boolean);
  } catch (err) {
    logger.warn(`Chatbot database gatekeeper notice (${err.message}). Using safe offline published jobs fallback.`);
    const res = getOfflineJobsResult({ status: 'Published' }, true);
    const jobs = res.jobs || [];
    return jobs.filter(j => j.status === 'Published').map(formatJobForChatbot).filter(Boolean);
  }
};

/**
 * Static Website Knowledge Base
 * Approved public company information, FAQs, services, and tool descriptions
 */
export const getWebsiteStaticKnowledge = () => {
  return {
    companyOverview: {
      name: "Bucks & Bricks Co.",
      tagline: "Premier Global Recruitment, Executive Search, HR Consulting & Tech Talent Acquisition",
      description: "Bucks & Bricks Co. bridges the gap between high-growth global enterprises and top-tier professionals across software engineering, AI, product design, finance, operations, and executive leadership. We combine human recruitment expertise with cutting-edge AI talent intelligence tools."
    },
    services: [
      {
        name: "Executive Search & Leadership Hiring",
        description: "Targeted headhunting and recruitment for C-suite, VP, Director, and high-impact leadership roles with strict confidentiality and 99% placement alignment."
      },
      {
        name: "Technical & Engineering Recruitment",
        description: "Specialized hiring for Full Stack Engineers, AI/ML Specialists, DevOps, Cloud Architects, and UI/UX Product Designers."
      },
      {
        name: "AI-Powered ATS & Resume Screening",
        description: "Next-generation automated resume evaluation using Google Gemini AI to assess candidate compatibility across 5 core competency pillars."
      },
      {
        name: "HR Consulting & Organizational Development",
        description: "Strategic HR advisory, compensation benchmarking, talent mapping, and workforce structuring for modern scaling enterprises."
      },
      {
        name: "Staff Augmentation & Dedicated Teams",
        description: "Rapid deployment of pre-vetted, high-performing dedicated tech teams and remote specialists aligned with client time zones."
      }
    ],
    websiteTools: {
      aiResumeChecker: {
        name: "Free AI Resume Checker & ATS Scorer",
        url: "/#resume-checker",
        description: "A 100% free public tool available on our website where candidates can upload their resume (PDF/DOCX) or paste resume text along with a target job description.",
        scoringRubric: "Evaluates resumes out of 100% across 5 structured categories: Contact & Identity (15 pts), Structural Clarity & Formatting (15 pts), Work Experience & Impact (30 pts), Education & Qualifications (15 pts), and Technical Skills & Keyword Alignment (25 pts).",
        benefits: "Provides instant feedback, actionable improvement recommendations, and keyword gap analysis to help candidates optimize their resumes before applying."
      }
    },
    applicationProcess: [
      "Step 1: Explore current open positions on our Careers / Vacancies page (/vacancies).",
      "Step 2: Select a role and click 'Apply Now' to fill out the streamlined application form.",
      "Step 3: Submit your contact details, professional background, and attach your resume (PDF/DOCX).",
      "Step 4: Our automated AI ATS engine screens your resume for requirements alignment.",
      "Step 5: Our recruitment team reviews qualified profiles and reaches out within 3 to 5 business days to schedule interviews."
    ],
    contactAndSupport: {
      headquarters: "Karachi, Pakistan (with global remote teams and client partner offices)",
      email: "support@bucksnbricks.com / contact@bucksnbricks.com",
      workingHours: "Monday to Friday, 9:00 AM - 6:00 PM (PKT / UTC+5)",
      contactForm: "Visitors can submit direct inquiries via our Contact Us page on the website."
    },
    frequentlyAskedQuestions: [
      {
        q: "Is the AI Resume Checker tool free?",
        a: "Yes! Our AI Resume Checker is completely free for all job seekers and applicants."
      },
      {
        q: "Do you offer remote work or hybrid job opportunities?",
        a: "Yes! We recruit for On-Site, Hybrid, and 100% Remote positions for global companies. Check the 'Work Mode' badge on each job vacancy."
      },
      {
        q: "How long does it take to hear back after applying for a job?",
        a: "Our recruitment specialists review applications continuously and typically respond to shortlisted candidates within 3 to 5 business days."
      },
      {
        q: "How does Bucks & Bricks protect candidate privacy?",
        a: "We adhere to strict data privacy and security protocols. Candidate resumes and personal details are stored securely, only used for recruitment purposes, and are NEVER shared with unauthorized third parties or used to train public AI models."
      }
    ],
    securityAndPrivacyPolicy: "The chatbot operates under a strict security policy. It has ZERO access to candidate applications, private resume files, ATS scores of other users, contact messages, internal notes, or administrative accounts (Super Admin / Admin). Any inquiries requesting private candidate data, internal database records, or system credentials will be politely refused."
  };
};

/**
 * Get Full Website Knowledge Base (Static baseline + Dynamically indexed frontend content)
 * Ensures that whenever new content or pages are added to the website, the chatbot automatically uses them without code or prompt changes.
 */
export const getFullWebsiteKnowledge = async () => {
  const staticKnowledge = getWebsiteStaticKnowledge();
  try {
    const dynamicSections = await getDynamicWebsiteKnowledge();
    return {
      ...staticKnowledge,
      dynamicSections
    };
  } catch (error) {
    logger.warn(`Could not load dynamic website sections: ${error.message}`);
    return {
      ...staticKnowledge,
      dynamicSections: []
    };
  }
};
