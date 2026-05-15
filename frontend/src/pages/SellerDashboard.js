import React, { useState } from 'react';
import { FiPlus, FiPackage, FiTrendingUp, FiDollarSign, FiUsers, FiX, FiCheck } from 'react-icons/fi';

const SellerDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'Fresh Tomatoes', retailPrice: 40, wholesalePrice: 22, stock: 150, sold: 89, image: '🍅' },
    { id: 2, name: 'Onions', retailPrice: 35, wholesalePrice: 20, stock: 80, sold: 56, image: '🧅' },
  ]);

  const [formData, setFormData] = useState({
    name: '', category: 'Vegetables', retailPrice: '',
    wholesalePrice: '', stock: '', minB2BQty: '', image: '📦',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      retailPrice: parseFloat(formData.retailPrice),
      wholesalePrice: parseFloat(formData.wholesalePrice),
      stock: parseInt(formData.stock),
      sold: 0,
      image: formData.image,
    };
    setProducts([...products, newProduct]);
    setFormData({
      name: '', category: 'Vegetables', retailPrice: '',
      wholesalePrice: '', stock: '', minB2BQty: '', image: '📦',
    });
    setShowForm(false);
    alert('✓ Product added successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.retailPrice * p.sold), 0);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Seller Dashboard</h1>
            <p style={styles.subtitle}>
              Whether you run a store or a thela — sell on DuoKart 🛒
            </p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowForm(true)}>
            <FiPlus size={18} /> Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>

          <div style={{ ...styles.statCard, borderTopColor: '#FF6B35' }}>
            <div style={{ ...styles.statIcon, background: '#FFF3EE', color: '#FF6B35' }}>
              <FiPackage size={20} />
            </div>
            <div>
              <div style={styles.statNumber}>{totalProducts}</div>
              <div style={styles.statLabel}>Total Products</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, borderTopColor: '#2563EB' }}>
            <div style={{ ...styles.statIcon, background: '#EFF6FF', color: '#2563EB' }}>
              <FiTrendingUp size={20} />
            </div>
            <div>
              <div style={styles.statNumber}>{totalSold}</div>
              <div style={styles.statLabel}>Items Sold</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, borderTopColor: '#10B981' }}>
            <div style={{ ...styles.statIcon, background: '#D1FAE5', color: '#10B981' }}>
              <FiDollarSign size={20} />
            </div>
            <div>
              <div style={styles.statNumber}>₹{totalRevenue.toLocaleString()}</div>
              <div style={styles.statLabel}>Revenue</div>
            </div>
          </div>

          <div style={{ ...styles.statCard, borderTopColor: '#F59E0B' }}>
            <div style={{ ...styles.statIcon, background: '#FEF3C7', color: '#F59E0B' }}>
              <FiUsers size={20} />
            </div>
            <div>
              <div style={styles.statNumber}>247</div>
              <div style={styles.statLabel}>Total Customers</div>
            </div>
          </div>

        </div>

        {/* Seller Type Banner */}
        <div style={styles.welcomeBanner}>
          <div>
            <h3 style={{ color: '#fff', marginBottom: 4 }}>Welcome, Seller! 👋</h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              Your products are being seen by 10,000+ buyers daily. Keep crushing it!
            </p>
          </div>
          <div style={styles.bannerBadges}>
            <span style={styles.bannerBadge}>✓ Verified Seller</span>
            <span style={styles.bannerBadge}>⭐ 4.7 Rating</span>
          </div>
        </div>

        {/* Products Table */}
        <div style={styles.tableBox}>
          <div style={styles.tableHeader}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Your Products</h2>
            <span style={{ fontSize: 13, color: '#888' }}>
              {products.length} active listings
            </span>
          </div>

          <div style={styles.table}>

            {/* Table Header */}
            <div style={styles.tableRowHeader}>
              <div>Product</div>
              <div>Retail Price</div>
              <div>Wholesale Price</div>
              <div>Stock</div>
              <div>Sold</div>
              <div>Actions</div>
            </div>

            {/* Product Rows */}
            {products.map(product => (
              <div key={product.id} style={styles.tableRow}>
                <div style={styles.productCell}>
                  <span style={{ fontSize: 28 }}>{product.image}</span>
                  <strong>{product.name}</strong>
                </div>
                <div style={styles.priceCell}>₹{product.retailPrice}</div>
                <div style={{ ...styles.priceCell, color: '#2563EB' }}>₹{product.wholesalePrice}</div>
                <div>
                  <span style={{
                    ...styles.stockBadge,
                    background: product.stock > 50 ? '#D1FAE5' : '#FEF3C7',
                    color: product.stock > 50 ? '#065F46' : '#92400E',
                  }}>
                    {product.stock} units
                  </span>
                </div>
                <div style={{ fontWeight: 700, color: '#10B981' }}>{product.sold}</div>
                <div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                No products yet. Click "Add Product" to get started!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add Product Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>Add New Product</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}>
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>

              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input
                  type="text" required
                  placeholder="e.g., Fresh Apples"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={styles.input}
                >
                  <option>Vegetables</option>
                  <option>Grains</option>
                  <option>Clothing</option>
                  <option>Electronics</option>
                  <option>Food</option>
                  <option>Home & Kitchen</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Product Emoji (icon)</label>
                <input
                  type="text"
                  placeholder="🍎"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={styles.input}
                  maxLength={2}
                />
              </div>

              <div style={styles.priceRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Retail Price (B2C) ₹ *</label>
                  <input
                    type="number" required
                    placeholder="40"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Wholesale Price (B2B) ₹ *</label>
                  <input
                    type="number" required
                    placeholder="22"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.priceRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock Quantity *</label>
                  <input
                    type="number" required
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Min B2B Order Qty</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={formData.minB2BQty}
                    onChange={(e) => setFormData({ ...formData, minB2BQty: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitBtn}>
                  <FiCheck /> Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '40px 20px' },
  container: { maxWidth: 1200, margin: '0 auto' },

  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 16,
  },
  title: { fontSize: 32, fontWeight: 900, color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666' },
  addBtn: {
    background: '#FF6B35', color: '#fff',
    padding: '12px 22px', borderRadius: 12, border: 'none',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16, marginBottom: 24,
  },
  statCard: {
    background: '#fff', borderRadius: 14, padding: 20,
    display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    borderTop: '4px solid',
  },
  statIcon: {
    width: 48, height: 48, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  statNumber: { fontSize: 24, fontWeight: 900, color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#888', fontWeight: 500 },

  welcomeBanner: {
    background: 'linear-gradient(135deg, #2C3E50, #1a1a2e)',
    borderRadius: 14, padding: '20px 28px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24,
  },
  bannerBadges: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  bannerBadge: {
    background: 'rgba(255,255,255,0.15)', color: '#fff',
    padding: '6px 14px', borderRadius: 20,
    fontSize: 12, fontWeight: 600,
  },

  tableBox: {
    background: '#fff', borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden',
  },
  tableHeader: {
    padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  table: {},
  tableRowHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
    padding: '12px 24px', background: '#f9fafb',
    fontSize: 11, fontWeight: 700, color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
    padding: '16px 24px', alignItems: 'center',
    borderBottom: '1px solid #f3f4f6',
    fontSize: 14, color: '#444',
  },
  productCell: { display: 'flex', alignItems: 'center', gap: 12 },
  priceCell: { fontWeight: 700, color: '#FF6B35' },
  stockBadge: {
    padding: '4px 10px', borderRadius: 12,
    fontSize: 12, fontWeight: 700,
  },
  deleteBtn: {
    background: '#fee2e2', color: '#ef4444',
    border: 'none', padding: '6px 14px',
    borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
  },

  // Modal styles
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, padding: 20,
  },
  modal: {
    background: '#fff', borderRadius: 16,
    maxWidth: 540, width: '100%', maxHeight: '90vh',
    overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '20px 24px',
    borderBottom: '1px solid #f3f4f6',
  },
  closeBtn: {
    background: 'transparent', border: 'none',
    color: '#666', cursor: 'pointer',
  },
  form: { padding: 24 },
  formGroup: { marginBottom: 16 },
  label: {
    display: 'block', fontSize: 13, fontWeight: 700,
    color: '#444', marginBottom: 6,
  },
  input: {
    width: '100%', padding: '12px 14px',
    border: '1px solid #e5e7eb', borderRadius: 10,
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
  },
  priceRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
  },
  modalFooter: {
    display: 'flex', gap: 12, marginTop: 20,
  },
  cancelBtn: {
    flex: 1, padding: 12, borderRadius: 10,
    border: '1px solid #e5e7eb', background: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
  submitBtn: {
    flex: 2, padding: 12, borderRadius: 10,
    background: '#FF6B35', color: '#fff', border: 'none',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
};

export default SellerDashboard;