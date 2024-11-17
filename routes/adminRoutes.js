const express = require('express');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const protect = require('../middlewares/auth'); // Import the middleware
const router = express.Router();
/*Fetch all assignments with user's username (Admin route)
router.get('/assignments', protect, async (req, res) => {
    try {
      // Check if the user is an admin (assuming protect middleware sets req.adminId)
      const adminId = req.adminId; // adminId should be part of the user object set in the protect middleware
  
      // Fetch all assignments, and populate userId and adminId with their usernames
      const assignments = await Assignment.find({ adminId })
        .populate('userId', 'username') // Populate the userId with the 'username' field
        .populate('adminId', 'username') // Optionally populate adminId with username
        .exec();
        const formattedAssignments = assignments.map(assignment => ({
            ...assignment._doc, // Keep existing fields
            username: assignment.userId ? assignment.userId.username : null, // Handle cases where userId might be null
            adminUsername: assignment.adminId ? assignment.adminId.username : null // Handle cases where adminId might be null
        }));
  
      res.status(200).json(formattedAssignments); // Return the populated assignments
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  */
 
// Fetch Assignments submitted by the user (Protected route)
router.get('/assignments', protect, async (req, res) => {
    const username = req.user.username;  
    try {
        const assignments = await Assignment.find({ adminId : req.user.id })
            .populate('userId', 'username')
            .populate('adminId', 'username'); // Only populate adminId

        res.status(200).json(assignments);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

  
  
// Accept Assignment (Admin-only route)
router.post('/assignments/:id/accept', protect, async (req, res) => {
    const { id } = req.params;
    try {
      const assignment = await Assignment.findById(id);
      if (assignment) {
        assignment.status = 'accepted';
        await assignment.save();
        res.json({ message: 'Assignment accepted' });
      } else {
        res.status(404).json({ message: 'Assignment not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Reject Assignment (Admin-only route)
  router.post('/assignments/:id/reject', protect, async (req, res) => {
    const { id } = req.params;
    try {
      const assignment = await Assignment.findById(id);
      if (assignment) {
        assignment.status = 'rejected';
        await assignment.save();
        res.json({ message: 'Assignment rejected' });
      } else {
        res.status(404).json({ message: 'Assignment not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
module.exports = router;