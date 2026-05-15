import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, mode, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>

      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🛒 <span>Duo<strong>Kart</strong></span>
      </Link>

      {/* Shows B2B or B2C badge in navbar */}
      {mode && (
        <div style={{
          ...styles.modeBadge,
          background: mode === 'b2b' ? '#2563EB' : '#FF6B35'
        }}>
          {mode.toUpperCase()} Mode
        </div>
      )}

      {/* Nav Links */}
      <div style={styles.navLinks}>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/seller" style={styles.link}>Sell on DuoKart</Link>

        {/* Cart Icon */}
        <Link to="/cart" style={styles.cartBtn}>
          <FiShoppingCart size={20} />
          {cartCount > 0 && (
            <span style={styles.cartBadge}>{cartCount}</span>
          )}
        </Link>

        {/* Login / User */}
        {user ? (
          <div style={styles.userArea}>
            <span style={styles.userName}>Hi, {user.name}!</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <FiLogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginBtn}>
            <FiUser size={16} /> Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/products" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/seller" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sell on DuoKart</Link>
          <Link to="/cart" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
          <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: 65,
    background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'sticky', top: 0, zIndex: 1000,
  },
  logo: {
    fontSize: 22, fontWeight: 700, color: '#2C3E50',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  modeBadge: {
    color: '#fff', fontSize: 12, fontWeight: 700,
    padding: '4px 12px', borderRadius: 20,
  },
  navLinks: {
    display: 'flex', alignItems: 'center', gap: 24,
  },
  link: { color: '#555', fontWeight: 500, fontSize: 15 },
  cartBtn: {
    position: 'relative', color: '#333',
    display: 'flex', alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute', top: -8, right: -10,
    background: '#FF6B35', color: '#fff', fontSize: 10,
    borderRadius: '50%', width: 18, height: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700,
  },
  userArea: { display: 'flex', alignItems: 'center', gap: 10 },
  userName: { fontSize: 14, fontWeight: 500, color: '#333' },
  logoutBtn: {
    background: '#fee2e2', color: '#ef4444',
    padding: '6px 10px', borderRadius: 8,
  },
  loginBtn: {
    background: '#FF6B35', color: '#fff',
    padding: '8px 18px', borderRadius: 25,
    fontWeight: 600, fontSize: 14,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  menuBtn: { display: 'none', background: 'transparent', color: '#333' },
  mobileMenu: {
    position: 'absolute', top: 65, left: 0, right: 0,
    background: '#fff', padding: 20,
    display: 'flex', flexDirection: 'column', gap: 16,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  mobileLink: { color: '#333', fontWeight: 500, fontSize: 16 },
};

export default Navbar;