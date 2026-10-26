import React, { useEffect, useState } from 'react';
import { donorAPI } from '../services/api';

const RED = '#c81a27';
const BLOOD_TYPES = ['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'];
const BT_LABELS   = { A_POS:'A+', A_NEG:'A−', B_POS:'B+', B_NEG:'B−', AB_POS:'AB+', AB_NEG:'AB−', O_POS:'O+', O_NEG:'O−' };
const BT_COLORS   = ['#c81a27','#e05c8a','#7c3aed','#2563eb','#059669','#d97706','#ea580c','#0891b2'];

export default function Donors() {
  const [donors, setDonors]       = useState([]);
  const [bloodType, setBloodType] = useState('');
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  const fetchDonors = async (bt) => {
    setLoading(true);
    try {
      const { data } = bt ? await donorAPI.searchByBlood(bt) : await donorAPI.getAvailable();
      setDonors(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDonors(''); }, []);

  const handleBT = (bt) => {
    const val = bt === bloodType ? '' : bt;
    setBloodType(val);
    fetchDonors(val);
  };

  const filtered = donors.filter(d =>
    d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    d.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <style>{`
        .donor-search:focus { border-color: ${RED} !important; outline: none; box-shadow: 0 0 0 3px rgba(200,26,39,0.1); }
        .bt-btn:hover { border-color: ${RED} !important; color: ${RED} !important; background: #fff0f0 !important; }
        .donor-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(200,26,39,0.12) !important; }
        .contact-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={s.header}>
        <div>
          <h1 style={s.title}>Find Donors</h1>
          <p style={s.sub}>{filtered.length} available donor{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <input className="donor-search" style={s.search} placeholder="🔍  Search by name or city..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={s.btFilter}>
        <button className="bt-btn" onClick={() => handleBT('')}
          style={{ ...s.btBtn, ...(bloodType === '' ? s.btBtnActive : {}) }}>
          All Types
        </button>
        {BLOOD_TYPES.map((bt, i) => (
          <button key={bt} className="bt-btn" onClick={() => handleBT(bt)}
            style={{ ...s.btBtn, ...(bloodType === bt ? { background: BT_COLORS[i] + '15', border:`1px solid ${BT_COLORS[i]}`, color:BT_COLORS[i] } : {}) }}>
            {BT_LABELS[bt]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.grid}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={s.skeleton} />)}
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.length === 0 && (
            <div style={s.empty}>
              <span style={{ fontSize:'3rem' }}>👥</span>
              <p>No donors found</p>
            </div>
          )}
          {filtered.map((donor, i) => {
            const idx   = BLOOD_TYPES.indexOf(donor.bloodType);
            const color = BT_COLORS[idx >= 0 ? idx : 0];
            return (
              <div key={donor.id} className="donor-card" style={{ ...s.card, borderTop:`3px solid ${color}` }}>
                <div style={s.cardTop}>
                  <div style={{ ...s.avatar, background:color+'15', color }}>
                    {donor.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{
                    ...s.availBadge,
                    background: donor.available ? '#f0fdf4' : '#fef2f2',
                    color:      donor.available ? '#16a34a' : '#dc2626',
                    border:     `1px solid ${donor.available ? '#bbf7d0' : '#fecaca'}`,
                  }}>
                    {donor.available ? '● Available' : '○ Unavailable'}
                  </div>
                </div>
                <h3 style={s.name}>{donor.fullName}</h3>
                <div style={{ ...s.bloodBadge, background:color+'15', color, border:`1px solid ${color}40` }}>
                  {BT_LABELS[donor.bloodType] || donor.bloodType?.replace('_',' ')}
                </div>
                <div style={s.infoList}>
                  {donor.city  && <span style={s.infoItem}>📍 {donor.city}</span>}
                  {donor.phone && <span style={s.infoItem}>📞 {donor.phone}</span>}
                </div>
                {donor.available && donor.phone && (
                  <a href={`tel:${donor.phone}`} className="contact-btn"
                    style={{ ...s.contactBtn, borderColor:color+'60', color, background:color+'10' }}>
                    Contact Donor
                  </a>
                )}
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
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'16px' },
  title:  { fontSize:'2rem', fontWeight:'800', color:'#1a0a0a', marginBottom:'4px' },
  sub:    { color:'#888', fontSize:'0.9rem' },
  search: {
    padding:'10px 16px', background:'#fff', border:'1px solid #fde8e8',
    borderRadius:'10px', color:'#1a0a0a', fontSize:'0.9rem', outline:'none',
    minWidth:'260px', transition:'border-color 0.2s',
  },
  btFilter: { display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'28px' },
  btBtn: {
    padding:'8px 16px', background:'#fff', border:'1px solid #fde8e8',
    borderRadius:'8px', color:'#888', cursor:'pointer', fontWeight:'700',
    fontSize:'0.85rem', transition:'all 0.2s',
  },
  btBtnActive: { background:'#fff0f0', border:`1px solid #fcc`, color:RED },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'20px' },
  skeleton: {
    height:'220px', borderRadius:'16px',
    background:'linear-gradient(90deg,#fde8e8 25%,#fff0f0 50%,#fde8e8 75%)',
    backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite',
  },
  empty: { gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'#aaa', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' },
  card: {
    background:'#fff', border:'1px solid #fde8e8', borderRadius:'16px', padding:'22px',
    boxShadow:'0 2px 10px rgba(200,26,39,0.05)', transition:'transform 0.2s, box-shadow 0.2s',
  },
  cardTop:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' },
  avatar:     { width:'48px', height:'48px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', fontWeight:'800' },
  availBadge: { padding:'4px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'600' },
  name:       { fontSize:'1.05rem', fontWeight:'700', color:'#1a0a0a', marginBottom:'10px' },
  bloodBadge: { display:'inline-block', padding:'4px 14px', borderRadius:'20px', fontWeight:'800', fontSize:'0.95rem', marginBottom:'12px' },
  infoList:   { display:'flex', flexDirection:'column', gap:'5px', marginBottom:'14px' },
  infoItem:   { color:'#666', fontSize:'0.85rem' },
  contactBtn: { display:'block', textAlign:'center', textDecoration:'none', padding:'9px', border:'1px solid', borderRadius:'8px', fontWeight:'600', fontSize:'0.85rem', transition:'opacity 0.2s' },
};
