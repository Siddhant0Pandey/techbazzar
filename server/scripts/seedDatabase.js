import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config();

const products = [
  {
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
    isFeatured: true
  },
  {
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
    isFeatured: true
  },
  {
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
    isFeatured: true
  },
  {
    title: "Dell XPS 13 Plus",
    titleNp: "डेल XPS 13 प्लस",
    slug: "dell-xps-13-plus",
    description: "Ultra-thin laptop with 13th Gen Intel processors and stunning InfinityEdge display.",
    descriptionNp: "13th Gen Intel प्रोसेसर र आकर्षक InfinityEdge डिस्प्लेको साथ अल्ट्रा-पातलो ल्यापटप।",
    price: 149999,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400"
    ],
    category: "laptops",
    brand: "Dell",
    inStock: true,
    stockQuantity: 25,
    specifications: {
      storage: "512GB SSD",
      ram: "16GB",
      processor: "Intel Core i7-1360P",
      display: "13.4-inch OLED TouchScreen",
      graphics: "Intel Iris Xe",
      ports: "2x Thunderbolt 4",
      weight: "1.24 kg"
    },
    rating: 4.6,
    reviewCount: 123,
    tags: ["laptop", "dell", "ultrabook", "touchscreen"],
    isFeatured: true
  },
  {
    title: "Sony WH-1000XM5",
    titleNp: "सोनी WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery.",
    descriptionNp: "असाधारण ध्वनि गुणस्तर र 30-घण्टा ब्याट्रीको साथ उद्योग-अग्रणी आवाज रद्द गर्ने हेडफोनहरू।",
    price: 42999,
    discountPrice: 38999,
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
    ],
    category: "audio",
    brand: "Sony",
    inStock: true,
    stockQuantity: 40,
    specifications: {
      type: "Over-ear Wireless",
      driver: "30mm",
      frequency: "4Hz-40kHz",
      battery: "30 hours",
      charging: "USB-C Quick Charge",
      weight: "250g",
      connectivity: "Bluetooth 5.2, NFC"
    },
    rating: 4.8,
    reviewCount: 342,
    tags: ["headphones", "sony", "wireless", "noise-canceling"],
    isFeatured: true
  }
];

const categories = [
  {
    name: "Smartphones",
    nameNp: "स्मार्टफोन",
    slug: "smartphones",
    description: "Latest smartphones from top brands",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
  },
  {
    name: "Laptops",
    nameNp: "ल्यापटप",
    slug: "laptops",
    description: "High-performance laptops for work and gaming",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
  },
  {
    name: "Audio",
    nameNp: "अडियो",
    slug: "audio",
    description: "Premium headphones and speakers",
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
  },
  {
    name: "Gaming",
    nameNp: "गेमिङ",
    slug: "gaming",
    description: "Gaming consoles and accessories",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400"
  },
  {
    name: "Accessories",
    nameNp: "सामग्री",
    slug: "accessories",
    description: "Tech accessories and gadgets",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400"
  }
];

const admins = [
  {
    name: "Super Admin",
    email: "admin@techbazaar.com",
    password: "admin123",
    role: "super_admin",
    permissions: ["all"]
  },
  {
    name: "Store Manager",
    email: "manager@techbazaar.com",
    password: "manager123",
    role: "admin",
    permissions: ["products", "orders", "users", "analytics"]
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techbazaar');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Admin.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed categories
    console.log('📂 Seeding categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed products
    console.log('📱 Seeding products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Seed admin users
    console.log('👨‍💼 Seeding admin users...');
    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 12);
      await Admin.create({
        ...admin,
        password: hashedPassword
      });
    }
    console.log(`✅ Created ${admins.length} admin users`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Categories: ${createdCategories.length}`);
    console.log(`   • Products: ${createdProducts.length}`);
    console.log(`   • Admin Users: ${admins.length}`);
    console.log('\n🔐 Admin Login Credentials:');
    console.log('   • Email: admin@techbazaar.com');
    console.log('   • Password: admin123');
    console.log('\n🏪 Your TechBazaar database is ready for use!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;