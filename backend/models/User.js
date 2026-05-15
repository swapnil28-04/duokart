const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'both'],
    default: 'customer',
  },
  businessInfo: {
    isBusinessAccount: { type: Boolean, default: false },
    businessName: String,
    gstNumber: String,
    businessType: String,
  },
  sellerInfo: {
    sellerType: {
      type: String,
      enum: ['street', 'small', 'wholesaler', 'distributor', null],
      default: null,
    },
    shopName: String,
    location: String,
    phone: String,
  },
  preferredMode: {
    type: String,
    enum: ['b2b', 'b2c'],
    default: 'b2c',
  },
}, { timestamps: true });

// Hash password BEFORE saving — using the modern async/await syntax
userSchema.pre('save', async function () {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);