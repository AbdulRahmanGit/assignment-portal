const express = require('express');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const protect = require('../middlewares/auth'); // Import the middleware 

const router = express.Router();

// Get Admins (requires admin role)
router.get('/admins', async (req, res) => {
    try {// Fetching  only necessary fields
        const admins = await User.find({ role: 'admin' }).select('username'); // Fetch only necessary fields
        res.json(admins);
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// Fetch Assignments submitted by the user (Protected route)
// Fetch all assignments with user's username (Admin route)
router.get('/assignments', protect, async (req, res) => {
    try {
        const assignments = await Assignment.find({ userId: req.user._id }) // Assuming adminId is part of the user object
            .populate('userId', 'username')
            .populate('adminId', 'username');

        res.status(200).json(assignments); 
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Upload Assignment (Protected route)
router.post('/upload', protect, async (req, res) => {
    const { task, adminId } = req.body;
    const userId = req.user._id; 

    try {
        const admin = await User.findById(adminId); // Use findById for efficiency
        if (!admin || admin.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid adminId' });
        }
        const assignment = new Assignment({ userId, task, adminId });
        await assignment.save();
        res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;
