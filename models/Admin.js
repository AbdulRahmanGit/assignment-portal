const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Defining the admin schema for MongoDB
const adminSchema = new mongoose.Schema({
  // 'username' field: must be a string, required, and unique
  username: { type: String, required: true, unique: true },

  // 'email' field: must be a string, required, and unique
  email: { type: String, required: true, unique: true },

  // 'password' field: must be a string and required
  password: { type: String, required: true },
});

// Pre-save middleware to hash the password before saving to database
adminSchema.pre('save', async function (next) {
  // Check if the password field was modified, if not, skip hashing
  if (!this.isModified('password')) return next();

  // Hashing the password before saving it
  this.password = await bcrypt.hash(this.password, 10);
  next(); // Proceed with saving the document
});

// Method to compare entered password with stored hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  // Using bcrypt to compare entered password with the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// Creating the Admin model based on the schema
const Admin = mongoose.model('Admin', adminSchema);

// Exporting the Admin model for use in other parts of the application
module.exports = Admin;
