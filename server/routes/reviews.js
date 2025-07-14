import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { authenticateUser, authenticateAdmin, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('rating').optional().isInt({ min: 1, max: 5 })
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

    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    const filter = { productId, isApproved: true };
    if (rating) filter.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total, stats] = await Promise.all([
      Review.find(filter)
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { productId: productId, isApproved: true } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: '$rating'
            }
          }
        }
      ])
    ]);

    // Calculate rating distribution
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.length > 0) {
      stats[0].ratingDistribution.forEach(rating => {
        ratingDistribution[rating]++;
      });
    }

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews,
        stats: stats.length > 0 ? {
          averageRating: Math.round(stats[0].averageRating * 10) / 10,
          totalReviews: stats[0].totalReviews,
          ratingDistribution
        } : {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReviews: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Create review
router.post('/', authenticateUser, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
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

    const { productId, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId,
      userId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      userId: req.user._id,
      'items.productId': productId,
      status: 'delivered'
    });

    const review = new Review({
      productId,
      userId: req.user._id,
      rating,
      comment,
      isVerifiedPurchase: !!hasPurchased
    });

    await review.save();
    await review.populate('userId', 'name');

    // Update product rating
    const reviews = await Review.find({ productId, isApproved: true });
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
});

// Update review
router.put('/:id', authenticateUser, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ min: 1, max: 1000 })
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

    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    Object.assign(review, req.body);
    await review.save();
    await review.populate('userId', 'name');

    // Update product rating
    const reviews = await Review.find({ productId: review.productId, isApproved: true });
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(review.productId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
});

// Delete review
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const reviews = await Review.find({ productId, isApproved: true });
    const averageRating = reviews.length > 0 ? 
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

// Mark review as helpful
router.post('/:id/helpful', authenticateUser, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    ).populate('userId', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: { review }
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful',
      error: error.message
    });
  }
});

// Admin: Get all reviews
router.get('/admin/all', authenticateAdmin, checkPermission('products'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('approved').optional().isBoolean()
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

    const { page = 1, limit = 20, approved } = req.query;
    const filter = {};
    
    if (approved !== undefined) filter.isApproved = approved === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('userId', 'name email')
        .populate('productId', 'title images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReviews: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Admin: Approve/reject review
router.put('/admin/:id/approve', authenticateAdmin, checkPermission('products'), [
  body('isApproved').isBoolean().withMessage('Approval status is required')
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

    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('userId', 'name email')
     .populate('productId', 'title');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update product rating
    const reviews = await Review.find({ productId: review.productId._id, isApproved: true });
    const averageRating = reviews.length > 0 ? 
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    
    await Product.findByIdAndUpdate(review.productId._id, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: { review }
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review approval status',
      error: error.message
    });
  }
});

export default router;