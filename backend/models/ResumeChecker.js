import mongoose from 'mongoose';

const resumeCheckerSchema = new mongoose.Schema(
  {
    resumeFile: {
      type: String,
      required: [true, 'Resume file path is required'],
    },
    resumeFileName: {
      type: String,
      required: [true, 'Resume file name is required'],
      trim: true,
    },
    resumeFileSize: {
      type: Number,
      required: [true, 'Resume file size is required'],
    },
    atsScore: {
      type: String,
      required: [true, 'ATS Score is required'],
      trim: true,
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

resumeCheckerSchema.index({ createdAt: -1 });

export const ResumeChecker = mongoose.model('ResumeChecker', resumeCheckerSchema);
export default ResumeChecker;
