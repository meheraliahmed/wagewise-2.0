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
app.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('friends');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
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

app.get('/check-friend-status/:email', async (req, res) => {
  const { email } = req.params;
  try {
      // Assume you have a method to find the user by email
      const user = await User.findOne({ 'personalInfo.email': email }).populate('friends');
      if (!user) return res.status(404).send({ error: 'User not found' });

      // Check if the current user (you can get the current user from the session or token) is in the friends list
      const currentUserEmail = req.user.email; // This should come from your authentication
      const currentUser = await User.findOne({ 'personalInfo.email': currentUserEmail });
      const isFriend = currentUser.friends.includes(user._id);

      res.send({ isFriend });
  } catch (error) {
      console.error('Error checking friend status:', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/toggle-friend', async (req, res) => {
  const { userEmail, friendEmail } = req.body;

  // Check if userEmail and friendEmail are provided
  if (!userEmail || !friendEmail) {
    return res.status(400).send('User email and friend email must be provided');
  }

  try {
    // Find both users
    const user = await User.findOne({ email: userEmail });
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).send('User or Friend not found');
    }

    // Check if they are already friends
    const isFriend = user.friends.includes(friend._id);

    if (isFriend) {
      // If they are friends, remove the friend
      user.friends.pull(friend._id);
      friend.friends.pull(user._id); // Optional: to keep friendship mutual
      await user.save();
      await friend.save();
      return res.send('Friend removed');
    } else {
      // If not friends, add the friend
      user.friends.push(friend._id);
      friend.friends.push(user._id); // Optional: to keep friendship mutual
      await user.save();
      await friend.save();
      return res.send('Friend added');
    }
  } catch (error) {
    console.error('Error toggling friend status:', error);
    return res.status(500).send('Internal Server Error');
  }
});



app.get('/check-friend-status/:email', async (req, res) => {
  try {
      const { email } = req.params;

      // Find the logged-in user using their email
      const user = await User.findOne({ email: req.user.email }); // Make sure req.user.email is the logged-in user's email
      const friend = await User.findOne({ email }); // Find the friend using the provided email

      if (!user || !friend) {
          return res.status(404).send('User or Friend not found');
      }

      // Check if the friend ID exists in the user's friend list
      const isFriend = user.friends.includes(friend._id);

      res.status(200).json({ isFriend });
  } catch (error) {
      console.error('Error checking friend status:', error);
      res.status(500).send('Internal Server Error');
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


app.post('/like-thread', async (req, res) => {
  const { threadId, email, loggedInUserEmail } = req.body;

  // Validate required fields
  if (!threadId || !email || !loggedInUserEmail) {
      return res.status(400).send({ message: 'Thread ID and emails are required' });
  }

  // Validate thread ID format
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).send({ message: 'Invalid thread ID' });
  }

  try {
      // Find the user who owns the thread
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).send({ message: 'User not found' });
      }

      // Find the thread in the user's threads array
      const thread = user.threads.id(threadId);
      if (!thread) {
          return res.status(404).send({ message: 'Thread not found' });
      }

      // Find the logged-in user by email to get their ObjectId
      const loggedInUser = await User.findOne({ email: loggedInUserEmail });
      if (!loggedInUser) {
          return res.status(404).send({ message: 'Logged-in user not found' });
      }

      // Check if the user has already liked the thread
      if (!thread.likes.includes(loggedInUser._id)) {
          thread.likes.push(loggedInUser._id); // Push the ObjectId of the logged-in user
          await user.save(); // Save the updated user document
      }

      return res.status(200).send({ message: 'Thread liked successfully', thread });
  } catch (error) {
      console.error('Error in like-thread route:', error);
      return res.status(500).send({ message: 'Internal server error', error: error.message });
  }
});

app.post('/dislike-thread', async (req, res) => {
  const { threadId, email, loggedInUserEmail } = req.body;

  // Validate required fields
  if (!threadId || !email || !loggedInUserEmail) {
      return res.status(400).send({ message: 'Thread ID and emails are required' });
  }

  // Validate thread ID format
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).send({ message: 'Invalid thread ID' });
  }

  try {
      // Find the user who owns the thread
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).send({ message: 'User not found' });
      }

      // Find the thread in the user's threads array
      const thread = user.threads.id(threadId);
      if (!thread) {
          return res.status(404).send({ message: 'Thread not found' });
      }

      // Find the logged-in user by email to get their ObjectId
      const loggedInUser = await User.findOne({ email: loggedInUserEmail });
      if (!loggedInUser) {
          return res.status(404).send({ message: 'Logged-in user not found' });
      }

      // Check if the user has already liked the threada
      if (!thread.dislikes.includes(loggedInUser._id)) {
          thread.dislikes.push(loggedInUser._id); // Push the ObjectId of the logged-in user
          await user.save(); // Save the updated user document
      }

      return res.status(200).send({ message: 'Thread liked successfully', thread });
  } catch (error) {
      console.error('Error in like-thread route:', error);
      return res.status(500).send({ message: 'Internal server error', error: error.message });
  }
});


// Reply to a thread
app.post('/reply-to-thread', async (req, res) => {
  console.log('Received request to reply to thread');

  // Log the incoming request body
  console.log('Request Body:', req.body);

  const { threadId, replyContent, replyingUserEmail } = req.body;

  if (!threadId || !replyContent || !replyingUserEmail) {
      console.log('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      // Find the user who is replying
      const user = await User.findOne({ email: replyingUserEmail });
      if (!user) {
          console.log('User not found for email:', replyingUserEmail);
          return res.status(404).json({ error: 'User not found' });
      }

      // Find the thread by ID
      const threadOwner = await User.findOne({ 'threads._id': threadId });
      if (!threadOwner) {
          console.log('Thread not found for ID:', threadId);
          return res.status(404).json({ error: 'Thread not found' });
      }

      // Add the reply to the thread
      const thread = threadOwner.threads.id(threadId);
      thread.replies.push({
          content: replyContent,
          user: user._id, // Add the reply with reference to the user
          createdAt: new Date(),
      });

      // Save the updated thread owner (which will save the thread)
      await threadOwner.save();

      // Log the successful reply
      console.log('Reply added successfully');
      res.status(200).json({ message: 'Reply added successfully' });
  } catch (error) {
      console.error('Error replying to thread:', error);
      res.status(500).json({ error: 'Failed to reply to thread' });
  }
});
app.get('/replies/:threadId', async (req, res) => {
  const { threadId } = req.params;

  try {
      // Find the thread by its ID and populate the replies
      const user = await User.findOne({ 'threads._id': threadId }, { 'threads.$': 1 });

      if (!user || user.threads.length === 0) {
          return res.status(404).json({ message: 'Thread not found' });
      }

      const thread = user.threads[0];
      res.json(thread.replies); // Return the replies of the thread
  } catch (error) {
      console.error('Error fetching replies:', error);
      res.status(500).json({ message: 'Error fetching replies' });
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
