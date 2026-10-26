import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI } from '../services/api';

const RED = '#c81a27';

const URGENCY = {
  LOW:      { color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0' },
  MEDIUM:   { color:'#d97706', bg:'#fffbeb', border:'#fde68a' },
  HIGH:     { color:'#ea580c', bg:'#fff7ed', border:'#fed7aa' },
  CRITICAL: { color:'#dc2626', bg:'#fef2f2', border:'#fecaca' },
};

const STATUS = {
  OPEN:      { color:'#16a34a', label:'● Open' },
  FULFILLED: { color:'#2563eb', label:'✓ Fulfilled' },
  CLOSED:    { color:'#64748b', label:'✕ Closed' },
};

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter]     = useState('OPEN');
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    const fn = filter === 'ALL' ? requestAPI.getAll() : requestAPI.getOpen();
    fn.then(r => setRequests(r.data)).finally(() => setLoading(false));
  }, [filter]);

  const filtered = requests.filter(r =>
    r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    r.hospital?.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <style>{`
        .req-search:focus { border-color: ${RED} !important; outline: none; box-shadow: 0 0 0 3px rgba(200,26,39,0.1); }
        .req-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(200,26,39,0.12) !important; }
        .call-btn:hover { background: #dcfce7 !important; }
      `}</style>

      <div style={s.header}>
        <div>
          <h1 style={s.title}>Emergency Requests</h1>
          <p style={s.sub}>{filtered.length} request{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/requests/new" style={s.newBtn}>+ Post Emergency</Link>
      </div>

      <div style={s.controls}>
        <div style={s.filterGroup}>
          {['OPEN','ALL'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}>
              {f === 'OPEN' ? '🔴 Open' : '📋 All'}
            </button>
          ))}
        </div>
        <input className="req-search" style={s.search} placeholder="🔍  Search by patient, hospital, city..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={s.grid}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={s.skeleton} />)}
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.length === 0 && (
            <div style={s.empty}>
              <span style={{ fontSize:'3rem' }}>🏥</span>
              <p>No requests found</p>
            </div>
          )}
          {filtered.map(req => {
            const urg = URGENCY[req.urgencyLevel] || URGENCY.MEDIUM;
            const sta = STATUS[req.status] || STATUS.OPEN;
            return (
              <div key={req.id} className="req-card" style={{ ...s.card, borderTop:`3px solid ${urg.color}` }}>
                <div style={s.cardHead}>
                  <span style={{ ...s.urgBadge, background:urg.bg, color:urg.color, border:`1px solid ${urg.border}` }}>
                    {req.urgencyLevel}
                  </span>
                  <span style={{ color:sta.color, fontSize:'0.8rem', fontWeight:'600' }}>{sta.label}</span>
                </div>
                <h3 style={s.patientName}>{req.patientName}</h3>
                <div style={s.bloodType}>{req.bloodType?.replace('_POS','+').replace('_NEG','−')}</div>
                <div style={s.infoList}>
                  <div style={s.infoRow}><span>🏥</span>{req.hospital}</div>
                  {req.city        && <div style={s.infoRow}><span>📍</span>{req.city}</div>}
                  {req.contactPhone && <div style={s.infoRow}><span>📞</span>{req.contactPhone}</div>}
                </div>
                {req.description && <p style={s.desc}>"{req.description}"</p>}
                <div style={s.cardFoot}>
                  <span style={s.date}>{new Date(req.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                  {req.status === 'OPEN' && req.contactPhone && (
                    <a href={`tel:${req.contactPhone}`} className="call-btn" style={s.callBtn}>📞 Call Now</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page:   { maxWidth:'1200px', margin:'0 auto', padding:'40px 24px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', flexWrap:'wrap', gap:'16px' },
  title:  { fontSize:'2rem', fontWeight:'800', color:'#1a0a0a', marginBottom:'4px' },
  sub:    { color:'#888', fontSize:'0.9rem' },
  newBtn: {
    display:'inline-block', background:`linear-gradient(135deg, ${RED}, #8b0000)`, color:'#fff',
    padding:'12px 24px', borderRadius:'10px', fontWeight:'700', fontSize:'0.9rem',
    boxShadow:'0 4px 16px rgba(200,26,39,0.3)', textDecoration:'none',
  },
  controls:    { display:'flex', gap:'12px', marginBottom:'28px', flexWrap:'wrap', alignItems:'center' },
  filterGroup: { display:'flex', gap:'6px' },
  filterBtn: {
    padding:'9px 18px', background:'#fff', border:'1px solid #fde8e8',
    color:'#888', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'0.85rem', transition:'all 0.2s',
  },
  filterActive: { background:'#fff0f0', border:`1px solid #fcc`, color:RED },
  search: {
    flex:1, minWidth:'240px', padding:'10px 16px',
    background:'#fff', border:'1px solid #fde8e8', borderRadius:'10px',
    color:'#1a0a0a', fontSize:'0.9rem', outline:'none', transition:'border-color 0.2s',
  },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'20px' },
  skeleton: {
    height:'240px', borderRadius:'16px',
    background:'linear-gradient(90deg,#fde8e8 25%,#fff0f0 50%,#fde8e8 75%)',
    backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite',
  },
  empty: { gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'#aaa', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' },
  card: {
    background:'#fff', border:'1px solid #fde8e8', borderRadius:'16px', padding:'22px',
    boxShadow:'0 2px 10px rgba(200,26,39,0.05)', transition:'transform 0.2s, box-shadow 0.2s',
  },
  cardHead:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' },
  urgBadge:    { padding:'4px 12px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:'700', letterSpacing:'0.05em' },
  patientName: { fontSize:'1.1rem', fontWeight:'700', color:'#1a0a0a', marginBottom:'10px' },
  bloodType: {
    display:'inline-block', background:'#fff0f0', color:RED,
    padding:'5px 16px', borderRadius:'20px', fontWeight:'800', fontSize:'1rem',
    marginBottom:'14px', border:`1px solid #fcc`,
  },
  infoList: { display:'flex', flexDirection:'column', gap:'6px', marginBottom:'12px' },
  infoRow:  { display:'flex', alignItems:'center', gap:'8px', color:'#555', fontSize:'0.88rem' },
  desc:     { color:'#888', fontSize:'0.85rem', fontStyle:'italic', marginBottom:'14px', lineHeight:1.5 },
  cardFoot: { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'14px', paddingTop:'14px', borderTop:'1px solid #fde8e8' },
  date:     { color:'#aaa', fontSize:'0.8rem' },
  callBtn:  { background:'#f0fdf4', color:'#16a34a', padding:'6px 14px', borderRadius:'8px', fontSize:'0.8rem', fontWeight:'600', border:'1px solid #bbf7d0', textDecoration:'none', transition:'all 0.2s' },
};
