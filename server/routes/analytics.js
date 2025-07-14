import express from 'express';
import { query, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { authenticateAdmin, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', authenticateAdmin, checkPermission('analytics'), async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get current month stats
    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      monthlyRevenue,
      monthlyOrders,
      lastMonthRevenue,
      lastMonthOrders,
      pendingOrders,
      lowStockProducts
    ] = await Promise.all([
      // Total revenue
      Order.aggregate([
        { $match: { status: { $ne: 'canceled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Total orders
      Order.countDocuments({ status: { $ne: 'canceled' } }),
      
      // Total products
      Product.countDocuments({ isActive: true }),
      
      // Total customers
      User.countDocuments({ isActive: true }),
      
      // Monthly revenue
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfMonth },
            status: { $ne: 'canceled' }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Monthly orders
      Order.countDocuments({
        createdAt: { $gte: startOfMonth },
        status: { $ne: 'canceled' }
      }),
      
      // Last month revenue
      Order.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            status: { $ne: 'canceled' }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Last month orders
      Order.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        status: { $ne: 'canceled' }
      }),
      
      // Pending orders
      Order.countDocuments({ status: 'pending' }),
      
      // Low stock products
      Product.countDocuments({ stockQuantity: { $lte: 5 }, isActive: true })
    ]);

    // Calculate growth percentages
    const currentRevenue = monthlyRevenue[0]?.total || 0;
    const previousRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = previousRevenue > 0 ? 
      ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    const ordersGrowth = lastMonthOrders > 0 ? 
      ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalRevenue: totalRevenue[0]?.total || 0,
          totalOrders,
          totalProducts,
          totalCustomers,
          pendingOrders,
          lowStockProducts
        },
        growth: {
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
          ordersGrowth: Math.round(ordersGrowth * 100) / 100
        },
        alerts: {
          pendingOrders,
          lowStockProducts
        }
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message
    });
  }
});

// Get sales analytics
router.get('/sales', authenticateAdmin, checkPermission('analytics'), [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
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

    const { period = '30d', startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const daysBack = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      }[period];

      dateFilter = {
        createdAt: {
          $gte: new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
        }
      };
    }

    // Get sales data grouped by date
    const salesData = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $ne: 'canceled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $ne: 'canceled' }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          title: '$product.title',
          totalSold: 1,
          revenue: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        salesData,
        topProducts
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics',
      error: error.message
    });
  }
});

// Get customer analytics
router.get('/customers', authenticateAdmin, checkPermission('analytics'), async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCustomers,
      newCustomersThisMonth,
      customersByMonth,
      topCustomers
    ] = await Promise.all([
      // Total customers
      User.countDocuments({ isActive: true }),
      
      // New customers this month
      User.countDocuments({
        createdAt: { $gte: startOfMonth },
        isActive: true
      }),
      
      // Customers by month (last 12 months)
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1)
            },
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]),
      
      // Top customers by order value
      Order.aggregate([
        {
          $match: { status: { $ne: 'canceled' } }
        },
        {
          $group: {
            _id: '$userId',
            totalSpent: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            name: '$user.name',
            email: '$user.email',
            totalSpent: 1,
            orderCount: 1
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCustomers,
          newCustomersThisMonth
        },
        customersByMonth,
        topCustomers
      }
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer analytics',
      error: error.message
    });
  }
});

// Get product analytics
router.get('/products', authenticateAdmin, checkPermission('analytics'), async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      topRatedProducts,
      categoryDistribution
    ] = await Promise.all([
      // Total products
      Product.countDocuments(),
      
      // Active products
      Product.countDocuments({ isActive: true }),
      
      // Out of stock products
      Product.countDocuments({ stockQuantity: 0, isActive: true }),
      
      // Low stock products
      Product.countDocuments({ stockQuantity: { $lte: 5, $gt: 0 }, isActive: true }),
      
      // Top rated products
      Product.find({ isActive: true })
        .sort({ rating: -1, reviewCount: -1 })
        .limit(10)
        .select('title rating reviewCount images'),
      
      // Products by category
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          outOfStockProducts,
          lowStockProducts
        },
        topRatedProducts,
        categoryDistribution
      }
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product analytics',
      error: error.message
    });
  }
});

export default router;