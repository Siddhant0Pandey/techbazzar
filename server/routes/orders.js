import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authenticateUser, authenticateAdmin, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get user's orders
router.get('/', authenticateUser, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'canceled'])
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

    const { page = 1, limit = 10, status } = req.query;
    const filter = { userId: req.user._id };
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.productId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get single order
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Create order from cart
router.post('/create', authenticateUser, [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('shippingAddress.phone').trim().isLength({ min: 1 }).withMessage('Phone is required'),
  body('shippingAddress.province').trim().isLength({ min: 1 }).withMessage('Province is required'),
  body('shippingAddress.district').trim().isLength({ min: 1 }).withMessage('District is required'),
  body('shippingAddress.municipality').trim().isLength({ min: 1 }).withMessage('Municipality is required'),
  body('shippingAddress.ward').trim().isLength({ min: 1 }).withMessage('Ward is required'),
  body('shippingAddress.street').trim().isLength({ min: 1 }).withMessage('Street address is required'),
  body('paymentMethod').isIn(['cash_on_delivery', 'esewa', 'khalti', 'bank_transfer', 'card']).withMessage('Valid payment method is required')
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

    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify stock availability and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.productId;
      
      if (!product.inStock || product.stockQuantity < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`
        });
      }

      const price = product.discountPrice || product.price;
      orderItems.push({
        productId: product._id,
        product: {
          title: product.title,
          price: price,
          image: product.images[0]
        },
        quantity: cartItem.quantity,
        price: price
      });

      totalAmount += price * cartItem.quantity;
    }

    // Add shipping cost (free for orders above 10000)
    const shippingCost = totalAmount >= 10000 ? 0 : 500;
    totalAmount += shippingCost;

    // Create order
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending'
    });

    await order.save();

    // Update product stock
    for (const cartItem of cart.items) {
      await Product.findByIdAndUpdate(
        cartItem.productId._id,
        { $inc: { stockQuantity: -cartItem.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Cancel order (only if pending)
router.put('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be canceled'
      });
    }

    order.status = 'canceled';
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order canceled successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticateAdmin, checkPermission('orders'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'canceled']),
  query('search').optional().isString().trim()
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

    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    
    if (search) {
      filter.$or = [
        { 'shippingAddress.name': new RegExp(search, 'i') },
        { 'shippingAddress.phone': new RegExp(search, 'i') },
        { trackingNumber: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email')
        .populate('items.productId', 'title images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Admin: Update order status
router.put('/admin/:id/status', authenticateAdmin, checkPermission('orders'), [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'canceled']).withMessage('Valid status is required'),
  body('trackingNumber').optional().isString().trim()
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

    const { status, trackingNumber } = req.body;
    const updateData = { status };
    
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

export default router;