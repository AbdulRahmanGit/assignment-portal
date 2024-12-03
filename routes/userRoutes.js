const express = require('express');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const protect = require('../middlewares/auth');
const { bucket } = require('../config/googleCloud');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
});

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
router.post('/upload', protect, upload.single('submission'), async (req, res) => {
    const { task, adminId } = req.body;
    const userId = req.user._id;

    try {
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid adminId' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileName = `${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
        const file = bucket.file(fileName);

        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        stream.on('error', (err) => {
            console.error('Error uploading to Google Cloud Storage:', err);
            res.status(500).json({ error: 'Error uploading file' });
        });

        stream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            
            const assignment = new Assignment({
                userId,
                task,
                submission: publicUrl,
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                adminId
            });

            await assignment.save();
            res.status(201).json({ message: 'Assignment uploaded successfully', fileUrl: publicUrl });
        });

        stream.end(req.file.buffer);
    } catch (err) {
        console.error('Error uploading assignment:', err);
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;

