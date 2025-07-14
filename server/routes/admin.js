import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { adminDB } from '../database/dbAdapter.js';
import { generateTokens, verifyToken, authenticateAdmin, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateAdminLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateAdminRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'super_admin'])
    .withMessage('Invalid role')
];

// Admin login
router.post('/login', validateAdminLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find admin
    const admin = await adminDB.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      type: 'admin'
    });

    // Update admin with refresh token
    admin.refreshToken = refreshToken;
    admin.lastLogin = new Date();

    // Remove password from response
    const adminResponse = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      createdAt: admin.createdAt
    };

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: adminResponse,
        token: accessToken
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Create admin (only super_admin can create new admins)
router.post('/register', authenticateAdmin, checkPermission('admin_management'), validateAdminRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role = 'admin' } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Admin already exists with this email'
      });
    }

    // Only super_admin can create super_admin
    if (role === 'super_admin' && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admin can create super admin accounts'
      });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password,
      role
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        admin
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin registration failed',
      error: error.message
    });
  }
});

// Refresh admin token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret');
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Find admin
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== refreshToken || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokens({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      type: 'admin'
    });

    // Update refresh token
    admin.refreshToken = tokens.refreshToken;
    await admin.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });
  } catch (error) {
    console.error('Admin token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// Admin logout
router.post('/logout', authenticateAdmin, async (req, res) => {
  try {
    // Clear refresh token
    req.admin.refreshToken = null;
    await req.admin.save();

    res.json({
      success: true,
      message: 'Admin logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

// Get current admin profile
router.get('/profile', authenticateAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    console.error('Admin profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update admin profile
router.put('/profile', authenticateAdmin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, avatar } = req.body;
    const admin = req.admin;

    // Update fields
    if (name) admin.name = name;
    if (avatar) admin.avatar = avatar;

    await admin.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        admin
      }
    });
  } catch (error) {
    console.error('Admin profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      error: error.message
    });
  }
});

// Get all admins (only super_admin)
router.get('/list', authenticateAdmin, checkPermission('admin_management'), async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password -refreshToken');
    
    res.json({
      success: true,
      data: {
        admins
      }
    });
  } catch (error) {
    console.error('Admin list fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin list',
      error: error.message
    });
  }
});

// Update admin status (only super_admin)
router.put('/:id/status', authenticateAdmin, checkPermission('admin_management'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent deactivating self
    if (admin._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    admin.isActive = isActive;
    await admin.save();

    res.json({
      success: true,
      message: 'Admin status updated successfully',
      data: {
        admin
      }
    });
  } catch (error) {
    console.error('Admin status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin status',
      error: error.message
    });
  }
});

export default router;