import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { requestAPI, donationAPI, donorAPI } from '../services/api';

const RED = '#c81a27';

export default function Dashboard() {
  const { user } = useAuth();
  const [myRequests, setMyRequests]     = useState([]);
  const [myDonations, setMyDonations]   = useState([]);
  const [donationCount, setDonationCount] = useState(0);
  const [available, setAvailable]       = useState(user?.available ?? true);
  const [donateForm, setDonateForm]     = useState({ requestId:'', hospital:'', notes:'' });
  const [openRequests, setOpenRequests] = useState([]);
  const [activeTab, setActiveTab]       = useState('overview');
  const [savingDonation, setSavingDonation] = useState(false);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState(null);

  const refreshDashboard = useCallback(async (reportErrors = false) => {
    const results = await Promise.allSettled([
      requestAPI.getMy(),
      donationAPI.getMy(),
      donationAPI.getCount(),
      requestAPI.getOpen(),
    ]);

    if (results[0].status === 'fulfilled') setMyRequests(results[0].value.data);
    if (results[1].status === 'fulfilled') setMyDonations(results[1].value.data);
    if (results[2].status === 'fulfilled') setDonationCount(results[2].value.data);
    if (results[3].status === 'fulfilled') setOpenRequests(results[3].value.data);

    if (reportErrors && results.some(result => result.status === 'rejected')) {
      toast.error('Some dashboard information could not be loaded. Please refresh.');
    }
  }, []);

  useEffect(() => {
    refreshDashboard(true);
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshDashboard(false);
    }, 15000);
    return () => window.clearInterval(refreshTimer);
  }, [refreshDashboard, user?.id]);

  const handleToggle = async () => {
    setTogglingAvailability(true);
    try {
      const { data } = await donorAPI.toggleAvailability();
      setAvailable(data.available);
      toast.success(`Status: ${data.available ? 'Available ✅' : 'Unavailable ❌'}`);
    } catch { toast.error('Failed to update availability'); }
    finally { setTogglingAvailability(false); }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setSavingDonation(true);
    try {
      await donationAPI.donate({ ...donateForm, requestId: donateForm.requestId ? Number(donateForm.requestId) : null });
      toast.success('Donation recorded! Thank you 🩸');
      setDonateForm({ requestId:'', hospital:'', notes:'' });
      await refreshDashboard(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record donation');
    } finally { setSavingDonation(false); }
  };

  const btLabel = user?.bloodType?.replace('_POS','+').replace('_NEG','−') || '—';

  const tabs = [
    { id:'overview', label:'Overview', icon:'📊' },
    { id:'donate',   label:'Record Donation', icon:'💉' },
    { id:'requests', label:'My Requests', icon:'📋' },
    { id:'history',  label:'History', icon:'📅' },
  ];

  return (
    <div style={s.page}>
      <style>{`
        .dash-input:focus { border-color: ${RED} !important; box-shadow: 0 0 0 3px rgba(200,26,39,0.1) !important; outline: none; }
        .dash-input option { background: #fff; color: #1a0a0a; }
        .dash-tab:hover { background: #fff0f0 !important; color: ${RED} !important; }
        .dash-toggle:hover { opacity: 0.85; }
        .fulfill-btn:hover { background: #dbeafe !important; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,26,39,0.35) !important; }
      `}</style>

      {/* Banner */}
      <div style={s.banner}>
        <div style={s.bannerLeft}>
          <div style={s.avatarLg}>{user?.fullName?.charAt(0).toUpperCase()}</div>
          <div>
            <p style={s.greet}>Good to see you back 👋</p>
            <h2 style={s.name}>{user?.fullName}</h2>
            <div style={s.meta}>
              <span style={s.bloodBadge}>🩸 {btLabel}</span>
              <span style={s.roleBadge}>{user?.role}</span>
            </div>
          </div>
        </div>
        <div style={s.bannerStats}>
          {[
            { num: donationCount,       label: 'Donations',   icon: '💉', color: RED },
            { num: myRequests.length,   label: 'Requests',    icon: '📋', color: '#2563eb' },
            { num: openRequests.length, label: 'Open Alerts', icon: '🚨', color: '#d97706' },
          ].map((st, i) => (
            <div key={i} style={s.statBox}>
              <div style={{ ...s.statIcon, background: st.color + '15', border: `1px solid ${st.color}30` }}>{st.icon}</div>
              <span style={{ ...s.statNum, color: st.color }}>{st.num}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div style={s.availCard}>
        <div style={s.availLeft}>
          <div style={{ ...s.dot, background: available ? '#10b981' : RED, animation: available ? 'glow 2s infinite' : 'glowRed 2s infinite' }} />
          <div>
            <p style={s.availTitle}>Donation Availability</p>
            <p style={{ ...s.availStatus, color: available ? '#10b981' : RED }}>
              {available ? '✅ You are available for donation' : '❌ You are currently unavailable'}
            </p>
          </div>
        </div>
        <button className="dash-toggle" onClick={handleToggle} disabled={togglingAvailability} style={{
          ...s.toggleBtn,
          background: available ? '#fff0f0' : '#f0fdf4',
          color: available ? RED : '#10b981',
          border: `1px solid ${available ? '#fcc' : '#bbf7d0'}`,
        }}>
          {togglingAvailability ? 'Updating…' : available ? 'Mark Unavailable' : 'Mark Available'}
        </button>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.id} className="dash-tab" onClick={() => setActiveTab(t.id)}
            style={{ ...s.tab, ...(activeTab === t.id ? s.tabActive : {}) }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div style={s.grid3}>
          <div style={s.card}>
            <div style={s.cardHead}>
              <h3 style={s.cardTitle}>Recent Requests</h3>
              <Link to="/requests/new" style={s.cardBtn}>+ New</Link>
            </div>
            {myRequests.length === 0 ? <p style={s.empty}>No requests yet</p> :
              myRequests.slice(0,4).map(r => (
                <div key={r.id} style={s.row}>
                  <div>
                    <p style={s.rowMain}>{r.patientName}</p>
                    <p style={s.rowSub}>{r.bloodType?.replace('_POS','+').replace('_NEG','−')} · {r.hospital}</p>
                  </div>
                  <span style={{ ...s.pill, ...statusStyle(r.status) }}>{r.status}</span>
                </div>
              ))
            }
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>Recent Donations</h3>
            {myDonations.length === 0 ? <p style={s.empty}>No donations yet</p> :
              myDonations.slice(0,4).map(d => (
                <div key={d.id} style={s.row}>
                  <div>
                    <p style={s.rowMain}>{d.hospital || 'Unknown Hospital'}</p>
                    <p style={s.rowSub}>{d.notes || 'No notes'}</p>
                  </div>
                  <span style={s.dateText}>{new Date(d.donatedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                </div>
              ))
            }
          </div>

          <div style={s.card}>
            <div style={s.cardHead}>
              <h3 style={s.cardTitle}>🚨 Open Emergencies</h3>
              <Link to="/requests" style={s.cardLink}>View All →</Link>
            </div>
            {openRequests.length === 0 ? <p style={s.empty}>No open requests</p> :
              openRequests.slice(0,4).map(r => (
                <div key={r.id} style={s.row}>
                  <div>
                    <p style={s.rowMain}>{r.patientName}</p>
                    <p style={s.rowSub}>{r.bloodType?.replace('_POS','+').replace('_NEG','−')} · {r.city}</p>
                  </div>
                  <span style={{ ...s.pill, ...urgStyle(r.urgencyLevel) }}>{r.urgencyLevel}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Record Donation */}
      {activeTab === 'donate' && (
        <div style={s.formCard}>
          <div style={s.formHead}>
            <div style={s.formIcon}>💉</div>
            <div>
              <h3 style={s.formTitle}>Record a Donation</h3>
              <p style={s.formSub}>Log your blood donation and link it to an emergency request</p>
            </div>
          </div>
          <form onSubmit={handleDonate} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Link to Emergency Request (optional)</label>
              <select style={s.input} className="dash-input" value={donateForm.requestId}
                onChange={e => setDonateForm({ ...donateForm, requestId: e.target.value })}>
                <option value="">No linked request</option>
                {openRequests.map(r => (
                  <option key={r.id} value={r.id}>
                    #{r.id} — {r.patientName} ({r.bloodType?.replace('_POS','+').replace('_NEG','−')}) · {r.hospital}
                  </option>
                ))}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Hospital *</label>
              <input style={s.input} className="dash-input" placeholder="Where did you donate?" value={donateForm.hospital}
                onChange={e => setDonateForm({ ...donateForm, hospital: e.target.value })} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Notes</label>
              <input style={s.input} className="dash-input" placeholder="Any additional notes..." value={donateForm.notes}
                onChange={e => setDonateForm({ ...donateForm, notes: e.target.value })} />
            </div>
            <button className="submit-btn" style={{ ...s.submitBtn, opacity:savingDonation ? 0.7 : 1 }} type="submit" disabled={savingDonation}>
              {savingDonation ? 'Saving…' : '🩸 Record Donation'}
            </button>
          </form>
        </div>
      )}

      {/* My Requests */}
      {activeTab === 'requests' && (
        <div style={s.listCard}>
          <div style={s.listHead}>
            <h3 style={s.formTitle}>My Emergency Requests</h3>
            <Link to="/requests/new" style={s.addBtn}>+ New Request</Link>
          </div>
          {myRequests.length === 0 ? <p style={s.empty}>No requests posted yet.</p> :
            myRequests.map(r => (
              <div key={r.id} style={s.row}>
                <div style={{ flex: 1 }}>
                  <p style={s.rowMain}>{r.patientName} — <span style={{ color: RED }}>{r.bloodType?.replace('_POS','+').replace('_NEG','−')}</span></p>
                  <p style={s.rowSub}>🏥 {r.hospital} · 📍 {r.city} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ ...s.pill, ...statusStyle(r.status) }}>{r.status}</span>
                  {r.status === 'OPEN' && (
                    <button className="fulfill-btn" disabled={updatingRequestId === r.id} onClick={async () => {
                      setUpdatingRequestId(r.id);
                      try {
                        await requestAPI.updateStatus(r.id, 'FULFILLED');
                        await refreshDashboard(false);
                        toast.success('Marked as fulfilled');
                      } catch (err) { toast.error(err.response?.data?.message || 'Failed to update request'); }
                      finally { setUpdatingRequestId(null); }
                    }} style={s.fulfillBtn}>Mark Fulfilled</button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div style={s.listCard}>
          <div style={s.listHead}>
            <h3 style={s.formTitle}>Donation History</h3>
            <span style={s.countBadge}>🩸 {donationCount} total</span>
          </div>
          {myDonations.length === 0 ? <p style={s.empty}>No donations recorded yet.</p> :
            myDonations.map(d => (
              <div key={d.id} style={s.row}>
                <span style={{ fontSize:'1.3rem', marginRight:'8px' }}>💉</span>
                <div style={{ flex: 1 }}>
                  <p style={s.rowMain}>{d.hospital || 'Unknown Hospital'}</p>
                  <p style={s.rowSub}>{d.notes || 'No notes'}{d.request ? ` · Linked to Request #${d.request.id}` : ''}</p>
                </div>
                <span style={s.dateText}>{new Date(d.donatedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

function statusStyle(status) {
  if (status === 'OPEN')      return { color:'#16a34a', background:'#f0fdf4', border:'1px solid #bbf7d0' };
  if (status === 'FULFILLED') return { color:'#2563eb', background:'#eff6ff', border:'1px solid #bfdbfe' };
  return { color:'#64748b', background:'#f1f5f9', border:'1px solid #e2e8f0' };
}

function urgStyle(level) {
  if (level === 'CRITICAL') return { color:'#dc2626', background:'#fef2f2', border:'1px solid #fecaca' };
  if (level === 'HIGH')     return { color:'#ea580c', background:'#fff7ed', border:'1px solid #fed7aa' };
  if (level === 'MEDIUM')   return { color:'#d97706', background:'#fffbeb', border:'1px solid #fde68a' };
  return { color:'#16a34a', background:'#f0fdf4', border:'1px solid #bbf7d0' };
}

const s = {
  page: { maxWidth:'1100px', margin:'0 auto', padding:'40px 24px' },

  banner: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    flexWrap:'wrap', gap:'24px',
    background:'linear-gradient(135deg, #c81a27 0%, #8b0000 100%)',
    borderRadius:'20px', padding:'32px 36px', marginBottom:'20px',
    boxShadow:'0 8px 32px rgba(200,26,39,0.25)',
  },
  bannerLeft: { display:'flex', alignItems:'center', gap:'18px' },
  avatarLg: {
    width:'64px', height:'64px', borderRadius:'16px',
    background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.3)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'1.6rem', fontWeight:'900', color:'#fff', flexShrink:0,
  },
  greet: { color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', marginBottom:'4px' },
  name:  { fontSize:'1.5rem', fontWeight:'900', color:'#fff', marginBottom:'8px' },
  meta:  { display:'flex', gap:'8px', alignItems:'center' },
  bloodBadge: { background:'rgba(255,255,255,0.2)', color:'#fff', padding:'3px 12px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'700', border:'1px solid rgba(255,255,255,0.3)' },
  roleBadge:  { background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.85)', padding:'3px 12px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'600', border:'1px solid rgba(255,255,255,0.2)' },
  bannerStats: { display:'flex', gap:'20px', flexWrap:'wrap' },
  statBox: { display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' },
  statIcon: { width:'40px', height:'40px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', marginBottom:'4px' },
  statNum:  { fontSize:'1.8rem', fontWeight:'900', lineHeight:1, color:'#fff' },
  statLabel:{ fontSize:'0.72rem', color:'rgba(255,255,255,0.7)', fontWeight:'500', textTransform:'uppercase', letterSpacing:'0.06em' },

  availCard: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    background:'#fff', border:'1px solid #fde8e8', borderRadius:'14px',
    padding:'18px 24px', marginBottom:'20px', flexWrap:'wrap', gap:'12px',
    boxShadow:'0 2px 10px rgba(200,26,39,0.06)',
  },
  availLeft:   { display:'flex', alignItems:'center', gap:'14px' },
  dot:         { width:'14px', height:'14px', borderRadius:'50%', flexShrink:0 },
  availTitle:  { fontWeight:'700', color:'#1a0a0a', fontSize:'0.95rem', marginBottom:'3px' },
  availStatus: { fontSize:'0.85rem', fontWeight:'500' },
  toggleBtn:   { padding:'10px 22px', borderRadius:'10px', cursor:'pointer', fontWeight:'700', fontSize:'0.85rem', transition:'all 0.2s' },

  tabs: { display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' },
  tab: {
    display:'flex', alignItems:'center', gap:'6px',
    padding:'10px 20px', background:'#fff',
    border:'1px solid #fde8e8', borderRadius:'10px',
    color:'#888', cursor:'pointer', fontWeight:'600', fontSize:'0.85rem',
    transition:'all 0.2s',
  },
  tabActive: { background:'#fff0f0', border:`1px solid #fcc`, color: RED, fontWeight:'700' },

  grid3: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' },
  card: { background:'#fff', border:'1px solid #fde8e8', borderRadius:'16px', padding:'24px', boxShadow:'0 2px 10px rgba(200,26,39,0.05)' },
  cardHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' },
  cardTitle: { fontSize:'0.8rem', fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:'0.1em' },
  cardBtn:  { background:'#fff0f0', color:RED, padding:'4px 12px', borderRadius:'8px', fontSize:'0.78rem', fontWeight:'700', border:`1px solid #fcc`, textDecoration:'none' },
  cardLink: { color:RED, fontSize:'0.82rem', fontWeight:'600', textDecoration:'none' },

  row: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #fde8e8', gap:'12px' },
  rowMain: { color:'#1a0a0a', fontWeight:'600', fontSize:'0.9rem', marginBottom:'3px' },
  rowSub:  { color:'#888', fontSize:'0.78rem' },
  dateText:{ color:'#aaa', fontSize:'0.78rem', whiteSpace:'nowrap' },
  pill:    { padding:'4px 12px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:'700', whiteSpace:'nowrap' },
  empty:   { color:'#aaa', fontSize:'0.88rem', padding:'16px 0' },

  formCard: { background:'#fff', border:'1px solid #fde8e8', borderRadius:'20px', padding:'32px', maxWidth:'580px', boxShadow:'0 2px 10px rgba(200,26,39,0.05)' },
  formHead: { display:'flex', alignItems:'center', gap:'16px', marginBottom:'28px' },
  formIcon: {
    width:'52px', height:'52px', borderRadius:'14px',
    background:`linear-gradient(135deg, ${RED}, #8b0000)`,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'1.5rem', flexShrink:0, boxShadow:'0 4px 16px rgba(200,26,39,0.3)',
  },
  formTitle: { fontSize:'1.05rem', fontWeight:'800', color:'#1a0a0a', marginBottom:'4px' },
  formSub:   { color:'#888', fontSize:'0.82rem' },
  form:  { display:'flex', flexDirection:'column', gap:'18px' },
  field: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontSize:'0.78rem', fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:'0.06em' },
  input: {
    padding:'12px 16px', background:'#fafafa',
    border:'1.5px solid #f0e0e0', borderRadius:'10px',
    color:'#1a0a0a', fontSize:'0.9rem', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
  },
  submitBtn: {
    padding:'14px', background:`linear-gradient(135deg, ${RED}, #8b0000)`,
    color:'#fff', border:'none', borderRadius:'12px',
    fontWeight:'700', cursor:'pointer', fontSize:'0.95rem',
    boxShadow:'0 6px 20px rgba(200,26,39,0.3)', marginTop:'4px', transition:'all 0.2s',
  },

  listCard: { background:'#fff', border:'1px solid #fde8e8', borderRadius:'20px', padding:'28px', boxShadow:'0 2px 10px rgba(200,26,39,0.05)' },
  listHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
  addBtn: {
    background:`linear-gradient(135deg, ${RED}, #8b0000)`, color:'#fff',
    padding:'9px 20px', borderRadius:'10px', fontWeight:'700', fontSize:'0.85rem',
    border:'none', textDecoration:'none', boxShadow:'0 4px 14px rgba(200,26,39,0.25)',
  },
  countBadge: { background:'#fff0f0', color:RED, padding:'6px 16px', borderRadius:'20px', fontSize:'0.85rem', fontWeight:'700', border:`1px solid #fcc` },
  fulfillBtn: {
    background:'#eff6ff', color:'#2563eb', padding:'5px 12px', borderRadius:'8px',
    fontWeight:'700', fontSize:'0.78rem', border:'1px solid #bfdbfe', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s',
  },
};
