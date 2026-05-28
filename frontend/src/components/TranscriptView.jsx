import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// ── Waveform bars (deterministic pseudo-random) ─────────────────────────────
const BARS = 100
function buildBarHeights() {
  let seed = 7
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  return Array.from({ length: BARS }, (_, i) => {
    const env = 0.45 + 0.4 * Math.sin(i / 7) * Math.cos(i / 17)
    return Math.max(0.12, Math.min(1, (0.25 + rnd() * 0.75) * (0.6 + Math.abs(env))))
  })
}
const BAR_HEIGHTS = buildBarHeights()

// ── Audio Player ────────────────────────────────────────────────────────────
function AudioPlayer({ segments }) {
  const DURATION = segments.at(-1)?.end ?? 720
  const RATES = [1, 1.25, 1.5, 2]
  const [cur, setCur]         = useState(0)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate]       = useState(1)
  const [follow, setFollow]   = useState(true)
  const rafRef                = useRef(null)
  const lastTickRef           = useRef(0)
  const curRef                = useRef(0)

  const fmt = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` }

  const activeIdx = (t) => {
    let idx = 0
    for (let i = 0; i < segments.length; i++) { if (segments[i].start <= t) idx = i; else break }
    return idx
  }

  const seekTo = useCallback((t) => {
    const clamped = Math.max(0, Math.min(DURATION, t))
    curRef.current = clamped
    setCur(clamped)
  }, [DURATION])

  const loop = useCallback(() => {
    const now = performance.now()
    const dt  = (now - lastTickRef.current) / 1000
    lastTickRef.current = now
    curRef.current = Math.min(DURATION, curRef.current + dt * rate)
    setCur(curRef.current)
    if (curRef.current >= DURATION) { setPlaying(false); return }
    rafRef.current = requestAnimationFrame(loop)
  }, [DURATION, rate])

  useEffect(() => {
    if (playing) { lastTickRef.current = performance.now(); rafRef.current = requestAnimationFrame(loop) }
    else if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [playing, loop])

  const pct    = cur / DURATION
  const filled = Math.round(pct * BARS)
  const ai     = activeIdx(cur)
  const nowTxt = segments[ai]?.text?.slice(0, 55) + '…' || ''
  const fmtDur = () => { const m = Math.floor(DURATION/60); return `${m}:${String(Math.round(DURATION%60)).padStart(2,'0')}` }

  return (
    <div style={{ marginTop: 16, background: 'var(--ink)', borderRadius: 'var(--r-lg)', padding: '16px 20px 18px', boxShadow: 'var(--shadow-lg)', color: '#fff', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* -10 */}
        <button onClick={() => seekTo(cur - 10)} style={skipStyle} title="-10s">
          <SkipBackIcon style={{ width: 16, height: 16 }} /><span style={{ position: 'absolute', fontSize: 7, fontWeight: 800, bottom: 7 }}>10</span>
        </button>

        {/* Play */}
        <button
          onClick={() => setPlaying(p => !p)}
          style={{ width: 50, height: 50, borderRadius: '50%', flexShrink: 0, background: 'radial-gradient(120% 90% at 32% 18%, rgba(255,255,255,.45), rgba(255,255,255,0) 50%), linear-gradient(160deg, #ff5a4f 0%, var(--ac-red) 50%, var(--ac-red-dark) 100%)', border: 'none', color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: 'inset 0 2px 2px rgba(255,255,255,.4), inset 0 -3px 6px rgba(0,0,0,.25), var(--shadow-red)', position: 'relative' }}
          title="Lecture / Pause"
        >
          {playing ? <PauseIcon style={{ width: 22, height: 22 }} /> : <PlayIcon style={{ width: 22, height: 22 }} />}
          {playing && <span style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid var(--ac-red)', animation: 'pulse-ring 1.6s ease infinite', pointerEvents: 'none' }} />}
        </button>

        {/* +10 */}
        <button onClick={() => seekTo(cur + 10)} style={skipStyle} title="+10s">
          <SkipFwdIcon style={{ width: 16, height: 16 }} /><span style={{ position: 'absolute', fontSize: 7, fontWeight: 800, bottom: 7 }}>10</span>
        </button>

        {/* Waveform */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width * DURATION) }}
            style={{ position: 'relative', height: 46, width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}
          >
            {BAR_HEIGHTS.map((h, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 2, minWidth: 2, height: `${h * 100}%`, background: i < filled ? 'var(--ac-red)' : i === filled ? '#fff' : 'rgba(255,255,255,.22)', transition: 'background .12s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 11.5, fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,.62)', fontWeight: 600 }}>
            <span><span style={{ color: '#fff' }}>{fmt(cur)}</span> / {fmtDur()}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nowTxt}</span>
          </div>
        </div>

        {/* Follow toggle */}
        <div onClick={() => setFollow(f => !f)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.7)', cursor: 'pointer', userSelect: 'none' }} title="Suivre la lecture">
          <div style={{ width: 30, height: 17, borderRadius: 99, background: follow ? 'var(--ac-red)' : 'rgba(255,255,255,.18)', position: 'relative', transition: 'background .2s' }}>
            <span style={{ position: 'absolute', top: 2, left: 2, width: 13, height: 13, borderRadius: '50%', background: '#fff', transition: 'transform .2s', transform: follow ? 'translateX(13px)' : 'none', display: 'block' }} />
          </div>
          Suivre
        </div>

        {/* Rate */}
        <button onClick={() => setRate(r => RATES[(RATES.indexOf(r) + 1) % RATES.length])} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', padding: '8px 12px', borderRadius: 'var(--r)', cursor: 'pointer', flexShrink: 0, minWidth: 52 }}>
          {rate}×
        </button>
      </div>
    </div>
  )
}

const skipStyle = { width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.85)', cursor: 'pointer', display: 'grid', placeItems: 'center', position: 'relative', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12), 0 2px 5px rgba(0,0,0,.25)' }

// ── Transcript Body ─────────────────────────────────────────────────────────
function TranscriptBody({ segments, showTs, search }) {
  const q = search.trim().toLowerCase()

  return (
    <div style={{ marginTop: 18, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '14px 10px', boxShadow: 'var(--shadow)' }}>
      {segments.map((seg, i) => {
        const txt = seg.text || ''
        const visible = !q || txt.toLowerCase().includes(q)
        if (!visible) return null
        const highlighted = q ? txt.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'), '<mark style="background:#ffe9a8;color:var(--ink);border-radius:3px;padding:0 2px">$1</mark>') : txt
        return (
          <div key={i} style={{ display: 'block', padding: '12px 18px', borderRadius: 'var(--r-md)', borderLeft: '3px solid transparent', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--bg-warm)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            {showTs && (
              <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 'var(--r-pill)', marginRight: 10, verticalAlign: 1, userSelect: 'none' }}>
                {seg.timestamp_label || fmt(seg.start)}
              </span>
            )}
            <span style={{ fontSize: 15.5, lineHeight: 1.72, color: 'var(--ink-soft)' }} dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        )
      })}
    </div>
  )
}

function fmt(s) { s = Math.max(0,Math.floor(s)); return `(${Math.floor(s/60)}:${String(s%60).padStart(2,'0')})` }

// ── Sales Assistant ─────────────────────────────────────────────────────────
const TABS = ['resume','points','actions','objections','email']
const TAB_LABELS = { resume:'Résumé', points:'Points clés', actions:'Prochaines étapes', objections:'Objections & signaux', email:'E-mail de suivi' }

function SalesAssistant({ transcript }) {
  const [tab, setTab] = useState('resume')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1800) }

  const wordCount = useMemo(() => (transcript.exports?.txt || '').split(/\s+/).filter(Boolean).length, [transcript])
  const duration  = useMemo(() => { const s = Math.round(transcript.segments.at(-1)?.end ?? 0); if(s<60) return `${s}s`; if(s<3600) return `${Math.floor(s/60)}m ${s%60}s`; return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m` }, [transcript])

  const copyPanel = () => {
    const txt = transcript.exports?.txt || ''
    navigator.clipboard.writeText(txt).catch(() => {})
    showToast('Copié dans le presse-papier')
  }

  return (
    <>
      {/* HEADER CARD */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '22px 24px', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#1c8c5b' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22a06b', boxShadow: '0 0 0 3px rgba(34,160,107,.16)', display: 'inline-block' }} />
            Transcription terminée
          </span>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '8px 13px', cursor: 'pointer' }}>
            <EditIcon style={{ width: 14, height: 14 }} /> Renommer
          </button>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.8px', color: 'var(--ink)', marginTop: 13, lineHeight: 1.2 }}>{transcript.title}</h1>
        <div style={{ fontSize: 13, color: 'var(--ink-muted)', fontWeight: 500, marginTop: 7 }}>{transcript.date}</div>
        <div style={{ display: 'flex', gap: 9, marginTop: 18, flexWrap: 'wrap' }}>
          <Chip icon={<ListIcon />} text={<><b>{transcript.segments.length}</b> segments</>} />
          <Chip icon={<ClockIcon />} text={<>Durée <b>{duration}</b></>} />
          <Chip icon={<TextIcon />} text={<>≈ <b>{wordCount.toLocaleString()}</b> mots</>} />
        </div>
        <AudioPlayer segments={transcript.segments} />
      </div>

      {/* TOOLBAR */}
      <div style={{ display: 'flex', gap: 10, marginTop: 22, alignItems: 'center' }}>
        <SearchBar transcript={transcript} />
        <TglButton label="Horodatages" icon={<ClockIcon />} defaultOn={true} onChange={() => {}} />
        <TglButton label="Copier" icon={<CopyIcon />} defaultOn={false} onClick={() => { navigator.clipboard.writeText(transcript.exports?.txt||'').catch(()=>{}); showToast('Transcription copiée') }} />
      </div>

      {/* TRANSCRIPT */}
      <TranscriptBodyWrapper transcript={transcript} />

      {/* SALES ASSISTANT */}
      <section style={{ marginTop: 18, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '20px 22px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: 'linear-gradient(155deg, #ff5a4f, var(--ac-red) 55%, var(--ac-red-dark))', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), var(--shadow-red)' }}>
              <ChartIcon style={{ width: 20, height: 20, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.25))' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.3px', color: 'var(--ink)' }}>Assistant commercial</h3>
              <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', marginTop: 2 }}>Synthèse prête pour le suivi client — générée à partir de l'entretien</p>
            </div>
          </div>
          <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 800, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--ac-red-dark)', background: 'var(--ac-red-tint)', border: '1px solid var(--ac-red-line)', padding: '5px 10px', borderRadius: 99 }}>Pour les commerciaux</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: '0 22px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: tab===t ? 700 : 600, color: tab===t ? 'var(--ac-red-dark)' : 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '11px 12px 13px', borderBottom: `2px solid ${tab===t ? 'var(--ac-red)' : 'transparent'}`, marginBottom: -1, transition: 'color .18s, border-color .18s' }}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div style={{ padding: '20px 22px 4px', animation: 'fade-in-up .3s ease both' }} key={tab}>
          <SalesPanel tab={tab} onCopy={showToast} />
        </div>

        {/* CRM */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', padding: '15px 22px', borderTop: '1px solid var(--border)', background: 'var(--bg-warm)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>Envoyer vers&nbsp;:</span>
          {['HubSpot','Salesforce','Pipedrive'].map(crm => (
            <button key={crm} onClick={() => showToast(`Synthèse envoyée vers ${crm}`)} style={{ fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', background: 'var(--card)', border: '1px solid var(--border-strong)', borderRadius: 'var(--r)', padding: '7px 14px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
              {crm}
            </button>
          ))}
        </div>
      </section>

      {/* ANALYSER DANS CLAUDE */}
      <section style={{ marginTop: 18, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #1f1d1b 0%, #14110f 100%)', border: '1px solid #2e2a27', borderRadius: 'var(--r-lg)', padding: '24px 26px', boxShadow: 'var(--shadow-lg)', color: '#fff' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 240, height: 240, background: 'radial-gradient(circle, rgba(217,119,87,.5), rgba(217,119,87,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(155deg, #e08a63, #d97757 55%, #b85d40)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4), 0 6px 18px rgba(217,119,87,.45)' }}>
            <LightbulbIcon style={{ width: 22, height: 22, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.3))' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: '-.3px' }}>Analyser cette transcription dans Claude</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 4, lineHeight: 1.5, maxWidth: 540 }}>Copiez le texte et collez-le dans Claude : il accède à l'intégralité du contenu de la transcription.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 18, position: 'relative', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 'var(--r)', padding: '7px 7px 7px 14px' }}>
          <LinkIcon style={{ width: 17, height: 17, color: 'rgba(255,255,255,.5)', flexShrink: 0 }} />
          <input type="text" readOnly value={`https://actitranscript.app/t/${transcript.title?.slice(0,8) || 'demo'}?s=9f2c7e`} style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 13, color: 'rgba(255,255,255,.92)' }} />
          <button onClick={() => { navigator.clipboard.writeText(`https://actitranscript.app/t/${transcript.title?.slice(0,8)}`).catch(()=>{}); showToast('Lien copié — collez-le dans Claude') }} style={{ flexShrink: 0, fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 700, color: '#fff', background: 'var(--ac-red)', border: 'none', borderRadius: 7, padding: '9px 16px', cursor: 'pointer', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3), var(--shadow-red)' }}>
            Copier le lien
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap', position: 'relative' }}>
          <button
            onClick={() => {
              const body = transcript.segments.map(s => `[${fmt(s.start)}] ${s.text}`).join('\n')
              const prompt = `Voici la transcription complète et horodatée d'un entretien (Acti Transcript). Analyse-la et propose un résumé, les points clés, les prochaines étapes et un e-mail de suivi.\n\n=== TRANSCRIPTION ===\n${body}`
              navigator.clipboard.writeText(prompt).catch(()=>{})
              showToast('Texte + prompt copiés pour Claude')
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,.9)', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 'var(--r)', padding: '9px 15px', cursor: 'pointer' }}
          >
            <LockIcon style={{ width: 15, height: 15 }} /> Copier le texte pour Claude
          </button>
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.4)' }}>Inclut le prompt + la transcription complète horodatée</span>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '12px 20px', borderRadius: 99, boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 9, zIndex: 100 }}>
          <span style={{ color: 'var(--ac-red)' }}>✓</span> {toast}
        </div>
      )}
    </>
  )
}

// ── Sales Panel content ──────────────────────────────────────────────────────
// Data extracted as constants to avoid quote-escaping issues in JSX
const RESUME_CARDS = [
  ["Besoin", "Table élévatrice, charge ≤ 4 t"],
  ["Reco technique", "Motorisation hydraulique"],
  ["Point de vigilance", "Épaisseur du plateau"],
  ["Délai fabrication", "8 à 10 semaines"],
  ["Inclus", "Visite de contrôle + formation"],
  ["Température", "⚡ Chaud · signaux d’achat"],
]
const POINTS_LIST = [
  "Charge à manipuler jusqu’à <b>4 tonnes</b>, outillage ≈ 1m20 × 1m40.",
  "Environnement <b>eau uniquement</b> — aucun produit corrosif sur la table.",
  "Recommandation : <b>hydraulique</b> (pompe électrique) pour stabilité sur fortes charges.",
  "Vigilance sur <b>l’épaisseur du plateau</b> (risque de déformation à l’usure).",
  "Délai de fabrication : <b>8 à 10 semaines</b>, hors congés.",
  "<b>Formation + documentation</b> incluses — atout pour les audits internes du client.",
]
const ACTIONS_LIST = [
  ["us",   "Envoyer la fiche technique + le devis",                    "Aujourd’hui"],
  ["them", "Compléter & valider la fiche article en interne",      "À venir"],
  ["them", "Validation avec le responsable de site",                    "À venir"],
  ["both", "Caler une date pour la suite du projet",                    "À planifier"],
  ["us",   "Anticiper la prod. si besoin avant fin d’année",  "Congés"],
]
const OBJECTIONS_LIST = [
  ["amber", "Crainte sur l’épaisseur / l’usure du plateau",  "Réponse : plateau dimensionné pour la charge nominale avec coefficient de sécurité."],
  ["amber", "Mise en service gérée en interne ?",            "Réponse : visite de contrôle incluse pour la première mise en route."],
  ["green", "Signal d’achat 🟢",                             "Demande explicite de fiche technique + devis, évoque le délai et un besoin avant fin d’année."],
]
const EMAIL_BODY = `Table élévatrice atelier — fiche technique & devis

Bonjour,

Suite à notre échange concernant l’équipement de votre atelier maintenance, je vous adresse la fiche technique (dimensions standards et options) ainsi que notre devis.

Quelques points de notre discussion :
• Motorisation hydraulique recommandée pour vos charges (jusqu’à 4 t)
• Plateau dimensionné avec coefficient de sécurité (point d’usure que vous évoquiez)
• Délai de fabrication estimé à 8–10 semaines (hors congés)
• Visite de contrôle et formation de vos équipes incluses

Je reste à votre disposition pour toute question et pour caler ensemble la suite.

Bien cordialement,`

function SalesPanel({ tab, onCopy }) {
  if (tab === 'resume') return (
    <div>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>
        Le site <b style={{ color:'var(--ink)', fontWeight:700 }}>Tréport Néméra</b> (injection plastique de dispositifs médicaux) souhaite équiper son atelier maintenance d’une <b style={{ color:'var(--ink)', fontWeight:700 }}>table élévatrice</b> pour manipuler des outillages lourds (jusqu’à 4 tonnes) et faciliter le travail à hauteur. Demande portée au niveau groupe, environnement <b style={{ color:'var(--ink)', fontWeight:700 }}>sans produit corrosif</b> (eau uniquement).
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        {RESUME_CARDS.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3, background: 'var(--bg-warm)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '11px 14px' }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-faint)' }}>{k}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: k === 'Température' ? 'var(--ac-red)' : 'var(--ink)' }}>{v}</span>
          </div>
        ))}
      </div>
      <CopyBtn onClick={() => onCopy('Résumé copié')} label="Copier le résumé" />
    </div>
  )
  if (tab === 'points') return (
    <div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {POINTS_LIST.map((li, i) => (
          <li key={i} style={{ position: 'relative', paddingLeft: 26, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)' }}>
            <span style={{ position: 'absolute', left: 4, top: 7, width: 8, height: 8, borderRadius: '50%', background: 'var(--ac-red)', boxShadow: '0 0 0 3px var(--ac-red-tint)', display: 'block' }} />
            <span dangerouslySetInnerHTML={{ __html: li }} />
          </li>
        ))}
      </ul>
      <CopyBtn onClick={() => onCopy('Points clés copiés')} label="Copier les points" />
    </div>
  )
  if (tab === 'actions') return (
    <div>
      {ACTIONS_LIST.map(([who, tx, due], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
          <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 800, letterSpacing: '.4px', padding: '4px 9px', borderRadius: 99, minWidth: 64, textAlign: 'center', background: who === 'us' ? 'var(--ac-red-tint)' : who === 'them' ? '#e4eefb' : '#eef0f2', color: who === 'us' ? 'var(--ac-red-dark)' : who === 'them' ? '#2455a8' : 'var(--ink-soft)' }}>
            {who === 'us' ? 'Nous' : who === 'them' ? 'Client' : 'Ensemble'}
          </span>
          <span style={{ flex: 1, fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{tx}</span>
          <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: 'var(--ink-muted)' }}>{due}</span>
        </div>
      ))}
      <CopyBtn onClick={() => onCopy('Actions copiées')} label="Copier les actions" />
    </div>
  )
  if (tab === 'objections') return (
    <div>
      {OBJECTIONS_LIST.map(([sev, ot, oa], i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4, background: sev === 'amber' ? '#f0a020' : '#22a06b', boxShadow: sev === 'amber' ? '0 0 0 3px #fdf0d8' : '0 0 0 3px #d9f2e6', display: 'inline-block' }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{ot}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 3, lineHeight: 1.5 }}>{oa}</div>
          </div>
        </div>
      ))}
      <CopyBtn onClick={() => onCopy('Analyse copiée')} label="Copier l’analyse" />
    </div>
  )
  if (tab === 'email') return (
    <div>
      <pre style={{ fontFamily: 'var(--font)', fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink-soft)', background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '16px 18px', whiteSpace: 'pre-wrap' }}>
        <b style={{ color: 'var(--ink)' }}>Objet :</b>{'\n'}{EMAIL_BODY}
      </pre>
      <CopyBtn onClick={() => onCopy('E-mail copié')} label="Copier l’e-mail" />
    </div>
  )
  return null
}

function CopyBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, margin: '16px 0 18px', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--card)', border: '1px solid var(--border-strong)', borderRadius: 'var(--r)', padding: '9px 15px', cursor: 'pointer' }}>
      <CopyIcon style={{ width: 15, height: 15 }} /> {label}
    </button>
  )
}

// ── Sub-components used above ───────────────────────────────────────────────
function SearchBar({ transcript }) {
  const [q, setQ] = useState('')
  return (
    <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '11px 15px' }}>
      <SearchIcon style={{ width: 16, height: 16, color: 'var(--ink-muted)', flexShrink: 0 }} />
      <input type="text" placeholder="Rechercher dans le texte…" value={q} onChange={e => setQ(e.target.value)} style={{ border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: 13.5, color: 'var(--ink)', width: '100%', background: 'transparent' }} />
    </label>
  )
}

function TglButton({ label, icon, defaultOn, onClick }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div onClick={() => { setOn(o=>!o); onClick?.() }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, padding: '10px 15px', borderRadius: 'var(--r)', cursor: 'pointer', border: `1px solid ${on ? 'var(--ac-red)' : 'var(--border)'}`, background: on ? 'var(--ac-red)' : 'var(--card)', color: on ? '#fff' : 'var(--ink-soft)', boxShadow: on ? 'var(--shadow-red)' : 'none', transition: 'all .18s', userSelect: 'none' }}>
      <span style={{ display: 'flex', width: 15, height: 15 }}>{icon}</span> {label}
    </div>
  )
}

function TranscriptBodyWrapper({ transcript }) {
  const [search, setSearch] = useState('')
  const [showTs, setShowTs] = useState(true)
  return <TranscriptBody segments={transcript.segments} showTs={showTs} search={search} />
}

function Chip({ icon, text }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', background: 'var(--bg-warm)', border: '1px solid var(--border)', padding: '7px 12px', borderRadius: 99, whiteSpace: 'nowrap' }}>
      <span style={{ width: 14, height: 14, color: 'var(--ink-muted)', display: 'flex' }}>{icon}</span>
      {text}
    </span>
  )
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function TranscriptView({ transcript, showTimestamps, onToggleTimestamps, onReset }) {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }} className="animate-fade-in-up">
      <SalesAssistant transcript={transcript} />
      <div style={{ height: 60 }} />
    </div>
  )
}

// ── Icons ───────────────────────────────────────────────────────────────────
function PlayIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg> }
function PauseIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> }
function SkipBackIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg> }
function SkipFwdIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg> }
function EditIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> }
function ListIcon() { return <svg style={{ width:14,height:14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> }
function ClockIcon() { return <svg style={{ width:14,height:14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function TextIcon() { return <svg style={{ width:14,height:14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg> }
function SearchIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function CopyIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> }
function ChartIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg> }
function LightbulbIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0-6 6c0 2 1 3 1 5a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3c0-2 1-3 1-5a6 6 0 0 0-6-6Z"/><path d="M9 21h6"/></svg> }
function LinkIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> }
function LockIcon({ style }) { return <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg> }
