import { Product, Category } from '../types';

export const featuredProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro',
    titleNp: 'आईफोन १५ प्रो',
    slug: 'iphone-15-pro',
    description: 'The latest iPhone with A17 Pro chip, 48MP camera system, and titanium design.',
    descriptionNp: 'नवीनतम A17 प्रो चिप, 48MP क्यामेरा सिस्टम, र टाइटेनियम डिजाइन भएको नवीनतम आईफोन।',
    price: 175000,
    discountPrice: 169999,
    images: [
      'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'smartphones',
    brand: 'Apple',
    inStock: true,
    stockQuantity: 15,
    specifications: {
      display: '6.1-inch Super Retina XDR',
      processor: 'A17 Pro chip',
      camera: '48MP main camera',
      storage: '256GB',
      battery: 'Up to 23 hours'
    },
    rating: 4.8,
    reviewCount: 156,
    tags: ['apple', 'iphone', 'premium'],
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Samsung Galaxy S23 Ultra',
    titleNp: 'स्यामसङ ग्यालेक्सी एस२३ अल्ट्रा',
    slug: 'samsung-galaxy-s23-ultra',
    description: 'Experience groundbreaking zoom with 200MP camera and S Pen functionality.',
    descriptionNp: '200MP क्यामेरा र S पेन कार्यक्षमता भएको अत्याधुनिक ज़ूम अनुभव गर्नुहोस्।',
    price: 165000,
    discountPrice: 158000,
    images: [
      'https://images.pexels.com/photos/4071887/pexels-photo-4071887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/11772533/pexels-photo-11772533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'smartphones',
    brand: 'Samsung',
    inStock: true,
    stockQuantity: 20,
    specifications: {
      display: '6.8-inch Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 2',
      camera: '200MP main camera',
      storage: '256GB',
      battery: '5000mAh'
    },
    rating: 4.7,
    reviewCount: 142,
    tags: ['samsung', 'galaxy', 'premium'],
    isFeatured: true
  },
  {
    id: '3',
    title: 'MacBook Air M2',
    titleNp: 'म्याकबुक एयर एम२',
    slug: 'macbook-air-m2',
    description: 'Redesigned with the powerful M2 chip for incredible performance and battery life.',
    descriptionNp: 'अविश्वसनीय प्रदर्शन र ब्याट्री लाइफको लागि शक्तिशाली M2 चिपको साथ पुन: डिजाइन।',
    price: 190000,
    images: [
      'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/4260477/pexels-photo-4260477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'laptops',
    brand: 'Apple',
    inStock: true,
    stockQuantity: 8,
    specifications: {
      display: '13.6-inch Liquid Retina',
      processor: 'Apple M2 chip',
      ram: '8GB unified memory',
      storage: '256GB SSD',
      battery: 'Up to 18 hours'
    },
    rating: 4.9,
    reviewCount: 87,
    tags: ['apple', 'macbook', 'laptop'],
    isFeatured: true
  },
  {
    id: '4',
    title: 'Sony WH-1000XM5',
    titleNp: 'सोनी WH-१०००XM५',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation with exceptional sound quality.',
    descriptionNp: 'उत्कृष्ट साउन्ड गुणस्तरको साथ उद्योग-अग्रणी नोइज क्यान्सलेसन।',
    price: 65000,
    discountPrice: 59999,
    images: [
      'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'headphones',
    brand: 'Sony',
    inStock: true,
    stockQuantity: 25,
    specifications: {
      type: 'Over-ear wireless headphones',
      noiseCancellation: 'Industry-leading',
      battery: 'Up to 30 hours',
      connectivity: 'Bluetooth 5.2, 3.5mm',
      charging: 'USB-C'
    },
    rating: 4.8,
    reviewCount: 104,
    tags: ['sony', 'headphones', 'premium'],
    isFeatured: true
  },
  {
    id: '5',
    title: 'Dell XPS 15',
    titleNp: 'डेल XPS १५',
    slug: 'dell-xps-15',
    description: 'Premium ultrabook with InfinityEdge display and powerful performance.',
    descriptionNp: 'इन्फिनिटी एज डिस्प्ले र शक्तिशाली प्रदर्शन भएको प्रिमियम अल्ट्राबुक।',
    price: 225000,
    discountPrice: 210000,
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'laptops',
    brand: 'Dell',
    inStock: true,
    stockQuantity: 5,
    specifications: {
      display: '15.6-inch 4K OLED',
      processor: 'Intel Core i7-12700H',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      graphics: 'NVIDIA RTX 3050 Ti'
    },
    rating: 4.7,
    reviewCount: 63,
    tags: ['dell', 'xps', 'premium'],
    isNew: true,
    isFeatured: true
  },
  {
    id: '6',
    title: 'Apple AirPods Pro 2',
    titleNp: 'एप्पल एयरपड्स प्रो २',
    slug: 'apple-airpods-pro-2',
    description: 'Active Noise Cancellation, Transparency mode, and personalized Spatial Audio.',
    descriptionNp: 'एक्टिभ नोइज क्यान्सलेसन, ट्रान्सपेरेन्सी मोड, र व्यक्तिगत स्पेशल अडियो।',
    price: 42000,
    discountPrice: 38999,
    images: [
      'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'headphones',
    brand: 'Apple',
    inStock: true,
    stockQuantity: 30,
    specifications: {
      type: 'True wireless earbuds',
      noiseCancellation: 'Active Noise Cancellation',
      battery: 'Up to 6 hours (30 hours with case)',
      connectivity: 'Bluetooth 5.3',
      charging: 'USB-C, Wireless'
    },
    rating: 4.8,
    reviewCount: 218,
    tags: ['apple', 'airpods', 'wireless'],
    isFeatured: true
  }
];

export const newArrivals: Product[] = [
  {
    id: '7',
    title: 'Nothing Phone (2)',
    titleNp: 'नथिङ्ग फोन (२)',
    slug: 'nothing-phone-2',
    description: 'Innovative smartphone with Glyph Interface and clean Android experience.',
    descriptionNp: 'ग्लिफ इन्टरफेस र क्लिन एन्ड्रोइड अनुभव भएको अभिनव स्मार्टफोन।',
    price: 85000,
    discountPrice: 79999,
    images: [
      'https://images.pexels.com/photos/13952297/pexels-photo-13952297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/14041926/pexels-photo-14041926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'smartphones',
    brand: 'Nothing',
    inStock: true,
    stockQuantity: 12,
    specifications: {
      display: '6.7-inch OLED',
      processor: 'Snapdragon 8+ Gen 1',
      camera: '50MP main camera',
      storage: '128GB',
      battery: '4700mAh'
    },
    rating: 4.5,
    reviewCount: 42,
    tags: ['nothing', 'android', 'unique'],
    isNew: true
  },
  {
    id: '8',
    title: 'ASUS ROG Zephyrus G14',
    titleNp: 'एसस ROG जेफिरस G१४',
    slug: 'asus-rog-zephyrus-g14',
    description: 'Powerful gaming laptop with AMD Ryzen 9 and NVIDIA RTX graphics.',
    descriptionNp: 'AMD Ryzen 9 र NVIDIA RTX ग्राफिक्स भएको शक्तिशाली गेमिंग ल्यापटप।',
    price: 250000,
    discountPrice: 235000,
    images: [
      'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'laptops',
    brand: 'ASUS',
    inStock: true,
    stockQuantity: 8,
    specifications: {
      display: '14-inch QHD 165Hz',
      processor: 'AMD Ryzen 9 7940HS',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      graphics: 'NVIDIA RTX 4060'
    },
    rating: 4.9,
    reviewCount: 24,
    tags: ['asus', 'gaming', 'laptop'],
    isNew: true
  }
];

export const bestSellers: Product[] = [
  {
    id: '9',
    title: 'Redmi Note 13 Pro',
    titleNp: 'रेडमी नोट १३ प्रो',
    slug: 'redmi-note-13-pro',
    description: 'Affordable yet powerful smartphone with excellent camera capabilities.',
    descriptionNp: 'उत्कृष्ट क्यामेरा क्षमताहरू भएको सस्तो तर शक्तिशाली स्मार्टफोन।',
    price: 45000,
    discountPrice: 42999,
    images: [
      'https://images.pexels.com/photos/3662828/pexels-photo-3662828.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3945673/pexels-photo-3945673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'smartphones',
    brand: 'Xiaomi',
    inStock: true,
    stockQuantity: 45,
    specifications: {
      display: '6.67-inch AMOLED 120Hz',
      processor: 'Snapdragon 7s Gen 2',
      camera: '200MP main camera',
      storage: '128GB',
      battery: '5000mAh'
    },
    rating: 4.6,
    reviewCount: 347,
    tags: ['xiaomi', 'redmi', 'budget']
  },
  {
    id: '10',
    title: 'Acer Nitro 5',
    titleNp: 'एसर निट्रो ५',
    slug: 'acer-nitro-5',
    description: 'Mid-range gaming laptop with excellent performance-to-price ratio.',
    descriptionNp: 'उत्कृष्ट प्रदर्शन-मूल्य अनुपात भएको मध्यम स्तरको गेमिंग ल्यापटप।',
    price: 135000,
    discountPrice: 129000,
    images: [
      'https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'laptops',
    brand: 'Acer',
    inStock: true,
    stockQuantity: 15,
    specifications: {
      display: '15.6-inch FHD 144Hz',
      processor: 'Intel Core i5-12500H',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      graphics: 'NVIDIA RTX 3050'
    },
    rating: 4.5,
    reviewCount: 215,
    tags: ['acer', 'gaming', 'laptop', 'budget']
  }
];

export const allProducts: Product[] = [
  ...featuredProducts,
  ...newArrivals, 
  ...bestSellers
];