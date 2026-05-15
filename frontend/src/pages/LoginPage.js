import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!', formData);
    setErrorMsg('');
    setSuccessMsg('');

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      if (!formData.name) {
        setErrorMsg('Please enter your name');
        return;
      }
      result = await register(formData);
    }

    console.log('Result:', result);

    if (result.success) {
      setSuccessMsg(isLogin ? 'Login successful!' : 'Account created!');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.header}>
          <span style={styles.logo}>🛒</span>
          <h1 style={styles.title}>
            {isLogin ? 'Welcome Back!' : 'Join DuoKart'}
          </h1>
          <p style={styles.subtitle}>
            {isLogin ? 'Login to continue' : 'Create your account in 30 seconds'}
          </p>
        </div>

        <div style={styles.toggleBar}>
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            style={{
              ...styles.toggleBtn,
              background: isLogin ? '#FF6B35' : 'transparent',
              color: isLogin ? '#fff' : '#666',
            }}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            style={{
              ...styles.toggleBtn,
              background: !isLogin ? '#FF6B35' : 'transparent',
              color: !isLogin ? '#fff' : '#666',
            }}
          >
            Register
          </button>
        </div>

        {errorMsg && <div style={styles.errorBox}>⚠️ {errorMsg}</div>}
        {successMsg && <div style={styles.successBox}>✅ {successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <FiUser style={styles.inputIcon} />
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <FiMail style={styles.inputIcon} />
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FiLock style={styles.inputIcon} />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div style={styles.roleSection}>
              <label style={styles.roleLabel}>I want to:</label>
              <div style={styles.roleOptions}>
                {[
                  { val: 'customer', label: 'Buy Products' },
                  { val: 'seller', label: 'Sell Products' },
                  { val: 'both', label: 'Both' },
                ].map(opt => (
                  <div
                    key={opt.val}
                    onClick={() => setFormData({ ...formData, role: opt.val })}
                    style={{
                      ...styles.roleCard,
                      border: formData.role === opt.val ? '2px solid #FF6B35' : '2px solid #e5e7eb',
                      background: formData.role === opt.val ? '#FFF3EE' : '#fff',
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Please wait...' : (
              <>{isLogin ? 'Login to DuoKart' : 'Create Account'} <FiArrowRight /></>
            )}
          </button>
        </form>

        <p style={styles.footerNote}>
          {isLogin ? (
            <>New here? <span style={styles.link} onClick={() => setIsLogin(false)}>Create account</span></>
          ) : (
            <>Have an account? <span style={styles.link} onClick={() => setIsLogin(true)}>Login</span></>
          )}
        </p>

        <Link to="/" style={styles.backLink}>Back to homepage</Link>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff 0%, #FFF8F5 50%, #EFF6FF 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px',
  },
  card: {
    background: '#fff', borderRadius: 24, padding: 40,
    maxWidth: 480, width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
  },
  header: { textAlign: 'center', marginBottom: 24 },
  logo: { fontSize: 48 },
  title: { fontSize: 28, fontWeight: 900, marginTop: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  toggleBar: {
    display: 'flex', background: '#f3f4f6',
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  toggleBtn: {
    flex: 1, padding: '10px', borderRadius: 8,
    fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
  errorBox: {
    background: '#FEE2E2', color: '#B91C1C',
    padding: '10px 14px', borderRadius: 8, fontSize: 14,
    marginBottom: 16, fontWeight: 500,
  },
  successBox: {
    background: '#D1FAE5', color: '#065F46',
    padding: '10px 14px', borderRadius: 8, fontSize: 14,
    marginBottom: 16, fontWeight: 500,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  inputGroup: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 14, color: '#9ca3af', fontSize: 18 },
  input: {
    width: '100%', padding: '14px 14px 14px 44px',
    border: '2px solid #e5e7eb', borderRadius: 12,
    fontSize: 15, outline: 'none', fontFamily: 'inherit',
  },
  roleSection: { marginTop: 4 },
  roleLabel: { fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' },
  roleOptions: { display: 'flex', gap: 8 },
  roleCard: {
    flex: 1, padding: '12px 8px', borderRadius: 10,
    cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 600,
  },
  submitBtn: {
    background: '#FF6B35', color: '#fff',
    padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 15,
    cursor: 'pointer', border: 'none', marginTop: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  footerNote: { textAlign: 'center', fontSize: 14, color: '#666', marginTop: 20 },
  link: { color: '#FF6B35', fontWeight: 600, cursor: 'pointer' },
  backLink: {
    display: 'block', textAlign: 'center',
    marginTop: 12, fontSize: 13, color: '#888',
  },
};

export default LoginPage;