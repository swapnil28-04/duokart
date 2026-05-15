import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiCheck, FiZap } from 'react-icons/fi';

// Subtle rotating taglines — clever, not cringe
const rotatingTexts = [
  "Real prices. Real sellers. No drama.",
  "Built different. Priced better.",
  "From street stalls to wholesale — we got it.",
  "Shop smart, not hard.",
  "Your wallet will actually thank you.",
];

const LandingPage = () => {
  const { selectMode } = useAuth();
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(null);
  const [textIndex, setTextIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Rotates the tagline every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTextIndex(prev => (prev + 1) % rotatingTexts.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleModeSelect = (mode) => {
    selectMode(mode);
    navigate('/products');
  };

  return (
    <div style={styles.page}>

      {/* Announcement Bar */}
      <div style={styles.announcementBar}>
        <FiZap size={14} color="#FFD700" />
        <span>DuoKart is live — and yes, the deals are actually that good 👀</span>
        <FiZap size={14} color="#FFD700" />
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>

        {/* Rotating tagline */}
        <div style={{
          ...styles.rotatingBadge,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        }}>
          {rotatingTexts[textIndex]}
        </div>

        <h1 style={styles.heroTitle}>
          One Platform.<br />
          <span style={styles.highlight}>Every Seller.</span><br />
          Your Choice.
        </h1>

        <p style={styles.heroSubtitle}>
          From street vendors to wholesale distributors —
          DuoKart brings every kind of seller under one roof.
          <strong> Pretty cool, right?</strong>
        </p>

        {/* Live shoppers — adds social proof without being too much */}
        <div style={styles.socialProof}>
          <div style={styles.avatarStack}>
            {['😎','🤩','💁','🧑‍💻','👩‍🍳'].map((emoji, i) => (
              <div key={i} style={{ ...styles.avatar, marginLeft: i === 0 ? 0 : -12, zIndex: 5 - i }}>
                {emoji}
              </div>
            ))}
          </div>
          <span style={styles.socialText}>
            <strong>2,341 shoppers</strong> online right now
            <span style={styles.liveDot}></span>
          </span>
        </div>
      </div>

      {/* THE CHOICE SECTION */}
      <div style={styles.choiceSection}>
        <div style={styles.choiceHeader}>
          <h2 style={styles.choiceTitle}>How are we shopping today?</h2>
          <p style={styles.choiceSubtitle}>
            Two modes, one app, zero confusion. Pick your move.
          </p>
        </div>

        <div style={styles.cardsContainer}>

          {/* B2C Card */}
          <div
            style={{
              ...styles.card,
              ...(hovering === 'b2c' ? styles.cardHoverB2C : {}),
              border: '3px solid ' + (hovering === 'b2c' ? '#FF6B35' : '#e5e7eb'),
            }}
            onMouseEnter={() => setHovering('b2c')}
            onMouseLeave={() => setHovering(null)}
            onClick={() => handleModeSelect('b2c')}
          >
            <div style={{ ...styles.hotTag, background: '#FF6B35' }}>🔥 Most Popular</div>

            <div style={{ ...styles.cardIcon, background: '#FFF3EE' }}>🛍️</div>
            <h3 style={styles.cardTitle}>Shop as Customer</h3>
            <p style={styles.cardMode}>B2C — Business to Consumer</p>
            <p style={styles.cardDesc}>
              Single items, retail prices, delivered to your door.
              For everyday shopping that doesn't break the bank.
            </p>
            <ul style={styles.featureList}>
              {[
                'Fair retail pricing',
                'Buy single items, no minimum order',
                'Fast home delivery',
                'Easy returns, no questions asked',
                'Discover local street vendors',
              ].map(f => (
                <li key={f} style={styles.featureItem}>
                  <FiCheck color="#FF6B35" size={14} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button style={{ ...styles.choiceBtn, background: '#FF6B35' }}>
              Start Shopping <FiArrowRight />
            </button>
            <p style={styles.cardFootnote}>No catch. Just good prices.</p>
          </div>

          {/* OR Divider */}
          <div style={styles.orDivider}>
            <div style={styles.orLine} />
            <span style={styles.orText}>OR</span>
            <div style={styles.orLine} />
          </div>

          {/* B2B Card */}
          <div
            style={{
              ...styles.card,
              ...(hovering === 'b2b' ? styles.cardHoverB2B : {}),
              border: '3px solid ' + (hovering === 'b2b' ? '#2563EB' : '#e5e7eb'),
            }}
            onMouseEnter={() => setHovering('b2b')}
            onMouseLeave={() => setHovering(null)}
            onClick={() => handleModeSelect('b2b')}
          >
            <div style={{ ...styles.hotTag, background: '#2563EB' }}>💼 For Businesses</div>

            <div style={{ ...styles.cardIcon, background: '#EFF6FF' }}>🏢</div>
            <h3 style={styles.cardTitle}>Shop as Business</h3>
            <p style={{ ...styles.cardMode, color: '#2563EB' }}>B2B — Business to Business</p>
            <p style={styles.cardDesc}>
              Bulk orders, wholesale prices, GST invoices.
              Built for retailers, restaurants, and growing businesses.
            </p>
            <ul style={styles.featureList}>
              {[
                'Wholesale pricing on bulk orders',
                'Volume-based discount tiers',
                'GST-compliant invoicing',
                'Net payment terms available',
                'Dedicated business support',
              ].map(f => (
                <li key={f} style={styles.featureItem}>
                  <FiCheck color="#2563EB" size={14} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button style={{ ...styles.choiceBtn, background: '#2563EB' }}>
              Start Buying in Bulk <FiArrowRight />
            </button>
            <p style={styles.cardFootnote}>Your accountant will love this.</p>
          </div>

        </div>
      </div>

      {/* Sellers Section */}
      <div style={styles.sellersSection}>
        <div style={styles.sellersBadge}>No gatekeeping 🚫🔒</div>
        <h2 style={styles.sectionTitle}>
          Everyone eats on DuoKart 🍽️
        </h2>
        <p style={styles.sectionSubtitle}>
          From your local sabziwala to big distributors — all in one app.
          Lowkey the most unhinged collab ever.
        </p>
        <div style={styles.sellersGrid}>
          {[
            { emoji: '🥬', name: 'Sabzi Wala', desc: 'Fresh veggies, zero middleman tax' },
            { emoji: '🏪', name: 'Local Kirana', desc: 'OG neighbourhood drip 🏘️' },
            { emoji: '🏭', name: 'Wholesaler', desc: 'Bulk goods, main character prices' },
            { emoji: '🍱', name: 'Tiffin Service', desc: 'Ghar ka khana era unlocked' },
            { emoji: '📦', name: 'Distributor', desc: 'Pan-India, no printer' },
            { emoji: '🧵', name: 'Street Tailor', desc: 'Custom fits, budget slay ✂️' },
          ].map(seller => (
            <div key={seller.name} style={styles.sellerCard}>
              <span style={styles.sellerEmoji}>{seller.emoji}</span>
              <strong style={styles.sellerName}>{seller.name}</strong>
              <span style={styles.sellerDesc}>{seller.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsSection}>
        <p style={styles.statsHeadline}>The numbers speak for themselves</p>
        <div style={styles.statsGrid}>
          {[
            { number: '10,000+', label: 'Active Sellers' },
            { number: '5 Lakh+', label: 'Products Listed' },
            { number: '50+', label: 'Cities Covered' },
            { number: '₹0', label: 'Joining Fee' },
          ].map(stat => (
            <div key={stat.label} style={styles.statBox}>
              <strong style={styles.statNumber}>{stat.number}</strong>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>
          Still scrolling? The deals
          <span style={{ color: '#FF6B35' }}> won't wait </span>
          forever 👀
        </h2>
        <p style={styles.ctaSubtitle}>
          Join 10,000+ sellers and lakhs of shoppers already on DuoKart
        </p>
        <div style={styles.ctaBtns}>
          <button
            style={{ ...styles.ctaBtn, background: '#FF6B35' }}
            onClick={() => handleModeSelect('b2c')}
          >
            Start Shopping 🛍️
          </button>
          <button
            style={{ ...styles.ctaBtn, background: '#2563EB' }}
            onClick={() => handleModeSelect('b2b')}
          >
            Buy in Bulk 💼
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>© 2025 DuoKart — Bridging Every Seller to Every Buyer 🇮🇳</p>
        <p style={{ marginTop: 6, fontSize: 11, color: '#444' }}>
          Made with 🧡 in India • Real prices, real sellers, real simple
        </p>
      </div>

    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f9fafb' },

  announcementBar: {
    background: '#1a1a2e', color: '#fff',
    padding: '10px 20px', textAlign: 'center',
    fontSize: 13, fontWeight: 500,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },

  hero: {
    textAlign: 'center', padding: '70px 20px 60px',
    background: 'linear-gradient(135deg, #fff 0%, #FFF8F5 100%)',
  },
  rotatingBadge: {
    display: 'inline-block', background: '#FFF3EE',
    color: '#FF6B35', padding: '8px 20px',
    borderRadius: 20, fontSize: 14, fontWeight: 600,
    marginBottom: 24, border: '1px solid #FFD4C2',
    transition: 'all 0.4s ease',
  },
  heroTitle: {
    fontSize: 56, fontWeight: 900, color: '#1a1a1a',
    lineHeight: 1.15, marginBottom: 20,
  },
  highlight: {
    background: 'linear-gradient(135deg, #FF6B35, #ff8c42)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: 18, color: '#666', maxWidth: 500,
    margin: '0 auto 28px', lineHeight: 1.7,
  },
  socialProof: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 12, marginTop: 8,
  },
  avatarStack: { display: 'flex', alignItems: 'center' },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: '#FFF3EE', border: '2px solid #fff',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 18,
  },
  socialText: {
    fontSize: 13, color: '#666',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  liveDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: '#10B981', display: 'inline-block',
    boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
  },

  choiceSection: { padding: '60px 20px', background: '#fff' },
  choiceHeader: { textAlign: 'center', marginBottom: 40 },
  choiceTitle: { fontSize: 32, fontWeight: 900, color: '#1a1a1a', marginBottom: 8 },
  choiceSubtitle: { fontSize: 15, color: '#888' },

  cardsContainer: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'stretch', maxWidth: 860,
    margin: '0 auto', flexWrap: 'wrap',
  },
  card: {
    flex: 1, minWidth: 280, maxWidth: 360,
    background: '#fff', borderRadius: 20,
    padding: '36px 32px', cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    position: 'relative', overflow: 'hidden',
  },
  cardHoverB2C: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(255,107,53,0.15)',
  },
  cardHoverB2B: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(37,99,235,0.15)',
  },
  hotTag: {
    color: '#fff', fontSize: 11, fontWeight: 700,
    padding: '4px 12px', borderRadius: 20,
    display: 'inline-block', marginBottom: 16,
  },
  cardIcon: {
    fontSize: 48, width: 80, height: 80, borderRadius: 20,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginBottom: 20,
  },
  cardTitle: { fontSize: 24, fontWeight: 900, marginBottom: 4, color: '#1a1a1a' },
  cardMode: { fontSize: 13, color: '#FF6B35', fontWeight: 600, marginBottom: 12 },
  cardDesc: { fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 20 },
  featureList: { listStyle: 'none', marginBottom: 24 },
  featureItem: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 13, color: '#444', marginBottom: 10,
  },
  choiceBtn: {
    width: '100%', padding: '14px 20px', color: '#fff',
    borderRadius: 12, fontWeight: 700, fontSize: 15,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  cardFootnote: {
    textAlign: 'center', fontSize: 12,
    color: '#aaa', marginTop: 10,
  },

  orDivider: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '0 20px', gap: 12,
  },
  orLine: { width: 2, height: 80, background: '#e5e7eb' },
  orText: {
    fontSize: 14, fontWeight: 700, color: '#9ca3af',
    background: '#fff', padding: '8px 12px',
    borderRadius: '50%', border: '2px solid #e5e7eb',
  },

  sellersSection: {
    padding: '60px 20px', background: '#f9fafb', textAlign: 'center',
  },
  sellersBadge: {
    display: 'inline-block', background: '#fff',
    border: '1px solid #e5e7eb', borderRadius: 20,
    padding: '6px 16px', fontSize: 13,
    fontWeight: 600, color: '#666', marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 28, fontWeight: 900,
    marginBottom: 8, color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: 14, color: '#888',
    maxWidth: 480, margin: '0 auto 36px',
  },
  sellersGrid: {
    display: 'flex', flexWrap: 'wrap', gap: 16,
    justifyContent: 'center', maxWidth: 900, margin: '0 auto',
  },
  sellerCard: {
    background: '#fff', borderRadius: 16, padding: '24px 28px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minWidth: 160,
  },
  sellerEmoji: { fontSize: 36 },
  sellerName: { fontSize: 15, color: '#1a1a1a' },
  sellerDesc: { fontSize: 12, color: '#888', textAlign: 'center' },

  statsSection: {
    padding: '60px 20px',
    background: '#1a1a2e', textAlign: 'center',
  },
  statsHeadline: {
    color: '#aaa', fontSize: 14, fontWeight: 600,
    marginBottom: 32, letterSpacing: 1,
  },
  statsGrid: {
    display: 'flex', justifyContent: 'center',
    flexWrap: 'wrap', gap: 40,
  },
  statBox: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 4,
  },
  statNumber: { fontSize: 36, fontWeight: 900, color: '#FF6B35' },
  statLabel: { fontSize: 14, color: '#aaa', fontWeight: 500 },

  ctaSection: {
    padding: '70px 20px', background: '#fff', textAlign: 'center',
  },
  ctaTitle: {
    fontSize: 30, fontWeight: 900,
    color: '#1a1a1a', maxWidth: 540,
    margin: '0 auto 12px', lineHeight: 1.4,
  },
  ctaSubtitle: {
    fontSize: 15, color: '#888', marginBottom: 32,
  },
  ctaBtns: {
    display: 'flex', gap: 16,
    justifyContent: 'center', flexWrap: 'wrap',
  },
  ctaBtn: {
    padding: '16px 32px', color: '#fff',
    borderRadius: 14, fontWeight: 700, fontSize: 16,
    cursor: 'pointer', border: 'none',
  },

  footer: {
    textAlign: 'center', padding: '28px',
    background: '#0f0f1a', color: '#555', fontSize: 13,
  },
};

export default LandingPage;