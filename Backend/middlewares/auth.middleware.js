const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');


module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token has been blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(500).json({ message: 'Internal server error during authentication' });
    }
};

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });



    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;

        return next()
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}


// Add this function to your existing auth.middleware.js file

// Optional authentication - continues even if no token is provided
exports.authenticateOptional = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            // No token provided, but continue anyway
            console.log('No authentication token provided, proceeding as public request');
            return next();
        }
        
        // Verify token if provided
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('Invalid token, proceeding as public request');
                return next();
            }
            
            // Token is valid, attach user info
            if (decoded.role === 'user') {
                req.user = decoded;
            } else if (decoded.role === 'captain') {
                req.captain = decoded;
            }
            
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        // Continue anyway
        next();
    }
};


// Add a function to check if the token is properly formatted
const isValidToken = (token) => {
  if (!token) return false;
  // Basic check for JWT format (header.payload.signature)
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token);
};

exports.authenticateUser = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;
    
    // Log token for debugging
    console.log('Auth token received:', token ? 'Token present' : 'No token');
    
    if (!token || !isValidToken(token)) {
      console.log('Invalid or missing token');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Token is not valid' });
      }
      
      // Set user info in request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error in authentication' });
  }
};