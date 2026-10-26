import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BLOOD_TYPES = ['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'];
const BT_LABELS = { A_POS:'A+', A_NEG:'A−', B_POS:'B+', B_NEG:'B−', AB_POS:'AB+', AB_NEG:'AB−', O_POS:'O+', O_NEG:'O−' };

export default function Register() {
  const [form, setForm] = useState({ fullName:'', email:'', password:'', phone:'', city:'', bloodType:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data);
      toast.success('Welcome to BloodConnect! 🩸');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <style>{`
        @keyframes floatDrop { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-16px) rotate(-6deg)} }
        .auth-input:focus { border-color: #c81a27 !important; box-shadow: 0 0 0 3px rgba(200,26,39,0.1) !important; outline: none; }
        .auth-input::placeholder { color: #bbb; }
        .blood-btn:hover { border-color: #c81a27 !important; background: #fff0f0 !important; color: #c81a27 !important; }
        .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(200,26,39,0.45) !important; }
      `}</style>

      <div style={s.blobTL} />
      <div style={s.blobBR} />
      <div style={s.floatDrop}>🩸</div>

      <div style={s.wrapper}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.iconWrap}>🩸</div>
          <h2 style={s.title}>Join BloodConnect</h2>
          <p style={s.sub}>Create your account and start saving lives today</p>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input className="auth-input" style={s.input} placeholder="John Doe" value={form.fullName} onChange={set('fullName')} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Phone</label>
              <input className="auth-input" style={s.input} placeholder="+91 9999999999" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input className="auth-input" style={s.input} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input className="auth-input" style={s.input} type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
          </div>

          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>City</label>
              <input className="auth-input" style={s.input} placeholder="Mumbai" value={form.city} onChange={set('city')} />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Blood Type</label>
            <div style={s.bloodGrid}>
              {BLOOD_TYPES.map(bt => (
                <button key={bt} type="button" className="blood-btn"
                  onClick={() => setForm({ ...form, bloodType: bt })}
                  style={{
                    ...s.bloodBtn,
                    ...(form.bloodType === bt ? s.bloodBtnActive : {}),
                  }}>
                  {BT_LABELS[bt]}
                </button>
              ))}
            </div>
          </div>

          <button className="auth-btn" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

const RED = '#c81a27';

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 20px',
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
    position: 'fixed', top: '15%', right: '8%',
    fontSize: '6rem', opacity: 0.05,
    animation: 'floatDrop 5s ease-in-out infinite',
    pointerEvents: 'none',
  },
  wrapper: {
    width: '100%', maxWidth: '560px', position: 'relative', zIndex: 1,
    background: '#fff',
    border: '1px solid #fde8e8',
    borderRadius: '24px', padding: '44px 40px',
    boxShadow: '0 8px 40px rgba(200,26,39,0.08)',
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  iconWrap: {
    width: '60px', height: '60px', borderRadius: '16px',
    background: `linear-gradient(135deg, ${RED}, #8b0000)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 18px', fontSize: '1.6rem',
    boxShadow: '0 6px 20px rgba(200,26,39,0.3)',
  },
  title: { fontSize: '1.7rem', fontWeight: '900', color: '#1a0a0a', marginBottom: '6px', letterSpacing: '-0.02em' },
  sub: { color: '#999', fontSize: '0.88rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' },
  input: {
    padding: '12px 14px',
    background: '#fafafa',
    border: '1.5px solid #f0e0e0',
    borderRadius: '12px',
    color: '#1a0a0a', fontSize: '0.9rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  bloodGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' },
  bloodBtn: {
    padding: '11px 6px',
    background: '#fafafa',
    border: '1.5px solid #f0e0e0',
    borderRadius: '10px',
    color: '#888', fontWeight: '800', cursor: 'pointer', fontSize: '0.88rem',
    transition: 'all 0.2s ease',
  },
  bloodBtnActive: {
    background: '#fff0f0',
    border: `1.5px solid ${RED}`,
    color: RED,
    boxShadow: '0 0 0 3px rgba(200,26,39,0.1)',
  },
  btn: {
    padding: '14px',
    background: `linear-gradient(135deg, ${RED}, #8b0000)`,
    color: '#fff', border: 'none', borderRadius: '12px',
    fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(200,26,39,0.3)',
    marginTop: '6px', transition: 'transform 0.2s, box-shadow 0.2s',
  },
  footer: { textAlign: 'center', marginTop: '24px', color: '#999', fontSize: '0.88rem' },
  link: { color: RED, fontWeight: '700' },
};
