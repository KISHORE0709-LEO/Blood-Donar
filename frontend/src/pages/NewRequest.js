import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestAPI } from '../services/api';

const RED = '#c81a27';
const BLOOD_TYPES = ['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'];
const BT_LABELS   = { A_POS:'A+', A_NEG:'A−', B_POS:'B+', B_NEG:'B−', AB_POS:'AB+', AB_NEG:'AB−', O_POS:'O+', O_NEG:'O−' };
const URGENCY_LEVELS = [
  { value:'LOW',      label:'Low',      color:'#16a34a', desc:'Needed within a week' },
  { value:'MEDIUM',   label:'Medium',   color:'#d97706', desc:'Needed within 2-3 days' },
  { value:'HIGH',     label:'High',     color:'#ea580c', desc:'Needed within 24 hours' },
  { value:'CRITICAL', label:'Critical', color:'#dc2626', desc:'Needed immediately' },
];

export default function NewRequest() {
  const [form, setForm] = useState({ patientName:'', bloodType:'', urgencyLevel:'MEDIUM', hospital:'', city:'', contactPhone:'', description:'' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bloodType) { toast.error('Please select a blood type'); return; }
    setLoading(true);
    try {
      await requestAPI.create(form);
      toast.success('Emergency request posted!');
      navigate('/requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <style>{`
        .nr-input:focus { border-color: ${RED} !important; box-shadow: 0 0 0 3px rgba(200,26,39,0.1) !important; outline: none; }
        .blood-btn:hover { border-color: ${RED} !important; background: #fff0f0 !important; color: ${RED} !important; }
        .urg-btn:hover { border-color: #888 !important; background: #f8f8f8 !important; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(200,26,39,0.4) !important; }
      `}</style>

      <div style={s.container}>
        <div style={s.pageHeader}>
          <h1 style={s.title}>Post Emergency Request</h1>
          <p style={s.sub}>Fill in the details to alert available donors immediately</p>
        </div>

        <div style={s.card}>
          <form onSubmit={handleSubmit} style={s.form}>

            <div style={s.section}>
              <h3 style={s.sectionTitle}>Patient Information</h3>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Patient Name *</label>
                  <input className="nr-input" style={s.input} placeholder="Full name" value={form.patientName} onChange={set('patientName')} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Contact Phone</label>
                  <input className="nr-input" style={s.input} placeholder="+91 9999999999" value={form.contactPhone} onChange={set('contactPhone')} />
                </div>
              </div>
            </div>

            <div style={s.section}>
              <h3 style={s.sectionTitle}>Blood Type Required *</h3>
              <div style={s.bloodGrid}>
                {BLOOD_TYPES.map(bt => (
                  <button key={bt} type="button" className="blood-btn"
                    onClick={() => setForm({ ...form, bloodType: bt })}
                    style={{ ...s.bloodBtn, ...(form.bloodType === bt ? s.bloodBtnActive : {}) }}>
                    {BT_LABELS[bt]}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.section}>
              <h3 style={s.sectionTitle}>Urgency Level</h3>
              <div style={s.urgencyGrid}>
                {URGENCY_LEVELS.map(u => (
                  <button key={u.value} type="button" className="urg-btn"
                    onClick={() => setForm({ ...form, urgencyLevel: u.value })}
                    style={{ ...s.urgBtn, ...(form.urgencyLevel === u.value ? { borderColor:u.color, color:u.color, background:u.color+'10' } : {}) }}>
                    <span style={{ fontWeight:'700', fontSize:'0.95rem' }}>{u.label}</span>
                    <span style={{ fontSize:'0.75rem', color:'#888' }}>{u.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={s.section}>
              <h3 style={s.sectionTitle}>Hospital Details</h3>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Hospital Name *</label>
                  <input className="nr-input" style={s.input} placeholder="e.g. Apollo Hospital" value={form.hospital} onChange={set('hospital')} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>City</label>
                  <input className="nr-input" style={s.input} placeholder="e.g. Mumbai" value={form.city} onChange={set('city')} />
                </div>
              </div>
              <div style={{ ...s.field, marginTop:'12px' }}>
                <label style={s.label}>Additional Notes</label>
                <textarea className="nr-input" style={{ ...s.input, height:'90px', resize:'vertical' }}
                  placeholder="Any additional information..." value={form.description} onChange={set('description')} />
              </div>
            </div>

            <button className="submit-btn" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Posting...' : '🚨 Post Emergency Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight:'100vh', padding:'40px 24px', background:'#fff5f5' },
  container:  { maxWidth:'720px', margin:'0 auto' },
  pageHeader: { marginBottom:'28px' },
  title:      { fontSize:'2rem', fontWeight:'800', color:'#1a0a0a', marginBottom:'6px' },
  sub:        { color:'#888', fontSize:'0.95rem' },
  card:       { background:'#fff', border:'1px solid #fde8e8', borderRadius:'20px', padding:'36px', boxShadow:'0 4px 20px rgba(200,26,39,0.07)' },
  form:       { display:'flex', flexDirection:'column', gap:'0' },
  section:    { marginBottom:'28px', paddingBottom:'28px', borderBottom:'1px solid #fde8e8' },
  sectionTitle:{ fontSize:'0.85rem', fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'14px' },
  row:        { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
  field:      { display:'flex', flexDirection:'column', gap:'7px' },
  label:      { fontSize:'0.8rem', fontWeight:'600', color:'#888' },
  input: {
    padding:'12px 14px', background:'#fafafa',
    border:'1.5px solid #f0e0e0', borderRadius:'10px',
    color:'#1a0a0a', fontSize:'0.9rem', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
  },
  bloodGrid:     { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px' },
  bloodBtn:      { padding:'12px', background:'#fafafa', border:'1.5px solid #f0e0e0', borderRadius:'10px', color:'#888', fontWeight:'800', cursor:'pointer', fontSize:'1rem', transition:'all 0.2s' },
  bloodBtnActive:{ background:'#fff0f0', border:`1.5px solid ${RED}`, color:RED, boxShadow:'0 0 0 3px rgba(200,26,39,0.1)' },
  urgencyGrid:   { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px' },
  urgBtn:        { padding:'14px', background:'#fafafa', border:'1.5px solid #f0e0e0', borderRadius:'10px', color:'#555', cursor:'pointer', display:'flex', flexDirection:'column', gap:'4px', textAlign:'left', transition:'all 0.2s' },
  btn: {
    padding:'15px', background:`linear-gradient(135deg, ${RED}, #8b0000)`,
    color:'#fff', border:'none', borderRadius:'12px',
    fontSize:'1rem', fontWeight:'700', cursor:'pointer',
    boxShadow:'0 6px 20px rgba(200,26,39,0.3)', marginTop:'4px', transition:'all 0.2s',
  },
};
