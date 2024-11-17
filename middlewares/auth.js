const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is in the same directory
/*
const protect = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  
  // Ensure the Authorization header is present and follows the format 'Bearer <token>'
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // Extract the token from the Authorization header
  const token = authorizationHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to req.user

    // Check if the user is an admin (assuming the 'role' field is in the token)
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    next(); // User is authenticated and is an admin, so continue
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
*/

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Select all fields except password
        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
      }
    }
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };

module.exports = protect;
