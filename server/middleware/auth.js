import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

// Generate JWT tokens
export const generateTokens = (payload) => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'your-access-secret',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Verify JWT token
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// User authentication middleware
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET || 'your-access-secret');
    
    if (decoded.type !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }
    
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Admin authentication middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET || 'your-access-secret');
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }
    
    const admin = await Admin.findById(decoded.id).select('-password -refreshToken');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found or inactive'
      });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Check admin permissions
export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required'
      });
    }
    
    if (req.admin.role === 'super_admin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
  };
};