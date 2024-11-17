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




// Simple HTML template for Vercel
const getWelcomePage = () => `
<!DOCTYPE html>
<html>
<head>
    <title>Assignment Portal API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f0f2f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 { color: #2c3e50; }
        ul { padding-left: 20px; }
        li {
            margin: 10px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            list-style-type: none;
        }
        .method {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 3px;
            font-weight: bold;
            margin-right: 8px;
        }
        .post { background: #e3f2fd; color: #1565c0; }
        .get { background: #e8f5e9; color: #2e7d32; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Assignment Portal API</h1>
        <p>Welcome to the Assignment Portal API! Available endpoints:</p>
        <p><strong>Note:</strong> <em>Use this deployed link to test POST methods in Postman:</em> <a href="https://assignment-portal-mu.vercel.app/">https://assignment-portal-mu.vercel.app/</a></p>
        
        <h3>Authentication:</h3>
        <ul>
            <li><span class="method post">POST</span> /api/auth/register - Register a new user or admin</li>
            <li><span class="method post">POST</span> /api/auth/login - Login as a user or admin</li>
        </ul>

        <h3>User Operations:</h3>
        <ul>
            <li><span class="method post">POST</span> /api/users/upload - Upload an assignment <em>Protected</em></li>
            <li><span class="method get">GET</span> /api/users/admins - Fetch all admins</li>
            <li><span class="method get">GET</span> /api/users/assignments - Fetch assignments completed <em>Protected</em></li>
        </ul>

        <h3>Admin Operations:</h3>
        <ul>
            <li><span class="method get">GET</span> /api/admin/assignments - View assignments <em>Protected</em></li>
            <li><span class="method post">POST</span> /api/admin/assignments/:id/accept - Accept assignment <em>Protected</em></li>
            <li><span class="method post">POST</span> /api/admin/assignments/:id/reject - Reject assignment <em>Protected</em></li>
        </ul>
        
        <p style="margin-top: 20px; color: #666;">
            🔗 Testing Link: <a href="https://assignment-portal-mu.vercel.app/">https://assignment-portal-mu.vercel.app/</a>
        </p>
    </div>
    <script>
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;

// Welcome route
app.get('/', (req, res) => {
    res.send(getWelcomePage());
});

app.get('/check', (req, res) => {
    res.json({ message: "Server is working on Vercel!" });
});
// Handle 404 errors (if no route matches)
app.use((req, res, next) => {
    res.status(404).send('404 Not Found or invalid Method');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
