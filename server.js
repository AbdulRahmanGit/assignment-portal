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
app.use(cors()); // Allow all origins
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// You can also set up your routes here
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.use('/api/admin', adminRoutes); // Admin-related routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/auth', authRoutes); // Authentication routes

// Sample route (home page)
app.get('/', (req, res) => {
    res.send('Assignment Portal is running!');
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
