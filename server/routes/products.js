import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { productDB } from '../database/dbAdapter.js';
import { authenticateAdmin, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().trim(),
  query('brand').optional().isString().trim(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
  query('search').optional().isString().trim(),
  query('sort').optional().isIn(['price', '-price', 'rating', '-rating', 'createdAt', '-createdAt', 'title', '-title'])
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

    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      featured,
      new: isNew
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (featured === 'true') filter.isFeatured = true;
    if (isNew === 'true') filter.isNew = true;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get all products and apply client-side filtering
    let products = await productDB.find();

    // Apply filters
    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (brand) {
      products = products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
    }
    if (featured === 'true') {
      products = products.filter(p => p.isFeatured === true);
    }
    if (isNew === 'true') {
      products = products.filter(p => p.isNew === true);
    }

    // Price range filter
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Sort products
    if (sort === 'price') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === '-price') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => a.rating - b.rating);
    } else if (sort === '-rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'title') {
      products.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === '-title') {
      products.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      // Default sort by creation date (newest first)
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = products.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = products.slice(skip, skip + parseInt(limit));
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get single product by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by slug
    let product = await Product.findById(identifier).lean();
    if (!product) {
      product = await Product.findOne({ slug: identifier, isActive: true }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Create new product (Admin only)
router.post('/', authenticateAdmin, checkPermission('products'), [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('slug').trim().isLength({ min: 1 }).withMessage('Slug is required'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description must be between 1 and 2000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Brand is required'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be non-negative'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
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

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: req.body.slug });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: 'Product with this slug already exists'
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateAdmin, checkPermission('products'), [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().trim().isLength({ min: 1, max: 2000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 })
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateAdmin, checkPermission('products'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get product brands
router.get('/brands/list', async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    
    res.json({
      success: true,
      data: { brands }
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands',
      error: error.message
    });
  }
});

export default router;