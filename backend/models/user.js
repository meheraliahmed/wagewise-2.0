const mongoose = require('mongoose');

// Define the reply schema first
const replySchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who replied
});

// Define the thread schema, now it can reference replySchema
const threadSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Keep this as ObjectId
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Keep this as ObjectId
  replies: [replySchema], // Array of replies to the thread
});

// The other schemas (personalInfoSchema, educationSchema, etc.) remain the same
const personalInfoSchema = new mongoose.Schema({
  name: String,
  age: String,
  hometown: String,
  currentCity: String,
  email: String,
  phone: String,
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institute: String,
  graduationYear: String,
  gpa: String, // Optional field
});

const jobSchema = new mongoose.Schema({
  companyName: String,
  designation: String,
  city: String,
  yearsOfExperience: String, // or Number if you prefer numeric years
});

const skillSchema = new mongoose.Schema({
  skillName: String,
});

// Define the user schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  rememberMe: Boolean,
  personalInfo: personalInfoSchema,  // Embedded personal information
  education: [educationSchema],  // Array of education records
  job: [jobSchema],  // Array of job records
  skills: [skillSchema], // Array of skills
  threads: [threadSchema], // Array of threads, with likes, dislikes, and replies
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of friends (references to other users)
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
