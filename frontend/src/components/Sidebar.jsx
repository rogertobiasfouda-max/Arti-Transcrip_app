const RECENT_FILES = [
  { name: 'Réunion_équipe_23mai', time: 'il y a 2h', dur: '32 min' },
  { name: 'Appel_client_ACME',    time: 'hier',      dur: '18 min' },
  { name: 'Interview_podcast_ep12', time: '26 mai',  dur: '54 min' },
]

export default function Sidebar() {
  return (
    <aside style={{ background: 'var(--card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>

      {/* Brand */}
      <div className="brand-wrap" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '22px 22px 18px', cursor: 'default' }}>
        <div className="brand-mark icon-3d" style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <MicIcon style={{ width: 20, height: 20, color: '#fff' }} />
        </div>
        <div>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.6px', color: 'var(--ink)' }}>Acti</span>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.6px', color: 'var(--ac-red)' }}>Transcript</span>
          </div>
          <span style={{ display: 'block', marginTop: 4, fontSize: '8.5px', fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>par Actiwork</span>
        </div>
      </div>

      {/* Free card */}
      <div style={{ margin: '4px 16px 20px', padding: '15px 16px', borderRadius: 'var(--r-md)', background: 'linear-gradient(160deg, var(--ac-red-wash), #fff)', border: '1px solid var(--ac-red-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div className="icon-3d freecard-dot" style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(155deg, #ff5a4f, var(--ac-red) 55%, var(--ac-red-dark))', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, animation: 'badge-bob 4.5s ease infinite' }}>
            <CheckIcon style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-.2px', color: 'var(--ink)' }}>100&nbsp;% gratuit</h4>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ac-red-dark)', marginTop: 1 }}>Sans limite · sans compte</div>
          </div>
        </div>
        <p style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--ink-soft)', marginTop: 11 }}>Transcriptions illimitées, tous les formats d'export inclus. Aucune inscription requise.</p>
      </div>

      {/* Nav */}
      <div style={{ padding: '0 16px' }}>
        <div style={navLabelStyle}>Navigation</div>
        <NavItem icon={<DashIcon />} label="Tableau de bord" active={false} />
        <NavItem icon={<FileIcon />} label="Fichiers récents" active={true} badge="3" />
        <NavItem icon={<FolderIcon />} label="Mes dossiers" active={false} />
        <NavItem icon={<StarIcon />} label="Favoris" active={false} />
      </div>

      {/* Recents */}
      <div style={{ padding: '0 16px', flex: 1 }}>
        <div style={navLabelStyle}>Récents</div>
        {RECENT_FILES.map((f, i) => (
          <div key={i} className="icon-lift" style={recentItemStyle} onMouseEnter={e => e.currentTarget.style.background='var(--bg-warm)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <div className="icon-3d icon-neutral" style={recentIconStyle}>
              <MusicIcon style={{ width: 15, height: 15, color: 'var(--ink-muted)' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{f.name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', marginTop: 1 }}>{f.time} · {f.dur}</div>
            </div>
          </div>
        ))}
        <div style={recentItemStyle} onMouseEnter={e => e.currentTarget.style.background='var(--bg-warm)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <div style={{ ...recentIconStyle, background: 'var(--ac-red-wash)', borderColor: 'var(--ac-red-line)', color: 'var(--ac-red)' }}>
            <PlusIcon style={{ width: 15, height: 15, position: 'relative', zIndex: 2 }} />
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)' }}>Nouveau dossier</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--ink-muted)', fontWeight: 600 }}>
        <span className="live-dot" style={{ width: 7, height: 7, borderRadius: 99, background: '#22a06b', display: 'inline-block' }} />
        Transcription locale · En ligne
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 'var(--r)', fontSize: 13.5, fontWeight: active ? 700 : 600, color: active ? 'var(--ac-red-deep)' : 'var(--ink-soft)', background: active ? 'var(--ac-red-tint)' : 'transparent', cursor: 'pointer', marginBottom: 2 }}>
      <span className={active ? 'nav-icon nav-icon-active' : 'nav-icon'} style={{ color: active ? 'var(--ac-red)' : 'var(--ink-muted)', display: 'flex' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <span style={{ fontSize: 10.5, fontWeight: 800, background: active ? 'var(--ac-red)' : 'var(--ink)', color: '#fff', minWidth: 19, height: 19, padding: '0 5px', borderRadius: 99, display: 'grid', placeItems: 'center' }}>{badge}</span>}
    </div>
  )
}

const navLabelStyle = { fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--ink-faint)', padding: '16px 8px 9px' }
const recentItemStyle = { display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 'var(--r)', cursor: 'pointer', transition: 'background .18s' }
const recentIconStyle = { width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: 'linear-gradient(160deg, #ffffff 0%, #f1efeb 100%)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', position: 'relative', isolation: 'isolate', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9), inset 0 -2px 3px rgba(0,0,0,.05), 0 2px 5px rgba(20,18,16,.08)' }

function MicIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg> }
function CheckIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> }
function DashIcon() { return <svg style={{ width: 17, height: 17 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg> }
function FileIcon() { return <svg style={{ width: 17, height: 17 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg> }
function FolderIcon() { return <svg style={{ width: 17, height: 17 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> }
function StarIcon() { return <svg style={{ width: 17, height: 17 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
function MusicIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function PlusIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
