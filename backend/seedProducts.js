const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [
  {
    name: 'Fresh Tomatoes', description: 'Farm fresh tomatoes',
    category: 'vegetables', retailPrice: 40, wholesalePrice: 28,
    unit: 'per kg', minOrderB2B: 10, stock: 500,
    image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400',
    sellerName: 'Ramu Sabziwala', sellerType: 'street',
    location: 'Sector 18, Noida', rating: 4.5,
  },
  {
    name: 'Basmati Rice (Premium)', description: 'Premium long grain rice',
    category: 'groceries', retailPrice: 180, wholesalePrice: 120,
    unit: 'per kg', minOrderB2B: 25, stock: 1000,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    sellerName: 'Sharma Wholesale', sellerType: 'wholesaler',
    location: 'Karol Bagh, Delhi', rating: 4.8,
  },
  {
    name: 'Organic Honey', description: 'Pure organic honey 500g',
    category: 'groceries', retailPrice: 350, wholesalePrice: 240,
    unit: 'per 500g jar', minOrderB2B: 12, stock: 200,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    sellerName: 'Beehive Farms', sellerType: 'distributor',
    location: 'Bengaluru, KA', rating: 4.7,
  },
  {
    name: 'Cotton T-Shirts', description: 'Premium cotton t-shirts',
    category: 'fashion', retailPrice: 499, wholesalePrice: 220,
    unit: 'per piece', minOrderB2B: 50, stock: 800,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    sellerName: 'Surat Textiles', sellerType: 'wholesaler',
    location: 'Surat, Gujarat', rating: 4.3,
  },
  {
    name: 'Homemade Pickle', description: 'Aunty made pickle',
    category: 'groceries', retailPrice: 150, wholesalePrice: 100,
    unit: 'per 250g jar', minOrderB2B: 20, stock: 100,
    image: 'https://images.unsplash.com/photo-1589135233689-2bcd71f8df15?w=400',
    sellerName: 'Kavita Aunty Foods', sellerType: 'small',
    location: 'Pune, Maharashtra', rating: 4.9,
  },
  {
    name: 'Alphonso Mangoes', description: 'Premium ratnagiri mangoes',
    category: 'vegetables', retailPrice: 600, wholesalePrice: 380,
    unit: 'per dozen', minOrderB2B: 5, stock: 50,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
    sellerName: 'Konkan Farms', sellerType: 'distributor',
    location: 'Ratnagiri, MH', rating: 4.9,
  },
  {
    name: 'Paper Cups (Disposable)', description: 'Eco-friendly paper cups',
    category: 'supplies', retailPrice: 5, wholesalePrice: 2,
    unit: 'per cup', minOrderB2B: 500, stock: 10000,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    sellerName: 'EcoPack Industries', sellerType: 'wholesaler',
    location: 'Mumbai, MH', rating: 4.4,
  },
  {
    name: 'Steel Water Bottle', description: 'Insulated steel water bottle',
    category: 'electronics', retailPrice: 450, wholesalePrice: 280,
    unit: 'per bottle', minOrderB2B: 20, stock: 300,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    sellerName: 'Milton Direct', sellerType: 'wholesaler',
    location: 'New Delhi', rating: 4.6,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const seller = await User.findOne();
    if (!seller) {
      console.log('❌ No users found! Register a user first via the app.');
      process.exit(1);
    }

    await Product.deleteMany({});
    console.log('🗑️  Cleared old products');

    const productsWithSeller = sampleProducts.map(p => ({
      ...p, seller: seller._id,
    }));

    await Product.insertMany(productsWithSeller);
    console.log(`🎉 Added ${sampleProducts.length} products!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedDB();