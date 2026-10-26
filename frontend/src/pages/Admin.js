import React, { useEffect, useState } from 'react';
import { adminAPI, requestAPI } from '../services/api';

const RED = '#c81a27';

export default function Admin() {
  const [stats, setStats]       = useState({});
  const [users, setUsers]       = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tab, setTab]           = useState('overview');

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data)).catch(() => {});
    adminAPI.getUsers().then(r => setUsers(r.data)).catch(() => {});
    adminAPI.getDonations().then(r => setDonations(r.data)).catch(() => {});
    requestAPI.getAll().then(r => setRequests(r.data)).catch(() => {});
  }, []);

  const statCards = [
    { label:'Total Users',     value:stats.totalUsers,     icon:'👥', color:'#7c3aed' },
    { label:'Total Donations', value:stats.totalDonations, icon:'💉', color:RED },
    { label:'Open Requests',   value:stats.openRequests,   icon:'🚨', color:'#dc2626' },
    { label:'Total Requests',  value:stats.totalRequests,  icon:'📋', color:'#2563eb' },
  ];

  const tabs = [
    { id:'overview',  label:'Overview' },
    { id:'users',     label:`Users (${users.length})` },
    { id:'donations', label:`Donations (${donations.length})` },
    { id:'requests',  label:`Requests (${requests.length})` },
  ];

  return (
    <div style={s.page}>
      <style>{`
        .admin-tr:hover { background: #fff5f5 !important; }
        .admin-tab:hover { background: #fff0f0 !important; color: ${RED} !important; }
      `}</style>

      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.sub}>System overview and management</p>
        </div>
        <div style={s.adminBadge}>⚙️ Administrator</div>
      </div>

      <div style={s.statsGrid}>
        {statCards.map((sc, i) => (
          <div key={i} style={{ ...s.statCard, borderTop:`3px solid ${sc.color}` }}>
            <div style={s.statTop}>
              <span style={{ ...s.statIcon, background:sc.color+'15', color:sc.color }}>{sc.icon}</span>
            </div>
            <div style={{ ...s.statNum, color:sc.color }}>{sc.value ?? '—'}</div>
            <div style={s.statLabel}>{sc.label}</div>
          </div>
        ))}
      </div>

      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.id} className="admin-tab" onClick={() => setTab(t.id)}
            style={{ ...s.tab, ...(tab === t.id ? s.tabActive : {}) }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={s.overviewGrid}>
          <div style={s.overCard}>
            <h3 style={s.overTitle}>Recent Users</h3>
            {users.slice(0,5).map(u => (
              <div key={u.id} style={s.row}>
                <div style={s.rowAvatar}>{u.fullName?.charAt(0)}</div>
                <div style={{ flex:1 }}>
                  <p style={s.rowMain}>{u.fullName}</p>
                  <p style={s.rowSub}>{u.email}</p>
                </div>
                <span style={{ ...s.badge, background:u.role==='ADMIN'?'#f3f0ff':'#f0fdf4', color:u.role==='ADMIN'?'#7c3aed':'#16a34a', border:`1px solid ${u.role==='ADMIN'?'#ddd6fe':'#bbf7d0'}` }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
          <div style={s.overCard}>
            <h3 style={s.overTitle}>Recent Requests</h3>
            {requests.slice(0,5).map(r => (
              <div key={r.id} style={s.row}>
                <div style={{ ...s.rowAvatar, background:r.urgencyLevel==='CRITICAL'?'#fef2f2':'#fffbeb', color:r.urgencyLevel==='CRITICAL'?'#dc2626':'#d97706' }}>🚨</div>
                <div style={{ flex:1 }}>
                  <p style={s.rowMain}>{r.patientName}</p>
                  <p style={s.rowSub}>{r.bloodType?.replace('_POS','+').replace('_NEG','−')} · {r.hospital}</p>
                </div>
                <span style={{ ...s.badge, background:r.status==='OPEN'?'#f0fdf4':'#f1f5f9', color:r.status==='OPEN'?'#16a34a':'#64748b', border:`1px solid ${r.status==='OPEN'?'#bbf7d0':'#e2e8f0'}` }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr style={s.thead}>
              {['#','Name','Email','Blood Type','Role','City','Available'].map(h => <th key={h} style={s.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="admin-tr" style={s.tr}>
                  <td style={s.tdMuted}>{u.id}</td>
                  <td style={s.tdBold}>{u.fullName}</td>
                  <td style={s.tdMuted}>{u.email}</td>
                  <td style={s.td}>{u.bloodType && <span style={s.btPill}>{u.bloodType.replace('_POS','+').replace('_NEG','−')}</span>}</td>
                  <td style={s.td}><span style={{ ...s.badge, background:u.role==='ADMIN'?'#f3f0ff':'#f0fdf4', color:u.role==='ADMIN'?'#7c3aed':'#16a34a', border:`1px solid ${u.role==='ADMIN'?'#ddd6fe':'#bbf7d0'}` }}>{u.role}</span></td>
                  <td style={s.tdMuted}>{u.city || '—'}</td>
                  <td style={s.td}>{u.available ? <span style={s.yes}>✓ Yes</span> : <span style={s.no}>✕ No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'donations' && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr style={s.thead}>
              {['#','Donor','Hospital','Linked Request','Date'].map(h => <th key={h} style={s.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} className="admin-tr" style={s.tr}>
                  <td style={s.tdMuted}>{d.id}</td>
                  <td style={s.tdBold}>{d.donor?.fullName}</td>
                  <td style={s.tdMuted}>{d.hospital || '—'}</td>
                  <td style={s.tdMuted}>{d.request ? `#${d.request.id}` : '—'}</td>
                  <td style={s.tdMuted}>{new Date(d.donatedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'requests' && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr style={s.thead}>
              {['#','Patient','Blood','Hospital','Urgency','Status','Date'].map(h => <th key={h} style={s.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="admin-tr" style={s.tr}>
                  <td style={s.tdMuted}>{r.id}</td>
                  <td style={s.tdBold}>{r.patientName}</td>
                  <td style={s.td}><span style={s.btPill}>{r.bloodType?.replace('_POS','+').replace('_NEG','−')}</span></td>
                  <td style={s.tdMuted}>{r.hospital}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge,
                      color:   r.urgencyLevel==='CRITICAL'?'#dc2626':r.urgencyLevel==='HIGH'?'#ea580c':r.urgencyLevel==='MEDIUM'?'#d97706':'#16a34a',
                      background: r.urgencyLevel==='CRITICAL'?'#fef2f2':r.urgencyLevel==='HIGH'?'#fff7ed':r.urgencyLevel==='MEDIUM'?'#fffbeb':'#f0fdf4',
                      border: `1px solid ${r.urgencyLevel==='CRITICAL'?'#fecaca':r.urgencyLevel==='HIGH'?'#fed7aa':r.urgencyLevel==='MEDIUM'?'#fde68a':'#bbf7d0'}`,
                    }}>{r.urgencyLevel}</span>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge,
                      background:r.status==='OPEN'?'#f0fdf4':r.status==='FULFILLED'?'#eff6ff':'#f1f5f9',
                      color:r.status==='OPEN'?'#16a34a':r.status==='FULFILLED'?'#2563eb':'#64748b',
                      border:`1px solid ${r.status==='OPEN'?'#bbf7d0':r.status==='FULFILLED'?'#bfdbfe':'#e2e8f0'}`,
                    }}>{r.status}</span>
                  </td>
                  <td style={s.tdMuted}>{new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page:   { maxWidth:'1200px', margin:'0 auto', padding:'40px 24px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', flexWrap:'wrap', gap:'12px' },
  title:  { fontSize:'2rem', fontWeight:'800', color:'#1a0a0a', marginBottom:'4px' },
  sub:    { color:'#888', fontSize:'0.9rem' },
  adminBadge: { background:'#f3f0ff', color:'#7c3aed', padding:'8px 18px', borderRadius:'20px', fontWeight:'600', fontSize:'0.85rem', border:'1px solid #ddd6fe' },

  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'16px', marginBottom:'28px' },
  statCard:  { background:'#fff', border:'1px solid #fde8e8', borderRadius:'16px', padding:'22px', boxShadow:'0 2px 10px rgba(200,26,39,0.05)' },
  statTop:   { marginBottom:'14px' },
  statIcon:  { width:'40px', height:'40px', borderRadius:'10px', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' },
  statNum:   { fontSize:'2.2rem', fontWeight:'800', marginBottom:'4px' },
  statLabel: { color:'#888', fontSize:'0.85rem' },

  tabs:     { display:'flex', gap:'6px', marginBottom:'24px', flexWrap:'wrap' },
  tab:      { padding:'9px 20px', background:'#fff', border:'1px solid #fde8e8', borderRadius:'8px', color:'#888', cursor:'pointer', fontWeight:'600', fontSize:'0.85rem', transition:'all 0.2s' },
  tabActive:{ background:'#fff0f0', border:`1px solid #fcc`, color:RED, fontWeight:'700' },

  overviewGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(400px,1fr))', gap:'20px' },
  overCard:     { background:'#fff', border:'1px solid #fde8e8', borderRadius:'16px', padding:'24px', boxShadow:'0 2px 10px rgba(200,26,39,0.05)' },
  overTitle:    { fontSize:'0.8rem', fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'16px' },
  row:          { display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid #fde8e8' },
  rowAvatar:    { width:'36px', height:'36px', borderRadius:'8px', background:'#fff0f0', color:RED, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:'0.9rem', flexShrink:0 },
  rowMain:      { color:'#1a0a0a', fontWeight:'600', fontSize:'0.88rem', marginBottom:'2px' },
  rowSub:       { color:'#888', fontSize:'0.78rem' },
  badge:        { padding:'3px 10px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:'700', whiteSpace:'nowrap' },

  tableWrap: { background:'#fff', border:'1px solid #fde8e8', borderRadius:'16px', overflowX:'auto', boxShadow:'0 2px 10px rgba(200,26,39,0.05)' },
  table:     { width:'100%', borderCollapse:'collapse' },
  thead:     { background:'#fff5f5', borderBottom:'1px solid #fde8e8' },
  tr:        { borderBottom:'1px solid #fde8e8', transition:'background 0.15s' },
  th:        { color:'#888', fontSize:'0.78rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.06em', padding:'12px 16px', textAlign:'left' },
  td:        { padding:'12px 16px' },
  tdMuted:   { color:'#555', fontSize:'0.88rem', padding:'12px 16px' },
  tdBold:    { color:'#1a0a0a', fontWeight:'600', fontSize:'0.88rem', padding:'12px 16px' },
  btPill:    { background:'#fff0f0', color:RED, padding:'3px 10px', borderRadius:'20px', fontWeight:'700', fontSize:'0.78rem', border:`1px solid #fcc` },
  yes:       { color:'#16a34a', fontWeight:'600', fontSize:'0.85rem' },
  no:        { color:'#dc2626', fontWeight:'600', fontSize:'0.85rem' },
};
