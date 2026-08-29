import mongoose from 'mongoose';

const WORKPLACE_TYPES = ['Remote', 'On-Site', 'Hybrid'];
const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Internship', 'Contract'];
const JOB_STATUSES = ['Draft', 'Published', 'Closed'];

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title / position is required'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    city: {
      type: String,
      required: [true, 'City location is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    workplaceType: {
      type: String,
      enum: {
        values: WORKPLACE_TYPES,
        message: '{VALUE} is not a valid workplace type',
      },
      default: 'On-Site',
    },
    employmentType: {
      type: String,
      enum: {
        values: EMPLOYMENT_TYPES,
        message: '{VALUE} is not a valid employment type',
      },
      default: 'Full Time',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    perksAndBenefits: {
      type: [String],
      default: [],
    },
    experienceRequired: {
      type: String,
      required: [true, 'Experience requirement is required'],
      trim: true,
    },
    education: {
      type: String,
      trim: true,
      default: '',
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: JOB_STATUSES,
        message: '{VALUE} is not a valid job status',
      },
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Admin reference is required for job creation'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for high performance search, filter, and sorting
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ companyName: 'text', jobTitle: 'text', city: 'text' });
jobSchema.index({ workplaceType: 1, employmentType: 1 });

export const WORKPLACE_TYPES_ENUM = WORKPLACE_TYPES;
export const EMPLOYMENT_TYPES_ENUM = EMPLOYMENT_TYPES;
export const JOB_STATUSES_ENUM = JOB_STATUSES;

export const Job = mongoose.model('Job', jobSchema);
export default Job;
