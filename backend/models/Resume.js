const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String
});

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  fieldOfStudy: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a resume title'],
    default: 'My Resume'
  },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    linkedIn: String,
    github: String,
    portfolio: String,
    summary: String
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [String],
  projects: [{
    name: String,
    description: String,
    link: String
  }],
  theme: {
    type: String,
    default: 'modern'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
