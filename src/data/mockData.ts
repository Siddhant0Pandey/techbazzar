import { Product, Category } from '../types';

export const featuredProducts: Product[] = [
  {
    id: '1',
    title: 'Professional Circular Saw',
    titleNp: 'व्यावसायिक गोलाकार आरा',
    slug: 'professional-circular-saw',
    description: 'High-precision 7.25" circular saw with laser guide, perfect for furniture making and carpentry projects.',
    descriptionNp: 'फर्निचर निर्माण र बढईगिरीका लागि उत्तम लेजर गाइड भएको उच्च-सटिक ७.२५" गोलाकार आरा।',
    price: 15000,
    discountPrice: 12999,
    images: [
      'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/162553/tools-saw-blade-workshop-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'power-tools',
    brand: 'DeWalt',
    inStock: true,
    stockQuantity: 15,
    specifications: {
      'blade-size': '7.25 inches',
      'motor-power': '15 Amp',
      'cutting-depth': '2-9/16 inches',
      'weight': '8.8 lbs',
      'features': 'Laser guide, dust port'
    },
    rating: 4.8,
    reviewCount: 156,
    tags: ['dewalt', 'circular-saw', 'power-tools'],
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Premium Chisel Set',
    titleNp: 'प्रिमियम छेनी सेट',
    slug: 'premium-chisel-set',
    description: 'Professional 6-piece wood chisel set with ergonomic handles, ideal for detailed woodworking.',
    descriptionNp: 'विस्तृत काठको काममा आदर्श एर्गोनोमिक ह्यान्डल भएको व्यावसायिक ६-टुक्रा काठको छेनी सेट।',
    price: 8500,
    discountPrice: 7200,
    images: [
      'https://images.pexels.com/photos/5974028/pexels-photo-5974028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'hand-tools',
    brand: 'Stanley',
    inStock: true,
    stockQuantity: 20,
    specifications: {
      'blade-size': '7.25 inches',
      'motor-power': '15 Amp',
      'cutting-depth': '2-9/16 inches',
      'weight': '8.8 lbs',
      'features': 'Laser guide, dust port'
    },
    rating: 4.8,
    reviewCount: 156,
    tags: ['dewalt', 'circular-saw', 'power-tools'],
    isNew: true,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Cordless Drill Driver Kit',
    titleNp: 'कर्डलेस ड्रिल ड्राइभर किट',
    slug: 'cordless-drill-driver-kit',
    description: '20V MAX cordless drill with 2 batteries, charger, and carrying case. Perfect for furniture assembly.',
    descriptionNp: '२ ब्याट्री, चार्जर र क्यारींग केस सहित २०V MAX कर्डलेस ड्रिल। फर्निचर एसेम्बलीका लागि उत्तम।',
    price: 12000,
    discountPrice: 10500,
    images: [
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1251176/pexels-photo-1251176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'power-tools',
    brand: 'Makita',
    inStock: true,
    stockQuantity: 12,
    specifications: {
      voltage: '20V MAX',
      'battery-capacity': '2.0Ah',
      'max-torque': '380 in-lbs',
      'chuck-size': '1/2 inch',
      'weight': '3.4 lbs'
    },
    rating: 4.7,
    reviewCount: 89,
    tags: ['makita', 'cordless-drill', 'power-tools'],
    isNew: false,
    isFeatured: true
  },
  {
    id: '4',
    title: 'Solid Oak Dining Table',
    titleNp: 'ठोस ओक खाना खाने टेबल',
    slug: 'solid-oak-dining-table',
    description: 'Handcrafted solid oak dining table seats 6 people, featuring traditional joinery techniques.',
    descriptionNp: 'परम्परागत जोइनरी प्रविधिको प्रयोग गरेर ६ जनालाई बस्न मिल्ने हस्तशिल्प ठोस ओक खाना खाने टेबल।',
    price: 45000,
    discountPrice: 38000,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/2451264/pexels-photo-2451264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'furniture',
    brand: 'CraftWorks',
    inStock: true,
    stockQuantity: 5,
    specifications: {
      material: 'Solid Oak Wood',
      dimensions: '72" x 36" x 30"',
      finish: 'Natural Oil Finish',
      seating: '6 People',
      weight: '85 lbs'
    },
    rating: 4.9,
    reviewCount: 45,
    tags: ['dining-table', 'oak', 'handcrafted'],
    isNew: false,
    isFeatured: true
  },
  {
    id: '5',
    title: 'Router Table with Fence',
    titleNp: 'फेन्स सहित राउटर टेबल',
    slug: 'router-table-with-fence',
    description: 'Professional router table with adjustable fence and dust collection port for precise woodworking.',
    descriptionNp: 'सटिक काठको कामका लागि समायोज्य फेन्स र धुलो संकलन पोर्ट भएको व्यावसायिक राउटर टेबल।',
    price: 25000,
    discountPrice: 22000,
    images: [
      'https://images.pexels.com/photos/5974028/pexels-photo-5974028.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'workshop-equipment',
    brand: 'Bosch',
    inStock: true,
    stockQuantity: 8,
    specifications: {
      'table-size': '27" x 18"',
      'fence-length': '32 inches',
      'router-compatibility': 'Universal',
      'dust-port': '2.5 inch',
      'weight': '45 lbs'
    },
    rating: 4.6,
    reviewCount: 73,
    tags: ['router-table', 'bosch', 'workshop'],
    isNew: true,
    isFeatured: false
  }
];

export const categories: Category[] = [
  {
    id: 'power-tools',
    name: 'Power Tools',
    nameNp: 'पावर उपकरणहरू',
    description: 'Electric and cordless power tools for woodworking and construction',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1'
  },
  {
    id: 'hand-tools',
    name: 'Hand Tools',
    nameNp: 'हात उपकरणहरू',
    description: 'Traditional hand tools for precision woodworking and craftsmanship',
    image: 'https://images.pexels.com/photos/5974028/pexels-photo-5974028.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    nameNp: 'फर्निचर',
    description: 'Handcrafted solid wood furniture for home and office',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1'
  },
  {
    id: 'workshop-equipment',
    name: 'Workshop Equipment',
    nameNp: 'कार्यशाला उपकरणहरू',
    description: 'Professional workshop equipment and workbenches',
    image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1'
  },
  {
    id: 'wood-materials',
    name: 'Wood Materials',
    nameNp: 'काठका सामग्रीहरू',
    description: 'Quality lumber, plywood, and wood finishing materials',
    image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1'
  },
  {
    id: 'safety-equipment',
    name: 'Safety Equipment',
    nameNp: 'सुरक्षा उपकरणहरू',
    description: 'Essential safety gear for workshop and construction work',
    image: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1'
  }
];

export const products: Product[] = [
  ...featuredProducts,
  {
    id: '6',
    title: 'Professional Workbench',
    titleNp: 'व्यावसायिक कार्यबेन्च',
    slug: 'professional-workbench',
    description: 'Heavy-duty workbench with multiple drawers and tool storage compartments.',
    descriptionNp: 'धेरै दराज र उपकरण भण्डारण कम्पार्टमेन्ट भएको भारी-ड्यूटी कार्यबेन्च।',
    price: 35000,
    images: [
      'https://images.pexels.com/photos/162553/tools-saw-blade-workshop-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'workshop-equipment',
    brand: 'CraftWorks',
    inStock: true,
    stockQuantity: 6,
    specifications: {
      dimensions: '60" x 24" x 34"',
      'top-material': 'Solid Maple',
      drawers: '4 Full Extension',
      'weight-capacity': '500 lbs',
      finish: 'Lacquer'
    },
    rating: 4.8,
    reviewCount: 32,
    tags: ['workbench', 'storage', 'workshop']
  },
  {
    id: '7',
    title: 'Hardwood Lumber Pack',
    titleNp: 'कडा काठको लम्बर प्याक',
    slug: 'hardwood-lumber-pack',
    description: 'Mixed hardwood lumber pack perfect for furniture making projects.',
    descriptionNp: 'फर्निचर निर्माण परियोजनाहरूका लागि उत्तम मिश्रित कडा काठको लम्बर प्याक।',
    price: 18000,
    discountPrice: 16000,
    images: [
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'wood-materials',
    brand: 'TimberCraft',
    inStock: true,
    stockQuantity: 25,
    specifications: {
      species: 'Oak, Cherry, Maple',
      thickness: '3/4 inch',
      'board-feet': '20 BF',
      grade: 'Select & Better',
      moisture: 'Kiln Dried 6-8%'
    },
    rating: 4.5,
    reviewCount: 67,
    tags: ['lumber', 'hardwood', 'oak', 'cherry', 'maple']
  },
  {
    id: '8',
    title: 'Safety Glasses and Ear Protection Set',
    titleNp: 'सुरक्षा चश्मा र कान सुरक्षा सेट',
    slug: 'safety-glasses-ear-protection-set',
    description: 'Complete safety set with impact-resistant glasses and noise-reducing ear muffs.',
    descriptionNp: 'प्रभाव-प्रतिरोधी चश्मा र आवाज कम गर्ने कान मफ्स सहित पूर्ण सुरक्षा सेट।',
    price: 2500,
    discountPrice: 2000,
    images: [
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    category: 'safety-equipment',
    brand: '3M',
    inStock: true,
    stockQuantity: 50,
    specifications: {
      'glasses-standard': 'ANSI Z87.1+',
      'ear-protection': 'NRR 25dB',
      'lens-type': 'Anti-fog',
      'frame-material': 'Polycarbonate',
      'headband': 'Adjustable'
    },
    rating: 4.4,
    reviewCount: 124,
    tags: ['safety', '3m', 'protection', 'glasses']
  }
];