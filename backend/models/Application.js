import mongoose from 'mongoose';

const APPLICATION_STATUSES = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'];

const applicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [60, 'First name cannot exceed 60 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [60, 'Last name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    currentCity: {
      type: String,
      trim: true,
      default: '',
    },
    employmentStatus: {
      type: String,
      trim: true,
      default: '',
    },
    currentJobTitle: {
      type: String,
      trim: true,
      default: '',
    },
    currentSalary: {
      type: String,
      trim: true,
      default: '',
    },
    expectedSalary: {
      type: String,
      trim: true,
      default: '',
    },
    academicQualification: {
      type: String,
      trim: true,
      default: '',
    },
    university: {
      type: String,
      trim: true,
      default: '',
    },
    yearsOfExperience: {
      type: String,
      required: [true, 'Years of experience is required'],
      trim: true,
    },
    primaryLanguage: {
      type: String,
      required: [true, 'Primary language is required'],
      trim: true,
    },
    additionalLanguage: {
      type: String,
      trim: true,
      default: '',
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    resumeFile: {
      type: String,
      required: [true, 'Resume file path/URL is required'],
    },
    resumeFileName: {
      type: String,
      required: [true, 'Resume file original name is required'],
    },
    resumeFileSize: {
      type: Number,
      required: [true, 'Resume file size is required'],
    },
    resumeMimeType: {
      type: String,
      required: [true, 'Resume MIME type is required'],
    },
    atsScore: {
      type: String,
      default: 'N/A',
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUSES,
        message: '{VALUE} is not a valid application status',
      },
      default: 'Pending',
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

// Indexes
applicationSchema.index({ jobId: 1, createdAt: -1 });
applicationSchema.index({ email: 1, jobId: 1 });
applicationSchema.index({ status: 1 });

export const APPLICATION_STATUSES_ENUM = APPLICATION_STATUSES;
export const Application = mongoose.model('Application', applicationSchema);
export default Application;
