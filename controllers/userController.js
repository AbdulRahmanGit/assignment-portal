const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const io = require('socket.io')(server);
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadAssignment = async (req, res) => {
    try {
        const { task, adminId } = req.body;

        // Validate input
        if (!task || !adminId) {
            return res.status(400).json({ message: 'Task and Admin ID are required' });
        }

        const newAssignment = new Assignment({
            userId: req.user.id, // User ID from token middleware
            task,
            adminId, // Associate the assignment with the selected admin
        });

        await newAssignment.save();

        // Notify the admin (WebSocket or any event-based notification system)
        //io.to(adminId).emit('newAssignment', { task });

        res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
