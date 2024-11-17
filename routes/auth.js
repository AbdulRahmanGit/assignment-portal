// Importing necessary modules
const express = require('express'); // Express for routing and middleware
const bcrypt = require('bcryptjs'); // Bcrypt for password hashing and comparison
const jwt = require('jsonwebtoken'); // JSON Web Token for user authentication
const User = require('../models/User'); // Importing the User model
const router = express.Router(); // Creating a new router instance

// Register Route: POST /register
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body; // Destructuring request body

  try {
    // Check if the email already exists in the database
    const userExists = await User.findOne({ email });
    // Check if the username already exists in the database
    const usernameExists = await User.findOne({ username });

    // If either the email or username exists, return an error response
    if (userExists || usernameExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hashing the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user document with the hashed password and other provided details
    const user = new User({ username, email, password: hashedPassword, role });

    // Saving the user document to the database
    await user.save();

    // Responding with a success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Handling errors and responding with an error message
    res.status(400).json({ error: err.message });
  }
});

// Login Route: POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Destructuring request body

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user is not found, return an error response
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Comparing the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords don't match, return an error response
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a JWT token with the user's ID and role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user role
    res.json({ token, role: user.role });
  } catch (err) {
    // Handling errors and responding with an error message
    res.status(500).json({ error: err.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
