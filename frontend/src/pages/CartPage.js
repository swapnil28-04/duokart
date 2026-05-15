import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal } = useCart();
  const { mode } = useAuth();
  const navigate = useNavigate();

  const themeColor = mode === 'b2b' ? '#2563EB' : '#FF6B35';
  const subtotal = getTotal(mode);
  const deliveryFee = mode === 'b2b' ? 0 : (subtotal > 500 ? 0 : 40);
  const gst = mode === 'b2b' ? Math.round(subtotal * 0.18) : 0;
  const total = subtotal + deliveryFee + gst;

  // Helper to render product image (handles both URLs and emojis)
  const renderItemImage = (item) => {
    const img = item.image;
    if (img && typeof img === 'string' && img.startsWith('http')) {
      return (
        <img
          src={img}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 12,
          }}
        />
      );
    }
    return <span style={{ fontSize: 40 }}>{img || '📦'}</span>;
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is feeling lonely</h2>
        <p style={styles.emptySubtitle}>
          Add some products and let's get this delivered!
        </p>
        <button
          style={{ ...styles.shopBtn, background: themeColor || '#FF6B35' }}
          onClick={() => navigate('/products')}
        >
          <FiShoppingBag size={16} /> Start Shopping
        </button>
      </div>
    );
  }

  const handleCheckout = () => {
    alert('🎉 Order placed successfully!\n\nThis is a demo — in the real app, you would go to a payment page now.');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Your Cart</h1>
          <p style={styles.subtitle}>
            {cartItems.length} item{cartItems.length > 1 ? 's' : ''} ·{' '}
            <span style={{ color: themeColor, fontWeight: 700 }}>
              {mode?.toUpperCase()} pricing applied
            </span>
          </p>
        </div>

        <div style={styles.layout}>

          {/* LEFT — Cart Items */}
          <div style={styles.itemsBox}>
            {cartItems.map(item => {
              const price = mode === 'b2b' ? item.wholesalePrice : item.retailPrice;
              const itemTotal = price * item.quantity;

              return (
                <div key={item._id} style={styles.item}>

                  {/* Product Image — handles URLs and emojis */}
                  <div style={styles.itemImage}>
                    {renderItemImage(item)}
                  </div>

                  {/* Item Details */}
                  <div style={styles.itemDetails}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemSeller}>by {item.seller}</p>
                    <p style={styles.itemPrice}>
                      ₹{price} <span style={styles.itemUnit}>/{item.unit?.replace('per ', '') || 'unit'}</span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={styles.qtyControls}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span style={styles.qtyText}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div style={styles.itemTotal}>
                    <strong>₹{itemTotal}</strong>
                  </div>

                  {/* Remove */}
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(item._id)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT — Order Summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div style={styles.summaryRow}>
              <span>Delivery</span>
              <span style={{ color: deliveryFee === 0 ? '#10B981' : '#333' }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>

            {mode === 'b2b' && (
              <div style={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>₹{gst}</span>
              </div>
            )}

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Total</span>
              <span style={{ color: themeColor }}>₹{total}</span>
            </div>

            {mode === 'b2c' && deliveryFee === 0 && (
              <div style={styles.freeDeliveryNote}>
                🎉 You got FREE delivery!
              </div>
            )}

            {mode === 'b2c' && deliveryFee > 0 && (
              <div style={styles.deliveryNote}>
                Add ₹{500 - subtotal} more for free delivery
              </div>
            )}

            {mode === 'b2b' && (
              <div style={styles.b2bNote}>
                💼 GST invoice will be auto-generated
              </div>
            )}

            <button
              style={{ ...styles.checkoutBtn, background: themeColor }}
              onClick={handleCheckout}
            >
              Place Order <FiArrowRight />
            </button>

            <button
              style={styles.continueBtn}
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>

            {/* Trust badges */}
            <div style={styles.trustBadges}>
              <div style={styles.trustItem}>🔒 Secure Payment</div>
              <div style={styles.trustItem}>↩️ Easy Returns</div>
              <div style={styles.trustItem}>📞 24/7 Support</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f9fafb', padding: '40px 20px' },
  container: { maxWidth: 1200, margin: '0 auto' },

  empty: {
    minHeight: '70vh', display: 'flex',
    flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', textAlign: 'center', padding: 20,
  },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 },
  emptySubtitle: { color: '#888', marginBottom: 28 },
  shopBtn: {
    color: '#fff', padding: '14px 28px',
    borderRadius: 12, border: 'none',
    fontSize: 15, fontWeight: 700,
    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
  },

  header: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 900, color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666' },

  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 24, alignItems: 'start',
  },

  itemsBox: {
    background: '#fff', borderRadius: 16,
    padding: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  item: {
    display: 'grid',
    gridTemplateColumns: '70px 1fr auto auto auto',
    gap: 16, alignItems: 'center',
    padding: '16px', borderBottom: '1px solid #f3f4f6',
  },
  itemImage: {
    width: 70, height: 70, background: '#f9fafb',
    borderRadius: 12, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  itemDetails: { minWidth: 0 },
  itemName: { fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 },
  itemSeller: { fontSize: 12, color: '#888', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#444', fontWeight: 600 },
  itemUnit: { fontSize: 11, color: '#888', fontWeight: 400 },

  qtyControls: {
    display: 'flex', alignItems: 'center', gap: 0,
    background: '#f3f4f6', borderRadius: 8, padding: 2,
  },
  qtyBtn: {
    background: '#fff', border: 'none',
    width: 28, height: 28, borderRadius: 6,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer',
  },
  qtyText: {
    minWidth: 32, textAlign: 'center',
    fontWeight: 700, fontSize: 14,
  },
  itemTotal: {
    fontSize: 16, color: '#1a1a1a', minWidth: 70,
    textAlign: 'right',
  },
  removeBtn: {
    background: 'transparent', border: 'none',
    color: '#ef4444', cursor: 'pointer', padding: 6,
  },

  summary: {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    position: 'sticky', top: 80,
  },
  summaryTitle: { fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#1a1a1a' },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '10px 0', fontSize: 14, color: '#444',
  },
  divider: { height: 1, background: '#e5e7eb', margin: '12px 0' },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 20, fontWeight: 900, marginBottom: 16,
  },
  freeDeliveryNote: {
    background: '#D1FAE5', color: '#065F46',
    padding: 10, borderRadius: 8,
    fontSize: 12, textAlign: 'center', marginBottom: 12, fontWeight: 600,
  },
  deliveryNote: {
    background: '#FEF3C7', color: '#92400E',
    padding: 10, borderRadius: 8,
    fontSize: 12, textAlign: 'center', marginBottom: 12, fontWeight: 600,
  },
  b2bNote: {
    background: '#DBEAFE', color: '#1E40AF',
    padding: 10, borderRadius: 8,
    fontSize: 12, textAlign: 'center', marginBottom: 12, fontWeight: 600,
  },

  checkoutBtn: {
    width: '100%', color: '#fff',
    padding: 14, borderRadius: 12, border: 'none',
    fontSize: 15, fontWeight: 800, cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, marginBottom: 8,
  },
  continueBtn: {
    width: '100%', background: 'transparent',
    color: '#666', padding: 12, borderRadius: 12,
    border: '1px solid #e5e7eb', fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
  },
  trustBadges: {
    display: 'flex', justifyContent: 'space-around',
    marginTop: 20, paddingTop: 16,
    borderTop: '1px solid #f3f4f6',
  },
  trustItem: { fontSize: 11, color: '#666', textAlign: 'center' },
};

export default CartPage;