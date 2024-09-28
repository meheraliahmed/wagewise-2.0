const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  name: String,
  age: String, // or Number if you prefer numeric age
  hometown: String,
  currentCity: String,
  email: String,
  phone: String
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institute: String,
  graduationYear: String, // or Number if you prefer numeric graduation year
  gpa: String // Optional field
});

const jobSchema = new mongoose.Schema({
  companyName: String,
  designation: String,
  city: String,
  yearsOfExperience: String // or Number if you prefer numeric years
});

const skillSchema = new mongoose.Schema({
  skillName: String
});

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  rememberMe: Boolean,
  personalInfo: personalInfoSchema,  // Embedded personal information
  education: [educationSchema],  // Array of education records
  job: [jobSchema],  // Array of job records
  skills: [skillSchema] // Array of skills
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
