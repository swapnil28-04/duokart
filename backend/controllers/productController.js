const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products (with optional filters)
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sellerType } = req.query;

    let filter = {};
    if (category && category !== 'all') filter.category = category;
    if (sellerType) filter.sellerType = sellerType;
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/products
// @desc    Create a product (sellers only)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      seller: req.user._id,
      sellerName: req.user.sellerInfo?.shopName || req.user.name,
      sellerType: req.user.sellerInfo?.sellerType || 'small',
      location: req.user.sellerInfo?.location || '',
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/products/:id
// @desc    Update product (only by owner seller)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Make sure only the seller who created it can edit
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/products/seller/my-products
// @desc    Get all products of current logged-in seller
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};