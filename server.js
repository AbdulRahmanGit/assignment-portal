// Import required modules
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');

// CORS configuration
const corsOptions = {
    origin: '*',  // Allow all origins (can be changed to a specific URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    credentials: true,  // Allow cookies to be sent with requests (optional)
};

app.use(cors(corsOptions));  // Apply CORS with the configuration

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, 'public')));



// API Routes
app.use('/api/admin', adminRoutes); // Admin-related routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/auth', authRoutes); // Authentication routes



// Home page with list of available URLs
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Assignment Submission Portal</h1>
        <p>Use the following URLs to explore the portal:</p>
        <ul>
            <li><a href="/api/auth/register">POST /api/auth/register</a> - Register a new user or admin</li>
            <li><a href="/api/auth/login">POST /api/auth/login</a> - Login as a user or admin</li>
            <li><a href="/api/users/upload">POST /api/users/upload</a> - Upload an assignment (User)</li>
            <li><a href="/api/users/admins">GET /api/users/admins</a> - Fetch all registered admins</li>
            <li><a href="/api/admin/assignments">GET /api/admin/assignments</a> - View assignments tagged to the admin</li>
            <li><a href="/api/admin/assignments/:id/accept">POST /api/admin/assignments/:id/accept</a> - Accept an assignment</li>
            <li><a href="/api/admin/assignments/:id/reject">POST /api/admin/assignments/:id/reject</a> - Reject an assignment</li>
        </ul>
    `);
});

// Handle 404 errors (if no route matches)
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
