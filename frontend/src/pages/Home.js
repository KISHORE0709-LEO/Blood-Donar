import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI, donorAPI } from '../services/api';

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ donors: 0, requests: 0 });

  useEffect(() => {
    Promise.all([donorAPI.getAvailable(), requestAPI.getOpen()])
      .then(([d, r]) => setStats({ donors: d.data.length, requests: r.data.length }))
      .catch(() => {});
  }, []);

  return (
    <div style={s.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.6)} }
        @keyframes floatDrop { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-18px) rotate(-6deg)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .hero-cta-primary { transition: all .2s ease !important; }
        .hero-cta-primary:hover { transform: translateY(-3px) !important; box-shadow: 0 14px 36px rgba(200,26,39,0.45) !important; }
        .hero-cta-secondary:hover { background: #fff0f0 !important; border-color: #f5c6c9 !important; }
        .feat-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.1) !important; }
        .step-card:hover { border-color: #c81a27 !important; background: #fff !important; }
        .bt-pill:hover { background: #c81a27 !important; color: #fff !important; transform: scale(1.08) !important; }
        .stat-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(200,26,39,0.15) !important; }
      `}</style>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.blobTL} />
        <div style={s.blobBR} />
        <div style={s.floatEmoji}>🩸</div>

        <div style={s.heroInner}>
          {/* Left column */}
          <div style={s.heroLeft}>
            <div style={s.liveBadge}>
              <span style={s.pulseDot} />
              <span style={s.liveTxt}><b style={{ color: '#c81a27' }}>{stats.requests}</b> active emergencies right now</span>
            </div>

            <h1 style={s.heroH1}>
              Give Blood.<br />
              <span style={s.heroAccent}>Save Lives.</span><br />
              Be a Hero.
            </h1>

            <p style={s.heroP}>
              A real-time platform connecting blood donors with patients in critical need.
              Every second counts — your donation can be the difference between life and death.
            </p>

            <div style={s.heroBtns}>
              {!user ? (
                <>
                  <Link to="/register" className="hero-cta-primary" style={s.btnPrimary}>
                    🩸 Become a Donor
                  </Link>
                  <Link to="/requests" className="hero-cta-secondary" style={s.btnSecondary}>
                    View Emergencies →
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/requests/new" className="hero-cta-primary" style={s.btnPrimary}>
                    🚨 Post Emergency
                  </Link>
                  <Link to="/donors" className="hero-cta-secondary" style={s.btnSecondary}>
                    Find Donors →
                  </Link>
                </>
              )}
            </div>

            <div style={s.trustRow}>
              {['✅ Free to use', '🔒 Secure & private', '⚡ Real-time updates'].map(t => (
                <span key={t} style={s.trustItem}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right column — stat cards */}
          <div style={s.heroRight}>
            {[
              { icon: '👥', num: stats.donors, label: 'Available Donors', color: '#c81a27', bg: '#fff0f0', border: '#fcc' },
              { icon: '🚨', num: stats.requests, label: 'Open Requests', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { icon: '🩸', num: 8, label: 'Blood Types', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
              { icon: '🏥', num: '24/7', label: 'Emergency Support', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
            ].map((c, i) => (
              <div key={i} className="stat-card" style={{ ...s.statCard, background: c.bg, borderColor: c.border, animationDelay: `${i * 0.1}s` }}>
                <div style={{ ...s.statIcon, background: c.color }}>{c.icon}</div>
                <div>
                  <div style={{ ...s.statNum, color: c.color }}>{c.num}</div>
                  <div style={s.statLabel}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOOD TYPE STRIP ── */}
      <div style={s.strip}>
        <span style={s.stripLabel}>ALL BLOOD TYPES COVERED</span>
        <div style={s.stripTypes}>
          {['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'].map(bt => (
            <span key={bt} className="bt-pill" style={s.btPill}>{bt}</span>
          ))}
        </div>
        <span style={s.stripLabel}>24 / 7 SUPPORT</span>
      </div>

      {/* ── FEATURES ── */}
      <section style={s.section}>
        <div style={s.sectionHead}>
          <span style={s.badge}>PLATFORM FEATURES</span>
          <h2 style={s.sectionH2}>Everything You Need to Save Lives</h2>
          <p style={s.sectionSub}>One platform. Three powerful tools. Zero barriers between donors and patients.</p>
        </div>
        <div style={s.featGrid}>
          {[
            {
              icon: '🚨', title: 'Emergency Requests',
              desc: 'Post critical blood requests instantly. Reach compatible donors in your city within minutes.',
              bg: '#fff0f0', border: '#fcc', iconBg: '#c81a27', color: '#c81a27',
              link: '/requests', cta: 'View Requests',
            },
            {
              icon: '🔍', title: 'Find Donors',
              desc: 'Search verified donors by blood type and location. Every donor is real and ready to help.',
              bg: '#eff6ff', border: '#bfdbfe', iconBg: '#2563eb', color: '#2563eb',
              link: '/donors', cta: 'Search Donors',
            },
            {
              icon: '💉', title: 'Track Donations',
              desc: 'Log every donation, link it to a request, and build your life-saving history over time.',
              bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#16a34a', color: '#16a34a',
              link: '/dashboard', cta: 'My Dashboard',
            },
          ].map((f, i) => (
            <div key={i} className="feat-card" style={{ ...s.featCard, background: f.bg, borderColor: f.border }}>
              <div style={{ ...s.featIconBox, background: f.iconBg }}>{f.icon}</div>
              <h3 style={{ ...s.featTitle, color: f.color }}>{f.title}</h3>
              <p style={s.featDesc}>{f.desc}</p>
              <Link to={f.link} style={{ ...s.featCta, background: f.iconBg }}>{f.cta} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={s.howSection}>
        <div style={s.howInner}>
          <div style={s.sectionHead}>
            <span style={s.badge}>HOW IT WORKS</span>
            <h2 style={s.sectionH2}>Simple. Fast. Life-Saving.</h2>
            <p style={s.sectionSub}>Three steps to connect donors with patients who need help most.</p>
          </div>
          <div style={s.stepsGrid}>
            {[
              { step: '01', icon: '📝', title: 'Register', desc: 'Create your free account, set your blood type and mark your availability.' },
              { step: '02', icon: '🔗', title: 'Connect', desc: 'Post emergency requests or search for compatible donors near you instantly.' },
              { step: '03', icon: '💪', title: 'Donate', desc: 'Respond to requests, donate blood, and track your life-saving impact.' },
            ].map((s2, i) => (
              <div key={i} className="step-card" style={s.stepCard}>
                <div style={s.stepNum}>{s2.step}</div>
                <div style={s.stepEmoji}>{s2.icon}</div>
                <h3 style={s.stepTitle}>{s2.title}</h3>
                <p style={s.stepDesc}>{s2.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCY LEVELS ── */}
      <section style={s.section}>
        <div style={s.sectionHead}>
          <span style={s.badge}>URGENCY SYSTEM</span>
          <h2 style={s.sectionH2}>Prioritized Emergency Levels</h2>
          <p style={s.sectionSub}>Every request is tagged so donors know exactly how urgent the need is.</p>
        </div>
        <div style={s.urgencyGrid}>
          {[
            { level: 'CRITICAL', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'Immediate life-threatening need' },
            { level: 'HIGH', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', desc: 'Urgent — needed within hours' },
            { level: 'MEDIUM', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'Required within 24 hours' },
            { level: 'LOW', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', desc: 'Planned or scheduled donation' },
          ].map((u, i) => (
            <div key={i} style={{ ...s.urgencyCard, background: u.bg, borderColor: u.border }}>
              <div style={{ ...s.urgencyBadge, background: u.color }}>{u.level}</div>
              <p style={{ ...s.urgencyDesc, color: u.color }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      {!user && (
        <section style={s.ctaWrap}>
          <div style={s.ctaBanner}>
            <div style={s.ctaOrb1} />
            <div style={s.ctaOrb2} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🩸</div>
              <h2 style={s.ctaH2}>Ready to Save Lives?</h2>
              <p style={s.ctaP}>Join thousands of donors making a difference every single day. It's free, fast, and life-changing.</p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" style={s.ctaBtnWhite}>Create Free Account →</Link>
                <Link to="/requests" style={s.ctaBtnOutline}>Browse Emergencies</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerBrand}>
            <div style={s.footerLogo}>🩸</div>
            <span style={s.footerName}>Blood<span style={{ color: '#c81a27' }}>Connect</span></span>
          </div>
          <p style={s.footerTagline}>Connecting donors with patients in critical need — 24/7.</p>
          <div style={s.footerLinks}>
            <Link to="/requests" style={s.footerLink}>Emergency Requests</Link>
            <Link to="/donors" style={s.footerLink}>Find Donors</Link>
            <Link to="/register" style={s.footerLink}>Register</Link>
            <Link to="/login" style={s.footerLink}>Sign In</Link>
          </div>
          <p style={s.footerCopy}>© 2024 BloodConnect. Built to save lives.</p>
        </div>
      </footer>
    </div>
  );
}

const RED = '#c81a27';

const s = {
  page: { minHeight: '100vh', background: '#fff5f5', fontFamily: "'Inter', sans-serif" },

  /* Hero */
  hero: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(150deg, #ffffff 0%, #fff5f5 55%, #ffe8e8 100%)',
    borderBottom: '1px solid #fde8e8',
    padding: '80px 40px 90px',
    minHeight: '92vh', display: 'flex', alignItems: 'center',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200,26,39,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(200,26,39,0.06) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  blobTL: {
    position: 'absolute', top: '-150px', left: '-150px',
    width: '600px', height: '600px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,26,39,0.07) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  blobBR: {
    position: 'absolute', bottom: '-120px', right: '-100px',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,26,39,0.05) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  floatEmoji: {
    position: 'absolute', right: '6%', top: '20%',
    fontSize: '8rem', opacity: 0.07,
    animation: 'floatDrop 5s ease-in-out infinite',
    pointerEvents: 'none',
  },
  heroInner: {
    maxWidth: '1200px', margin: '0 auto', width: '100%',
    display: 'grid', gridTemplateColumns: '1fr 420px', gap: '60px',
    alignItems: 'center', position: 'relative', zIndex: 1,
  },
  heroLeft: { display: 'flex', flexDirection: 'column', gap: '28px' },
  liveBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    background: '#fff', border: '1px solid #fcc',
    padding: '9px 20px', borderRadius: '30px',
    boxShadow: '0 2px 14px rgba(200,26,39,0.1)',
    width: 'fit-content',
  },
  pulseDot: {
    width: '9px', height: '9px', borderRadius: '50%',
    background: RED, display: 'inline-block',
    animation: 'pulse 2s infinite',
    boxShadow: `0 0 8px ${RED}`,
    flexShrink: 0,
  },
  liveTxt: { fontSize: '0.83rem', color: '#555', fontWeight: '500' },
  heroH1: {
    fontSize: 'clamp(2.8rem, 5vw, 4.8rem)', fontWeight: '900',
    lineHeight: 1.1, color: '#1a0a0a', letterSpacing: '-0.03em',
    margin: 0,
  },
  heroAccent: {
    background: `linear-gradient(135deg, ${RED} 0%, #8b0000 50%, ${RED} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    animation: 'shimmer 3s linear infinite',
  },
  heroP: {
    fontSize: '1.08rem', color: '#666', lineHeight: 1.85,
    maxWidth: '520px', margin: 0,
  },
  heroBtns: { display: 'flex', gap: '14px', flexWrap: 'wrap' },
  btnPrimary: {
    background: `linear-gradient(135deg, ${RED}, #8b0000)`,
    color: '#fff', padding: '15px 34px', borderRadius: '12px',
    fontWeight: '700', fontSize: '1rem', textDecoration: 'none',
    boxShadow: '0 6px 24px rgba(200,26,39,0.35)',
    transition: 'all 0.2s ease',
  },
  btnSecondary: {
    background: '#fff', color: '#333',
    padding: '15px 34px', borderRadius: '12px',
    fontWeight: '600', fontSize: '1rem', textDecoration: 'none',
    border: '1px solid #e8d0d0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
  },
  trustRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  trustItem: { fontSize: '0.82rem', color: '#888', fontWeight: '500' },

  /* Stat cards */
  heroRight: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  statCard: {
    borderRadius: '18px', padding: '22px 20px',
    border: '1px solid transparent',
    display: 'flex', alignItems: 'center', gap: '14px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    transition: 'all 0.25s ease',
    animation: 'fadeUp 0.5s ease forwards',
  },
  statIcon: {
    width: '46px', height: '46px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  statNum: { fontSize: '1.8rem', fontWeight: '900', lineHeight: 1 },
  statLabel: { fontSize: '0.75rem', color: '#888', fontWeight: '500', marginTop: '3px' },

  /* Strip */
  strip: {
    display: 'flex', alignItems: 'center', gap: '20px',
    padding: '14px 40px', background: '#fff',
    borderTop: '1px solid #fde8e8', borderBottom: '1px solid #fde8e8',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  stripLabel: { fontSize: '0.68rem', color: '#bbb', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' },
  stripTypes: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  btPill: {
    background: '#fff0f0', color: RED,
    padding: '5px 16px', borderRadius: '30px', fontSize: '0.85rem',
    fontWeight: '800', border: `1px solid #fcc`,
    cursor: 'default', transition: 'all 0.2s ease',
  },

  /* Sections */
  section: { maxWidth: '1200px', margin: '0 auto', padding: '90px 40px' },
  sectionHead: { textAlign: 'center', marginBottom: '56px' },
  badge: {
    display: 'inline-block', fontSize: '0.68rem', fontWeight: '700',
    letterSpacing: '0.15em', color: RED, background: '#fff0f0',
    border: `1px solid #fcc`, padding: '5px 16px', borderRadius: '20px', marginBottom: '14px',
  },
  sectionH2: { fontSize: '2.1rem', fontWeight: '900', color: '#1a0a0a', marginBottom: '10px', letterSpacing: '-0.02em' },
  sectionSub: { color: '#777', fontSize: '0.98rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 },

  /* Features */
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' },
  featCard: {
    borderRadius: '20px', padding: '36px 28px',
    border: '1px solid transparent',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  featIconBox: {
    width: '54px', height: '54px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.5rem', marginBottom: '20px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
  },
  featTitle: { fontSize: '1.12rem', fontWeight: '800', marginBottom: '10px' },
  featDesc: { color: '#666', lineHeight: 1.75, fontSize: '0.9rem', marginBottom: '22px' },
  featCta: {
    display: 'inline-block', color: '#fff',
    padding: '10px 22px', borderRadius: '10px',
    fontWeight: '700', fontSize: '0.86rem', textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
  },

  /* How it works */
  howSection: {
    background: '#fff', borderTop: '1px solid #fde8e8', borderBottom: '1px solid #fde8e8',
    padding: '90px 40px',
  },
  howInner: { maxWidth: '1100px', margin: '0 auto' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '24px' },
  stepCard: {
    background: '#fff5f5', border: '1px solid #fde8e8',
    borderRadius: '18px', padding: '32px 24px', textAlign: 'center',
    transition: 'all 0.2s ease',
  },
  stepNum: {
    display: 'inline-block', fontSize: '0.7rem', fontWeight: '900',
    color: RED, background: '#fff0f0', border: `1px solid #fcc`,
    padding: '4px 12px', borderRadius: '20px', marginBottom: '14px',
    letterSpacing: '0.1em',
  },
  stepEmoji: { fontSize: '2.4rem', marginBottom: '14px' },
  stepTitle: { fontSize: '1.08rem', fontWeight: '800', color: '#1a0a0a', marginBottom: '8px' },
  stepDesc: { color: '#777', fontSize: '0.88rem', lineHeight: 1.7 },

  /* Urgency */
  urgencyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' },
  urgencyCard: {
    borderRadius: '16px', padding: '28px 22px', textAlign: 'center',
    border: '1px solid transparent',
    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
  },
  urgencyBadge: {
    display: 'inline-block', color: '#fff',
    padding: '6px 20px', borderRadius: '30px',
    fontWeight: '800', fontSize: '0.82rem', letterSpacing: '0.1em',
    marginBottom: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  urgencyDesc: { fontSize: '0.88rem', fontWeight: '600', margin: 0 },

  /* CTA */
  ctaWrap: { padding: '80px 40px', background: '#fff5f5' },
  ctaBanner: {
    maxWidth: '860px', margin: '0 auto',
    borderRadius: '24px', padding: '72px 48px',
    background: `linear-gradient(135deg, ${RED} 0%, #8b0000 100%)`,
    position: 'relative', overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(200,26,39,0.3)',
  },
  ctaOrb1: {
    position: 'absolute', top: '-80px', left: '-80px',
    width: '280px', height: '280px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
  },
  ctaOrb2: {
    position: 'absolute', bottom: '-80px', right: '-80px',
    width: '280px', height: '280px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
  },
  ctaH2: { fontSize: '2.2rem', fontWeight: '900', color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em' },
  ctaP: { color: 'rgba(255,255,255,0.85)', marginBottom: '36px', fontSize: '1.02rem', lineHeight: 1.7 },
  ctaBtnWhite: {
    display: 'inline-block', background: '#fff', color: RED,
    padding: '15px 36px', borderRadius: '12px',
    fontWeight: '800', fontSize: '1rem', textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  ctaBtnOutline: {
    display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff',
    padding: '15px 36px', borderRadius: '12px',
    fontWeight: '600', fontSize: '1rem', textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
  },

  /* Footer */
  footer: {
    background: '#fff', borderTop: '1px solid #fde8e8',
    padding: '48px 40px 32px',
  },
  footerInner: { maxWidth: '1200px', margin: '0 auto', textAlign: 'center' },
  footerBrand: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' },
  footerLogo: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #c81a27, #8b0000)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem',
  },
  footerName: { fontSize: '1.2rem', fontWeight: '800', color: '#1a0a0a' },
  footerTagline: { color: '#888', fontSize: '0.88rem', marginBottom: '24px' },
  footerLinks: { display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' },
  footerLink: { color: '#888', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' },
  footerCopy: { color: '#aaa', fontSize: '0.78rem' },
};
