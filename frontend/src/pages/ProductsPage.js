import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';
import { productAPI } from '../api/services';
import { FiShoppingCart, FiStar, FiMapPin, FiPackage, FiSearch } from 'react-icons/fi';

const ProductsPage = () => {
  const { mode, selectMode } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // If user hasn't selected mode, send them back to landing
  useEffect(() => {
    if (!mode) navigate('/');
  }, [mode, navigate]);

  // Fetch real products from backend whenever category or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const filters = {};
        if (selectedCategory !== 'all') filters.category = selectedCategory;
        if (searchQuery) filters.search = searchQuery;

        const { data } = await productAPI.getAll(filters);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  if (!mode) return null;

  const filteredProducts = products;

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product._id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  // Switch mode quickly
  const switchMode = () => {
    selectMode(mode === 'b2b' ? 'b2c' : 'b2b');
  };

  // Pick price based on mode
  const getPrice = (product) =>
    mode === 'b2b' ? product.wholesalePrice : product.retailPrice;

  // Calculate savings vs retail price (only shown in B2B mode)
  const getSavings = (product) => {
    const saved = product.retailPrice - product.wholesalePrice;
    const percent = Math.round((saved / product.retailPrice) * 100);
    return { saved, percent };
  };

  const sellerTypeLabel = {
    street: '🛺 Street Vendor',
    small: '🏠 Home Business',
    wholesaler: '🏭 Wholesaler',
    distributor: '📦 Distributor',
  };

  return (
    <div style={styles.page}>

      {/* Mode Banner — shows current mode prominently */}
      <div style={{
        ...styles.modeBanner,
        background: mode === 'b2b'
          ? 'linear-gradient(135deg, #2563EB 0%, #1e40af 100%)'
          : 'linear-gradient(135deg, #FF6B35 0%, #ff8c42 100%)',
      }}>
        <div style={styles.modeBannerLeft}>
          <span style={styles.modeBannerLabel}>You're shopping in</span>
          <strong style={styles.modeBannerMode}>
            {mode === 'b2b' ? '💼 Business Mode (B2B)' : '🛍️ Customer Mode (B2C)'}
          </strong>
          <span style={styles.modeBannerHint}>
            {mode === 'b2b'
              ? 'Wholesale prices • Bulk minimums apply'
              : 'Retail prices • Buy any quantity'}
          </span>
        </div>
        <button onClick={switchMode} style={styles.switchBtn}>
          Switch to {mode === 'b2b' ? 'B2C' : 'B2B'} →
        </button>
      </div>

      {/* Search Bar */}
      <div style={styles.searchSection}>
        <div style={styles.searchBox}>
          <FiSearch size={18} color="#999" />
          <input
            type="text"
            placeholder="Search products, sellers, or anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              ...styles.catBtn,
              background: selectedCategory === cat.id
                ? (mode === 'b2b' ? '#2563EB' : '#FF6B35')
                : '#fff',
              color: selectedCategory === cat.id ? '#fff' : '#555',
              borderColor: selectedCategory === cat.id
                ? (mode === 'b2b' ? '#2563EB' : '#FF6B35')
                : '#e5e7eb',
            }}
          >
            <span>{cat.emoji}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div style={styles.resultsBar}>
        <span style={styles.resultsCount}>
          <strong>{filteredProducts.length}</strong> products found
        </span>
        <span style={styles.resultsHint}>
          Showing {mode === 'b2b' ? 'wholesale' : 'retail'} prices
        </span>
      </div>

      {/* Products Grid */}
      <div style={styles.productsGrid}>
        {loadingProducts ? (
          <div style={styles.noResults}>
            <p style={{ fontSize: 48 }}>⏳</p>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.noResults}>
            <p style={{ fontSize: 48 }}>📦</p>
            <p>No products yet! Sellers, list yours now!</p>
          </div>
        ) : (
          filteredProducts.map(product => {
            const price = getPrice(product);
            const savings = getSavings(product);
            const isAdded = addedItem === product._id;

            return (
              <div key={product._id} style={styles.productCard}>

                {/* Product Image */}
                <div style={styles.imageBox}>
                  <img src={product.image} alt={product.name} style={styles.image} />
                  {/* Seller type badge */}
                  <div style={styles.sellerTypeBadge}>
                    {sellerTypeLabel[product.sellerType]}
                  </div>
                  {/* Savings badge — only in B2B mode */}
                  {mode === 'b2b' && (
                    <div style={styles.savingsBadge}>
                      Save {savings.percent}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.name}</h3>

                  {/* Seller */}
                  <div style={styles.sellerRow}>
                    <span style={styles.sellerName}>{product.sellerName}</span>
                    <span style={styles.rating}>
                      <FiStar size={12} fill="#FFB800" color="#FFB800" />
                      {product.rating}
                    </span>
                  </div>

                  {/* Location */}
                  <div style={styles.locationRow}>
                    <FiMapPin size={11} />
                    <span>{product.location}</span>
                  </div>

                  {/* Price Display */}
                  <div style={styles.priceSection}>
                    <div style={styles.priceRow}>
                      <strong style={{
                        ...styles.price,
                        color: mode === 'b2b' ? '#2563EB' : '#FF6B35'
                      }}>
                        ₹{price}
                      </strong>
                      <span style={styles.unit}>{product.unit}</span>
                    </div>

                    {/* Show retail price crossed out in B2B mode */}
                    {mode === 'b2b' && (
                      <div style={styles.b2bExtras}>
                        <span style={styles.crossedPrice}>
                          MRP ₹{product.retailPrice}
                        </span>
                        <span style={styles.minOrder}>
                          <FiPackage size={11} /> Min order: {product.minOrderB2B} units
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={{
                      ...styles.addBtn,
                      background: isAdded
                        ? '#10B981'
                        : (mode === 'b2b' ? '#2563EB' : '#FF6B35'),
                    }}
                  >
                    {isAdded ? (
                      <>✓ Added!</>
                    ) : (
                      <>
                        <FiShoppingCart size={14} /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f9fafb', paddingBottom: 60 },

  modeBanner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 40px', color: '#fff', flexWrap: 'wrap', gap: 16,
  },
  modeBannerLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
  modeBannerLabel: { fontSize: 12, opacity: 0.85, fontWeight: 500 },
  modeBannerMode: { fontSize: 20, fontWeight: 800 },
  modeBannerHint: { fontSize: 13, opacity: 0.9, marginTop: 2 },
  switchBtn: {
    background: 'rgba(255,255,255,0.2)', color: '#fff',
    padding: '10px 20px', borderRadius: 25,
    fontWeight: 600, fontSize: 14,
    border: '1px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
  },

  searchSection: { padding: '24px 40px 12px' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: 12, padding: '12px 18px', maxWidth: 600,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none',
    fontSize: 14, fontFamily: 'inherit',
  },

  categories: {
    display: 'flex', flexWrap: 'wrap', gap: 10,
    padding: '12px 40px',
  },
  catBtn: {
    padding: '8px 16px', border: '1px solid',
    borderRadius: 25, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', gap: 6, transition: 'all 0.2s',
  },

  resultsBar: {
    display: 'flex', justifyContent: 'space-between',
    padding: '16px 40px', alignItems: 'center', flexWrap: 'wrap', gap: 8,
  },
  resultsCount: { fontSize: 14, color: '#555' },
  resultsHint: { fontSize: 12, color: '#888', fontStyle: 'italic' },

  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
    padding: '0 40px',
  },

  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: 60,
    color: '#888',
  },

  productCard: {
    background: '#fff', borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex', flexDirection: 'column',
  },

  imageBox: {
    position: 'relative', height: 180, overflow: 'hidden',
    background: '#f3f4f6',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  sellerTypeBadge: {
    position: 'absolute', top: 10, left: 10,
    background: 'rgba(255,255,255,0.95)',
    padding: '4px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600, color: '#333',
  },
  savingsBadge: {
    position: 'absolute', top: 10, right: 10,
    background: '#10B981', color: '#fff',
    padding: '4px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 700,
  },

  productInfo: {
    padding: 16, display: 'flex',
    flexDirection: 'column', gap: 8, flex: 1,
  },
  productName: {
    fontSize: 15, fontWeight: 700, color: '#1a1a1a',
    margin: 0, lineHeight: 1.3,
  },
  sellerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  sellerName: { fontSize: 12, color: '#666', fontWeight: 500 },
  rating: {
    display: 'flex', alignItems: 'center', gap: 3,
    fontSize: 12, color: '#666', fontWeight: 600,
  },
  locationRow: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 11, color: '#999',
  },

  priceSection: { marginTop: 'auto', paddingTop: 8 },
  priceRow: {
    display: 'flex', alignItems: 'baseline', gap: 6,
  },
  price: { fontSize: 22, fontWeight: 800 },
  unit: { fontSize: 11, color: '#888' },
  b2bExtras: {
    display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4,
  },
  crossedPrice: {
    fontSize: 11, color: '#999', textDecoration: 'line-through',
  },
  minOrder: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 11, color: '#666', fontWeight: 500,
  },

  addBtn: {
    width: '100%', padding: '10px',
    color: '#fff', borderRadius: 10,
    fontWeight: 700, fontSize: 13,
    cursor: 'pointer', border: 'none', marginTop: 10,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    transition: 'background 0.2s',
  },
};

export default ProductsPage;