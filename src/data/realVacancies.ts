export interface RealVacancy {
  _id: string;
  id: string;
  companyName: string;
  jobTitle: string;
  category: string;
  city: string;
  country: string;
  workplaceType: string;
  employmentType: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perksAndBenefits: string[];
  experienceRequired: string;
  education: string;
  salary: string;
  applicationDeadline: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Exact real vacancy records extracted directly from the database
export const realVacancies: RealVacancy[] = [
  {
    _id: '6a6f9a94d72d528844a2caa7',
    id: '6a6f9a94d72d528844a2caa7',
    companyName: 'Bucks n Bricks',
    jobTitle: 'Senior Talent Acquisition Manager',
    category: 'Executive Search',
    city: 'Karachi',
    country: 'Pakistan',
    workplaceType: 'Hybrid',
    employmentType: 'Full Time',
    description: 'We are seeking an experienced Senior Talent Acquisition Manager to lead executive search projects.',
    responsibilities: [
      'Lead full-cycle recruitment for C-suite and executive roles.',
      'Partner with client HR leaders across Pakistan and GCC.',
      'Evaluate talent and conduct competency-based interviews.',
    ],
    requirements: [
      '5+ years in executive search or agency recruitment.',
      'Strong candidate network in FMCG, Banking, or Tech.',
      'Bachelor degree or equivalent in HR / Business Administration.',
    ],
    perksAndBenefits: [
      'Competitive Base + Incentive Bonus',
      'Health Insurance',
      'Flexible Working',
    ],
    experienceRequired: '5-8 Years',
    education: 'BBA / MBA in Human Resources',
    salary: 'PKR 50,000 - 75,000 / month',
    applicationDeadline: '2026-09-01T19:29:24.480Z',
    status: 'Published',
    createdBy: '6a6f90725af54d474d123d58',
    createdAt: '2026-08-02T19:29:24.489Z',
    updatedAt: '2026-08-02T19:29:24.489Z',
  },
  {
    _id: '6a7a303115d2452ce22fdbaf',
    id: '6a7a303115d2452ce22fdbaf',
    companyName: 'Bucks n Bricks Advisory',
    jobTitle: 'Executive Search Manager',
    category: 'Executive Search',
    city: 'Karachi',
    country: 'Pakistan',
    workplaceType: 'On-Site',
    employmentType: 'Full Time',
    description: 'Lead high-stakes executive search assignments for senior management and C-suite roles across FMCG, Banking, and Manufacturing sectors.',
    responsibilities: [
      'Conduct confidential leadership mapping and executive talent sourcing.',
      'Facilitate strategic client briefings and candidate competency assessments.',
      'Manage C-level offer negotiations and executive onboarding.',
    ],
    requirements: [
      'Proven experience in executive search or senior headhunting.',
      'Deep understanding of corporate leadership benchmarks.',
      'Exceptional communication and stakeholder management skills.',
    ],
    perksAndBenefits: [
      'Performance Bonuses',
      'Executive Health Care',
      'Travel Allowance',
    ],
    experienceRequired: '6-10 Years',
    education: 'Master in HR / Business Management',
    salary: 'PKR 60,000 - 80,000 / month',
    applicationDeadline: '2026-10-15T00:00:00.000Z',
    status: 'Published',
    createdBy: '6a6f90725af54d474d123d58',
    createdAt: '2026-08-10T20:10:25.783Z',
    updatedAt: '2026-08-10T20:10:25.783Z',
  },
  {
    _id: '6a7a303115d2452ce22fdbb0',
    id: '6a7a303115d2452ce22fdbb0',
    companyName: 'Bucks n Bricks Tech',
    jobTitle: 'Lead Software Engineer',
    category: 'Technology Solutions',
    city: 'Lahore',
    country: 'Pakistan',
    workplaceType: 'Hybrid',
    employmentType: 'Full Time',
    description: 'Architect and scale cloud-native web applications and recruitment intelligence tools for global enterprise clients.',
    responsibilities: [
      'Design scalable backend APIs and responsive modern frontend interfaces.',
      'Lead architectural code reviews and enforce high technical standards.',
      'Mentor junior software engineers and oversee CI/CD pipeline deployments.',
    ],
    requirements: [
      '4+ years expert experience with Node.js, React, TypeScript, and MongoDB.',
      'Strong knowledge of cloud deployment and microservices architecture.',
      'Solid problem-solving skills and clean code practices.',
    ],
    perksAndBenefits: [
      'Remote Work Options',
      'Learning Allowance',
      'Medical Cover',
    ],
    experienceRequired: '4-7 Years',
    education: 'BS / MS in Computer Science or Software Engineering',
    salary: 'PKR 70,000 - 90,000 / month',
    applicationDeadline: '2026-10-30T00:00:00.000Z',
    status: 'Published',
    createdBy: '6a6f90725af54d474d123d58',
    createdAt: '2026-08-10T20:10:25.937Z',
    updatedAt: '2026-08-10T20:10:25.937Z',
  },
];
