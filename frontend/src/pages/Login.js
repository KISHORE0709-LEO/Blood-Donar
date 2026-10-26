import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      toast.success(`Welcome back, ${data.fullName}!`);
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes floatDrop { 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(-16px) rotate(-8deg)} }
        .auth-input:focus { border-color: #c81a27 !important; box-shadow: 0 0 0 3px rgba(200,26,39,0.1) !important; outline: none; }
        .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(200,26,39,0.45) !important; }
        .auth-input::placeholder { color: #bbb; }
      `}</style>

      <div style={s.blobTL} />
      <div style={s.blobBR} />
      <div style={s.floatDrop}>🩸</div>

      {/* Left panel */}
      <div style={s.leftPanel}>
        <div style={s.leftContent}>
          <div style={s.leftLogo}>🩸</div>
          <h2 style={s.leftH2}>BloodConnect</h2>
          <p style={s.leftP}>Connecting donors with patients in critical need — every second counts.</p>
          <div style={s.leftStats}>
            {[
              { icon: '👥', label: 'Active Donors' },
              { icon: '🚨', label: 'Emergency Requests' },
              { icon: '💉', label: 'Lives Saved' },
            ].map((item, i) => (
              <div key={i} style={s.leftStat}>
                <span style={s.leftStatIcon}>{item.icon}</span>
                <span style={s.leftStatLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={s.rightPanel}>
        <div style={s.card}>
          <div style={s.cardTop}>
            <div style={s.iconWrap}>🩸</div>
            <h2 style={s.title}>Welcome Back</h2>
            <p style={s.sub}>Sign in to your BloodConnect account</p>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email Address</label>
              <input className="auth-input" style={s.input} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input className="auth-input" style={s.input} type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="auth-btn" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={s.footer}>
            Don't have an account?{' '}
            <Link to="/register" style={s.link}>Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const RED = '#c81a27';

const s = {
  page: {
    minHeight: '100vh', display: 'flex',
    background: 'linear-gradient(150deg, #ffffff 0%, #fff5f5 60%, #ffe8e8 100%)',
    position: 'relative', overflow: 'hidden',
  },
  blobTL: {
    position: 'fixed', top: '-100px', left: '-100px',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,26,39,0.07) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  blobBR: {
    position: 'fixed', bottom: '-80px', right: '-80px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,26,39,0.05) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  floatDrop: {
    position: 'fixed', bottom: '15%', left: '30%',
    fontSize: '5rem', opacity: 0.05,
    animation: 'floatDrop 5s ease-in-out infinite',
    pointerEvents: 'none',
  },

  /* Left decorative panel */
  leftPanel: {
    flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: `linear-gradient(145deg, ${RED} 0%, #8b0000 100%)`,
    padding: '60px 48px', position: 'relative', overflow: 'hidden',
    minHeight: '100vh',
  },
  leftContent: { position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' },
  leftLogo: {
    width: '72px', height: '72px', borderRadius: '20px',
    background: 'rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', margin: '0 auto 20px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  leftH2: { fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' },
  leftP: { color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: '40px' },
  leftStats: { display: 'flex', flexDirection: 'column', gap: '14px' },
  leftStat: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '14px 18px', border: '1px solid rgba(255,255,255,0.15)',
  },
  leftStatIcon: { fontSize: '1.3rem' },
  leftStatLabel: { color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '0.9rem' },

  /* Right form panel */
  rightPanel: {
    flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 40px',
  },
  card: {
    width: '100%', maxWidth: '420px',
    background: '#fff',
    border: '1px solid #fde8e8',
    borderRadius: '24px', padding: '44px 40px',
    boxShadow: '0 8px 40px rgba(200,26,39,0.08)',
  },
  cardTop: { textAlign: 'center', marginBottom: '36px' },
  iconWrap: {
    width: '60px', height: '60px', borderRadius: '16px',
    background: `linear-gradient(135deg, ${RED}, #8b0000)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 18px', fontSize: '1.6rem',
    boxShadow: '0 6px 20px rgba(200,26,39,0.3)',
  },
  title: { fontSize: '1.7rem', fontWeight: '900', color: '#1a0a0a', marginBottom: '6px', letterSpacing: '-0.02em' },
  sub: { color: '#999', fontSize: '0.88rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' },
  input: {
    padding: '13px 16px',
    background: '#fafafa',
    border: '1.5px solid #f0e0e0',
    borderRadius: '12px',
    color: '#1a0a0a', fontSize: '0.95rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  btn: {
    padding: '14px',
    background: `linear-gradient(135deg, ${RED}, #8b0000)`,
    color: '#fff', border: 'none', borderRadius: '12px',
    fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(200,26,39,0.3)',
    marginTop: '4px', transition: 'transform 0.2s, box-shadow 0.2s',
  },
  footer: { textAlign: 'center', marginTop: '24px', color: '#999', fontSize: '0.88rem' },
  link: { color: RED, fontWeight: '700' },
};
