// Database adapter to work with both MongoDB and in-memory storage
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import bcrypt from 'bcryptjs';

let isMongoConnected = false;
let inMemoryData = {
  users: [],
  admins: [],
  products: [],
  categories: []
};

// Initialize with some default data
const initializeInMemoryData = () => {
  // Add default admin user
  if (inMemoryData.admins.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 12);
    inMemoryData.admins.push({
      _id: 'admin-1',
      name: 'Admin User',
      email: 'admin@techbazaar.com',
      password: hashedPassword,
      role: 'super_admin',
      permissions: ['all'],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Add sample products
  if (inMemoryData.products.length === 0) {
    inMemoryData.products = [
      {
        _id: 'prod-1',
        title: "iPhone 15 Pro Max",
        titleNp: "आईफोन १५ प्रो म्याक्स",
        slug: "iphone-15-pro-max",
        description: "The most advanced iPhone ever with titanium design, A17 Pro chip, and 48MP camera system.",
        descriptionNp: "टाइटेनियम डिजाइन, A17 प्रो चिप, र 48MP क्यामेरा सिस्टमको साथ सबैभन्दा उन्नत आईफोन।",
        price: 179999,
        discountPrice: 169999,
        images: [
          "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400",
          "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"
        ],
        category: "smartphones",
        brand: "Apple",
        inStock: true,
        stockQuantity: 50,
        specifications: {
          storage: "256GB",
          ram: "8GB",
          processor: "A17 Pro",
          display: "6.7-inch Super Retina XDR",
          camera: "48MP Triple Camera",
          battery: "4422mAh",
          os: "iOS 17"
        },
        rating: 4.8,
        reviewCount: 245,
        tags: ["smartphone", "apple", "premium", "5g"],
        isNew: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'prod-2',
        title: "Samsung Galaxy S24 Ultra",
        titleNp: "सामसुङ ग्यालेक्सी S24 अल्ट्रा",
        slug: "samsung-galaxy-s24-ultra",
        description: "Galaxy AI meets premium performance with 200MP camera and S Pen functionality.",
        descriptionNp: "200MP क्यामेरा र S Pen कार्यक्षमताको साथ Galaxy AI ले प्रिमियम प्रदर्शनलाई भेट्छ।",
        price: 159999,
        discountPrice: 149999,
        images: [
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400"
        ],
        category: "smartphones",
        brand: "Samsung",
        inStock: true,
        stockQuantity: 35,
        specifications: {
          storage: "256GB",
          ram: "12GB",
          processor: "Snapdragon 8 Gen 3",
          display: "6.8-inch Dynamic AMOLED 2X",
          camera: "200MP Quad Camera",
          battery: "5000mAh",
          os: "Android 14"
        },
        rating: 4.7,
        reviewCount: 198,
        tags: ["smartphone", "samsung", "android", "5g"],
        isNew: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'prod-3',
        title: "MacBook Pro 16-inch M3",
        titleNp: "म्याकबुक प्रो १६-इन्च M3",
        slug: "macbook-pro-16-m3",
        description: "Supercharged by M3 Pro or M3 Max chip for extreme performance and up to 22 hours of battery life.",
        descriptionNp: "चरम प्रदर्शन र 22 घण्टासम्म ब्याट्री जीवनको लागि M3 Pro वा M3 Max चिपले सुपरचार्ज गरिएको।",
        price: 299999,
        discountPrice: 279999,
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
        ],
        category: "laptops",
        brand: "Apple",
        inStock: true,
        stockQuantity: 15,
        specifications: {
          storage: "512GB SSD",
          ram: "18GB",
          processor: "Apple M3 Pro",
          display: "16.2-inch Liquid Retina XDR",
          graphics: "12-core GPU",
          ports: "3x Thunderbolt 4, HDMI, SDXC",
          weight: "2.16 kg"
        },
        rating: 4.9,
        reviewCount: 156,
        tags: ["laptop", "apple", "professional", "creative"],
        isNew: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Add sample categories
  if (inMemoryData.categories.length === 0) {
    inMemoryData.categories = [
      {
        _id: 'cat-1',
        name: "Smartphones",
        nameNp: "स्मार्टफोन",
        slug: "smartphones",
        description: "Latest smartphones from top brands",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'cat-2',
        name: "Laptops",
        nameNp: "ल्यापटप",
        slug: "laptops",
        description: "High-performance laptops for work and gaming",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'cat-3',
        name: "Audio",
        nameNp: "अडियो",
        slug: "audio",
        description: "Premium headphones and speakers",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
};

export const setMongoConnection = (connected) => {
  isMongoConnected = connected;
  if (!connected) {
    initializeInMemoryData();
  }
};

// User operations
export const userDB = {
  async findOne(query) {
    if (isMongoConnected) {
      return await User.findOne(query);
    } else {
      return inMemoryData.users.find(user => {
        return Object.keys(query).every(key => user[key] === query[key]);
      });
    }
  },

  async findById(id) {
    if (isMongoConnected) {
      return await User.findById(id);
    } else {
      return inMemoryData.users.find(user => user._id === id);
    }
  },

  async create(userData) {
    if (isMongoConnected) {
      const user = new User(userData);
      return await user.save();
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = {
        _id: Date.now().toString(),
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryData.users.push(user);
      return user;
    }
  },

  async save(user) {
    if (isMongoConnected) {
      return await user.save();
    } else {
      const index = inMemoryData.users.findIndex(u => u._id === user._id);
      if (index !== -1) {
        inMemoryData.users[index] = { ...user, updatedAt: new Date() };
        return inMemoryData.users[index];
      }
      return user;
    }
  }
};

// Admin operations
export const adminDB = {
  async findOne(query) {
    if (isMongoConnected) {
      return await Admin.findOne(query);
    } else {
      return inMemoryData.admins.find(admin => {
        return Object.keys(query).every(key => admin[key] === query[key]);
      });
    }
  }
};

// Product operations
export const productDB = {
  async find(query = {}) {
    if (isMongoConnected) {
      return await Product.find(query);
    } else {
      if (Object.keys(query).length === 0) {
        return inMemoryData.products;
      }
      return inMemoryData.products.filter(product => {
        return Object.keys(query).every(key => product[key] === query[key]);
      });
    }
  },

  async findById(id) {
    if (isMongoConnected) {
      return await Product.findById(id);
    } else {
      return inMemoryData.products.find(product => product._id === id);
    }
  }
};

// Category operations
export const categoryDB = {
  async find(query = {}) {
    if (isMongoConnected) {
      return await Category.find(query);
    } else {
      return inMemoryData.categories;
    }
  }
};