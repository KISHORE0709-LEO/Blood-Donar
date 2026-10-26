import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        .nav-link:hover { color: #ff6b6b !important; background: rgba(200,26,39,0.1) !important; }
        .logout-btn:hover { background: rgba(239,68,68,0.1) !important; color: #ff6b6b !important; border-color: rgba(239,68,68,0.3) !important; }
        .register-btn:hover { background: #a8111d !important; box-shadow: 0 6px 20px rgba(200,26,39,0.45) !important; }
      `}</style>
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <Link to="/" style={styles.brand}>
          <div style={styles.brandDrop}>🩸</div>
          <span style={styles.brandText}>Blood<span style={styles.brandRed}>Connect</span></span>
        </Link>

        <div style={styles.links}>
          {[
            ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
            { to: '/requests', label: 'Requests' },
            { to: '/donors', label: 'Find Donors' },
            ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="nav-link"
              style={{ ...styles.link, ...(isActive(to) ? styles.activeLink : {}) }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={styles.actions}>
          {user ? (
            <div style={styles.userArea}>
              <div style={styles.userBadge}>
                <div style={styles.avatar}>{user.fullName?.charAt(0).toUpperCase()}</div>
                <span style={styles.userName}>{user.fullName?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn" style={styles.logoutBtn}>Sign Out</button>
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" className="nav-link" style={styles.loginBtn}>Sign In</Link>
              <Link to="/register" className="register-btn" style={styles.registerBtn}>Get Started →</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

const RED = '#c81a27';
const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: '68px', position: 'sticky', top: 0, zIndex: 1000,
    background: 'rgba(15,15,19,0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
    borderBottom: '1px solid rgba(200,26,39,0.2)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  brandDrop: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #c81a27, #8b0000)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem',
    boxShadow: '0 4px 14px rgba(200,26,39,0.35)',
  },
  brandText: { fontSize: '1.25rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' },
  brandRed: { color: RED },
  links: { display: 'flex', alignItems: 'center', gap: '2px' },
  link: {
    color: '#94a3b8', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  activeLink: { color: '#ff6b6b', background: 'rgba(200,26,39,0.12)', fontWeight: '700' },
  actions: { display: 'flex', alignItems: 'center' },
  userArea: { display: 'flex', alignItems: 'center', gap: '10px' },
  userBadge: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(255,255,255,0.06)', padding: '5px 14px 5px 5px',
    borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #c81a27, #8b0000)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', fontWeight: '800', color: '#fff',
    boxShadow: '0 2px 8px rgba(200,26,39,0.3)',
  },
  userName: { fontSize: '0.88rem', fontWeight: '600', color: '#e2e8f0' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8', padding: '7px 16px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  authBtns: { display: 'flex', gap: '8px', alignItems: 'center' },
  loginBtn: {
    color: '#94a3b8', padding: '8px 18px', borderRadius: '8px',
    fontSize: '0.9rem', fontWeight: '500',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    textDecoration: 'none',
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #c81a27, #8b0000)',
    color: '#fff', padding: '9px 20px', borderRadius: '10px',
    fontSize: '0.9rem', fontWeight: '700',
    boxShadow: '0 4px 16px rgba(200,26,39,0.35)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
};
