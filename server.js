// Import required modules
require('dotenv').config();
const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const setupWebSocket = require('./config/websocket'); // Import WebSocket setup
const app = express();

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/admin', adminRoutes); // Admin-related routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/auth', authRoutes); // Authentication routes

// Serve static files (for frontend)
app.use(express.static('public')); // Ensure 'public' folder has your frontend files

// Sample route (home page)
app.get('/', (req, res) => {
    res.send('Assignment Portal is running!');
});

// Handle 404 errors (if no route matches)
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// Create HTTP server (Express + WebSocket)
const server = http.createServer(app);

// Setup WebSocket (will use the same server for both HTTP and WebSocket)
setupWebSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
