import mongoose from 'mongoose';

if (mongoose.models.Application) {
  delete mongoose.models.Application;
}

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true, minlength: 50 },
  expectedSalary: { type: Number },
  availability: { type: Date },

  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
  }],

  companyNotes: { type: String, default: '' },
  reviewedAt: { type: Date },
}, { timestamps: true });

ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model('Application', ApplicationSchema);
