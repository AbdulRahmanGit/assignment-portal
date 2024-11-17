// Importing necessary modules
const mongoose = require('mongoose'); // Mongoose for interacting with MongoDB
const bcrypt = require('bcryptjs'); // Bcryptjs for password hashing

// Defining the user schema for MongoDB
const userSchema = new mongoose.Schema({
  // 'username' field: must be a string, required, and unique
  username: { type: String, required: true, unique: true },

  // 'email' field: must be a string, required, and unique
  email: { type: String, required: true, unique: true },

  // 'password' field: must be a string and required
  password: { type: String, required: true },

  // 'role' field: can either be 'user' or 'admin', defaults to 'user' and is required
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
});

// Method to compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Using bcrypt to compare entered password with the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// Creating the User model based on the schema
const User = mongoose.model('User', userSchema);

// Exporting the User model so it can be used in other parts of the application
module.exports = User;
