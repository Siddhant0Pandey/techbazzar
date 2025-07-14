import express from 'express';
import { body, validationResult } from 'express-validator';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateUser, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
      .populate('items.productId');
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, items: [] });
      await wishlist.save();
    }

    res.json({
      success: true,
      data: { wishlist }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
});

// Add item to wishlist
router.post('/add', authenticateUser, [
  body('productId').isMongoId().withMessage('Valid product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, items: [] });
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add new item
    wishlist.items.push({ productId });
    await wishlist.save();
    await wishlist.populate('items.productId');

    res.json({
      success: true,
      message: 'Item added to wishlist',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = wishlist.items.filter(
      item => item.productId.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('items.productId');

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message
    });
  }
});

// Clear wishlist
router.delete('/clear', authenticateUser, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: { wishlist }
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message
    });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    const isInWishlist = wishlist ? 
      wishlist.items.some(item => item.productId.toString() === productId) : 
      false;

    res.json({
      success: true,
      data: { isInWishlist }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist',
      error: error.message
    });
  }
});

export default router;