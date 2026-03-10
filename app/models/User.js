import mongoose from 'mongoose';

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['candidate', 'company'], required: true },
  username: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },

  // Candidate fields
  skills: [{ type: String }],
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  resume: { type: String, default: '' },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  // Company fields
  companyName: { type: String, default: '' },
  companyLogo: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  companySize: { type: String, default: '' },
  foundedYear: { type: Number },

  // Admin
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
