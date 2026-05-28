import { useState, useRef, useCallback } from 'react'

const ACCEPTED = '.mp3,.wav,.m4a,.ogg,.webm,.flac,.mp4'

const FORMATS = [
  { ext: 'MP3',  c: '#f59e0b', bg: '#fffbeb' },
  { ext: 'WAV',  c: '#3b82f6', bg: '#eff6ff' },
  { ext: 'M4A',  c: '#8b5cf6', bg: '#f5f3ff' },
  { ext: 'OGG',  c: '#10b981', bg: '#ecfdf5' },
  { ext: 'FLAC', c: '#ec4899', bg: '#fdf2f8' },
  { ext: 'WEBM', c: '#6366f1', bg: '#eef2ff' },
  { ext: 'MP4',  c: '#14b8a6', bg: '#f0fdfa' },
]

const FEATURES = [
  { icon: LightningIcon, text: 'OpenAI Whisper',    color: '#f59e0b' },
  { icon: TargetIcon,    text: 'Précision > 95 %',  color: '#10b981' },
  { icon: ClockIcon,     text: '~2 min / 30 min',   color: 'var(--ac-red)' },
  { icon: ShieldIcon,    text: 'Données sécurisées', color: '#8b5cf6' },
]

export default function UploadZone({ onUpload }) {
  const [dragging, setDragging]     = useState(false)
  const [selectedFile, setSelected] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback((file) => { if (file) setSelected(file) }, [])
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const formatSize = (b) =>
    b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.7px', lineHeight: 1.2, marginBottom: 8 }}>
            Transcription audio{' '}
            <span style={{ color: 'var(--ac-red)' }}>intelligente</span>
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--ink-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.55 }}>
            Déposez votre fichier audio et obtenez une transcription précise avec horodatages en quelques secondes.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !selectedFile && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !selectedFile && inputRef.current?.click()}
          style={{
            position: 'relative', borderRadius: 'var(--r-xl)', padding: '52px 32px',
            textAlign: 'center', cursor: selectedFile ? 'default' : 'pointer',
            border: dragging
              ? '2px solid var(--ac-red)'
              : selectedFile
                ? '2px solid #22c55e'
                : '2px dashed var(--border-strong)',
            background: dragging
              ? 'linear-gradient(160deg, var(--ac-red-wash), #fff9)'
              : selectedFile
                ? 'linear-gradient(160deg, #f0fdf4, #fff)'
                : 'var(--card)',
            boxShadow: dragging
              ? '0 0 0 4px rgba(226,35,26,.08), var(--shadow)'
              : 'var(--shadow)',
            transform: dragging ? 'scale(1.01)' : 'none',
            transition: 'all .25s var(--ease)',
            overflow: 'hidden',
          }}
        >
          <input ref={inputRef} type="file" accept={ACCEPTED} style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />

          {/* BG decor */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 180, height: 180, background: 'radial-gradient(circle, rgba(226,35,26,.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 120, height: 120, background: 'radial-gradient(circle, rgba(226,35,26,.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {!selectedFile ? (
            <div style={{ position: 'relative' }}>
              {/* Mic icon */}
              <div style={{
                position: 'relative', width: 72, height: 72, margin: '0 auto 20px',
                transform: dragging ? 'scale(1.12)' : 'none', transition: 'transform .3s var(--ease)',
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: 'radial-gradient(140% 100% at 30% 10%, rgba(255,255,255,.35), rgba(255,255,255,0) 50%), linear-gradient(160deg, #ff5a4f, var(--ac-red) 55%, var(--ac-red-dark))',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), var(--shadow-red)',
                  display: 'grid', placeItems: 'center', color: '#fff',
                }}>
                  <MicBigIcon />
                </div>
                {dragging && (
                  <>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'var(--ac-red)', opacity: .2, animation: 'pulse-ring 1s ease-out infinite' }} />
                    <div style={{ position: 'absolute', inset: -10, borderRadius: 28, background: 'var(--ac-red)', opacity: .1, animation: 'pulse-ring 1s ease-out infinite', animationDelay: '.2s' }} />
                  </>
                )}
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.4px', marginBottom: 6 }}>
                {dragging ? '📂 Relâchez pour déposer' : 'Glissez votre fichier audio ici'}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 22 }}>
                ou{' '}
                <span style={{ color: 'var(--ac-red)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  cliquez pour parcourir
                </span>
              </p>

              {/* Format pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
                {FORMATS.map(({ ext, c, bg }) => (
                  <span key={ext} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: bg, color: c, border: `1px solid ${c}22` }}>{ext}</span>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontWeight: 600 }}>Taille maximale · 100 Mo</p>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(160deg, #4ade80, #16a34a)', boxShadow: '0 6px 20px rgba(22,163,74,.3)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: '#fff' }}>
                <CheckBigIcon />
              </div>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.4px', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400, margin: '0 auto 6px' }}>
                {selectedFile.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 99, padding: '3px 12px', color: 'var(--ink-soft)' }}>
                  {formatSize(selectedFile.size)}
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 700, background: '#dcfce7', color: '#16a34a', borderRadius: 99, padding: '3px 12px' }}>
                  ✓ Prêt à transcrire
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(null); inputRef.current?.click() }}
                style={{ fontSize: 12, color: 'var(--ac-red)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                Changer de fichier
              </button>
            </div>
          )}
        </div>

        {/* Transcribe button */}
        {selectedFile && (
          <button
            onClick={() => onUpload(selectedFile)}
            style={{
              marginTop: 14, width: '100%',
              background: 'radial-gradient(140% 100% at 30% 10%, rgba(255,255,255,.35), rgba(255,255,255,0) 50%), linear-gradient(160deg, #ff5a4f, var(--ac-red) 55%, var(--ac-red-dark))',
              color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: '-.2px',
              padding: '15px 24px', border: 'none', borderRadius: 'var(--r-lg)', cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), var(--shadow-red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'opacity .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.92'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <WaveIcon />
            Lancer la transcription
            <ArrowIcon />
          </button>
        )}

        {/* Feature pills */}
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {FEATURES.map(({ icon: Icon, text, color }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '9px 12px', boxShadow: 'var(--shadow-sm)' }}>
              <Icon color={color} />
              <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.35 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Icons */
function MicBigIcon() {
  return <svg style={{ width: 34, height: 34 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
}
function CheckBigIcon() {
  return <svg style={{ width: 28, height: 28 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
}
function WaveIcon() {
  return <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
}
function ArrowIcon() {
  return <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
}
function LightningIcon({ color }) {
  return <svg style={{ width: 15, height: 15, color }} fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
}
function TargetIcon({ color }) {
  return <svg style={{ width: 15, height: 15, color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
}
function ClockIcon({ color }) {
  return <svg style={{ width: 15, height: 15, color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
}
function ShieldIcon({ color }) {
  return <svg style={{ width: 15, height: 15, color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
