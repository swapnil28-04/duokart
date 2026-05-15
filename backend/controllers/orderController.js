const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST /api/orders
// @desc    Place a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, orderType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Calculate prices on backend (NEVER trust frontend prices for security!)
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      // Pick the right price based on order type
      const price = orderType === 'b2b' ? product.wholesalePrice : product.retailPrice;

      // For B2B, check minimum order qty
      if (orderType === 'b2b' && item.quantity < product.minOrderB2B) {
        return res.status(400).json({
          message: `Min order for ${product.name} is ${product.minOrderB2B} units`
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} available`
        });
      }

      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        pricePerUnit: price,
        sellerId: product.seller,
        sellerName: product.sellerName,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // 18% GST for B2B orders
    const gstAmount = orderType === 'b2b' ? Math.round(totalAmount * 0.18) : 0;

    const order = await Order.create({
      user: req.user._id,
      orderType,
      items: orderItems,
      shippingAddress,
      totalAmount: totalAmount + gstAmount,
      gstAmount,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/my-orders
// @desc    Get all orders of current user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only the user who placed it can view (or admin in future)
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/seller/orders
// @desc    Get orders for products this seller sells
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.sellerId': req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};