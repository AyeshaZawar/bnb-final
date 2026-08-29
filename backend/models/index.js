import { Admin } from './Admin.js';
import { Job } from './Job.js';
import { Application } from './Application.js';
import { ResumeChecker } from './ResumeChecker.js';

export const MODELS = {
  ADMIN: 'Admin',
  JOB: 'Job',
  CANDIDATE: 'Candidate',
  APPLICATION: 'Application',
  RESUME_CHECKER: 'ResumeChecker',
};

export { Admin, Job, Application, ResumeChecker };
export default { Admin, Job, Application, ResumeChecker, MODELS };
