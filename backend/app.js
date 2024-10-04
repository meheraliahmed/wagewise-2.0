const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Import the User model

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/mydb', {
 
 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Failed to connect to MongoDB', error);
  process.exit(1); // Exit if unable to connect
});

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, MongoDB!');
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, rememberMe } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,  // Save the hashed password
      rememberMe
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Error registering user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  
    // If successful, you might want to return a token here or just confirm login
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

app.post('/add-info', async (req, res) => {
  console.log('Received request at /add-info');
  console.log('Request body:', req.body);

  try {
    const { personalDetails, educationalQualifications, professionalExperience, skills } = req.body;
    const email = personalDetails?.email; // Ensure email is accessed safely

    console.log('Email:', email);
    console.log('Personal Details:', personalDetails);
    console.log('Educational Qualifications:', educationalQualifications);
    console.log('Professional Experience:', professionalExperience);
    console.log('Skills:', skills);

    if (!email) {
      console.log('Email not provided in the request body');
      return res.status(400).send('Email is required');
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    // Update the user's information
    user.personalInfo = personalDetails || {};
    user.education = educationalQualifications || [];
    user.job = professionalExperience || [];
    user.skills = skills || [];

    // Save the updated user document
    await user.save();

    res.status(200).send('Information added successfully');
  } catch (error) {
    console.error('Error adding information:', error);
    res.status(500).send('Error adding information');
  }
});
app.get('/search-users', async (req, res) => {
  const { name } = req.query;
  console.log(`Searching for users with name: ${name}`); // Log the name for debugging

  try {
    const users = await User.find({ 'personalInfo.name': new RegExp(name, 'i') });
    
    if (users.length === 0) {
      return res.status(404).send({ message: 'No users found' });
    }

    res.status(200).send(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).send({ message: 'Error searching users', error });
  }
});


app.get('/user-profile', async (req, res) => {
  try {
    
    const { email } = req.query;
    const user = await User.findOne({ email });
   
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Server error');
  }
});
app.put('/update-profile', async (req, res) => {
  const { email, personalInfo, education, job, skills } = req.body;
  
  try {
    const user = await User.findOneAndUpdate(
      { email }, 
      { personalInfo, education, job, skills }, 
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});
app.get('/user-threads/:email', async (req, res) => {
  try {
    const { email } = req.params; // Get email from request parameters
    const user = await User.findOne({ email }); // Find the user by email

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Handle case where user does not exist
    }

    console.log('Fetched user:', user); // Log the fetched user
    res.status(200).json(user.threads); // Return the user's threads
  } catch (error) {
    console.error('Error fetching user threads:', error); // Log the error
    res.status(500).json({ message: 'Failed to fetch threads', error: error.message }); // Send error response
  }
});
app.post('/verify-password', async (req, res) => {
  const { email, currentPassword } = req.body;
  
 
  const user = await User.findOne({ email });
  console.log(email);
  console.log(currentPassword);
  if (user && bcrypt.compareSync(currentPassword, user.password)) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post('/create-thread', async (req, res) => {
  const { email, title, content } = req.body;
  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Create the thread object
    const newThread = { title, content };

    // Add the thread to the user's threads array
    user.threads.push(newThread);

    // Save the user document
    await user.save();

    res.send({ message: 'Thread created successfully', thread: newThread });
  } catch (error) {
    res.status(500).send({ message: 'Error creating thread', error });
  }
});



app.post('/change-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  await User.updateOne({ email }, { password: hashedPassword });
  res.json({ success: true });
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
