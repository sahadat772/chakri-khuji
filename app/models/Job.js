import mongoose from 'mongoose';

if (mongoose.models.Job) {
  delete mongoose.models.Job;
}

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  responsibilities: { type: String, default: '' },
  benefits: { type: String, default: '' },

  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  location: { type: String, required: true },
  locationType: { type: String, enum: ['onsite', 'remote', 'hybrid'], default: 'onsite' },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true },
  category: { type: String, enum: ['tech', 'design', 'marketing', 'sales', 'finance', 'hr', 'other'], required: true },

  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'BDT' },
    isNegotiable: { type: Boolean, default: false },
  },

  skills: [{ type: String }],
  experience: { type: String, default: '0-2 years' },
  education: { type: String, default: 'Bachelor' },
  vacancies: { type: Number, default: 1 },

  deadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },

  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);
