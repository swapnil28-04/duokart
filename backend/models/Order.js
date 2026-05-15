const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Who placed the order?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Was it B2B or B2C? (different prices, different rules)
  orderType: {
    type: String,
    enum: ['b2b', 'b2c'],
    required: true,
  },
  // List of items in this order
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      quantity: Number,
      pricePerUnit: Number, // The price at the time of order
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sellerName: String,
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  // Only for B2B
  gstAmount: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'upi', 'card', 'net_terms'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'placed',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);