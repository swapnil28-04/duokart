const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'groceries', 'fashion', 'electronics', 'supplies', 'other'],
  },
  // Two prices — the heart of DuoKart!
  retailPrice: {
    type: Number,
    required: [true, 'Retail price is required'],
    min: 0,
  },
  wholesalePrice: {
    type: Number,
    required: [true, 'Wholesale price is required'],
    min: 0,
  },
  unit: {
    type: String,
    default: 'piece',
  },
  // Minimum order qty for B2B buyers
  minOrderB2B: {
    type: Number,
    default: 10,
  },
  // Stock management
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x400?text=No+Image',
  },
  // Who is selling this?
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerName: String,
  sellerType: {
    type: String,
    enum: ['street', 'small', 'wholesaler', 'distributor'],
    default: 'small',
  },
  location: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);