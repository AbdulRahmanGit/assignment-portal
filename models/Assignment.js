// Importing the mongoose module
const mongoose = require('mongoose');

// Defining the assignment schema for MongoDB
const assignmentSchema = new mongoose.Schema({
  // 'userId' field: references the User model, required
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // 'task' field: a string that describes the task, required
  task: { type: String, required: true },

  // 'adminId' field: references the User model for the admin, required
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // 'status' field: can be 'pending', 'accepted', or 'rejected', defaults to 'pending'
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },

  // 'createdAt' field: sets the date when the assignment was created, defaults to current date
  createdAt: { type: Date, default: Date.now }
});

// Creating the Assignment model based on the schema
const Assignment = mongoose.model('Assignment', assignmentSchema);

// Exporting the Assignment model for use in other parts of the application
module.exports = Assignment;
