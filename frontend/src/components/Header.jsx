export default function Header({ onNew }) {
  return (
    <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 18, padding: '0 26px', borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
      <nav style={{ display: 'flex', gap: 4 }}>
        <a href="#" style={navStyle(true)}>Accueil</a>
        <a href="#" style={navStyle(false)}>FAQ</a>
        <a href="#" style={navStyle(false)}>Aide</a>
      </nav>
      <div style={{ flex: 1 }} />
      <button onClick={onNew} className="btn-new" style={btnNewStyle}>
        <PlusIcon className="btn-new-plus" style={{ width: 16, height: 16 }} />
        Nouvelle transcription
      </button>
      <button className="iconbtn-3d" style={iconBtnStyle} title="Notifications">
        <BellIcon style={{ width: 18, height: 18 }} />
      </button>
    </header>
  )
}

const navStyle = (active) => ({
  fontSize: 13, fontWeight: 600, color: active ? 'var(--ink)' : 'var(--ink-soft)',
  padding: '7px 13px', borderRadius: 'var(--r)', cursor: 'pointer', textDecoration: 'none',
  background: active ? 'var(--bg-warm)' : 'transparent', transition: 'background .18s, color .18s',
})

const btnNewStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'radial-gradient(140% 100% at 30% 10%, rgba(255,255,255,.35), rgba(255,255,255,0) 50%), linear-gradient(160deg, #ff5a4f, var(--ac-red) 55%, var(--ac-red-dark))',
  color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '-.1px',
  padding: '9px 16px', border: 'none', borderRadius: 'var(--r)', cursor: 'pointer',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), var(--shadow-red)',
}

const iconBtnStyle = {
  width: 38, height: 38, borderRadius: 'var(--r)', border: '1px solid var(--border)',
  background: 'var(--card)', display: 'grid', placeItems: 'center', cursor: 'pointer',
  color: 'var(--ink-soft)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.8), 0 1px 3px rgba(20,18,16,.06)',
}

function PlusIcon({ style }) {
  return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
function BellIcon({ style }) {
  return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
}
