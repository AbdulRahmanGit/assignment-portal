const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  task: { 
    type: String, 
    required: true 
  },
  submission: { 
    type: String,
    required: true 
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending',
    index: true
  },
  feedback: {
    type: String,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

assignmentSchema.index({ userId: 1, status: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

