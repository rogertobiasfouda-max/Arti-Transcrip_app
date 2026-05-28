import { useState } from 'react'

function downloadBlob(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function formatDuration(sec) {
  const s = Math.round(sec)
  if (s < 60)   return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}

function countWords(text) {
  return text ? text.split(/\s+/).filter(Boolean).length : 0
}

export default function ExportPanel({ transcript }) {
  const has = !!transcript
  const [copied, setCopied] = useState(false)

  const dl = (key, ext) => {
    if (!has) return
    downloadBlob(transcript.exports[key], `${transcript.title}.${ext}`)
  }
  const handleCopy = async () => {
    if (!has) return
    await navigator.clipboard.writeText(transcript.exports.txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--card)', borderLeft: '1px solid var(--border)' }}>

      {/* Header */}
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--ac-red-wash)', border: '1px solid var(--ac-red-line)', display: 'grid', placeItems: 'center' }}>
            <ExportIcon style={{ width: 15, height: 15, color: 'var(--ac-red)' }} />
          </div>
          <h3 style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Exporter</h3>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0' }}>

        {/* Formats */}
        <SectionLabel label="Format de fichier" />
        <div style={{ marginBottom: 16 }}>
          <ExportRow icon={<PDFIcon />} color="#ef4444" bg="#fef2f2" label="PDF" sublabel="Document formaté" gratuit disabled={!has} onClick={() => dl('pdf', 'pdf')} />
          <ExportRow icon={<DocIcon />} color="#3b82f6" bg="#eff6ff" label="Word (DOCX)" sublabel="Microsoft Word" gratuit disabled={!has} onClick={() => dl('docx', 'docx')} />
          <ExportRow icon={<TxtIcon />} color="var(--ink-muted)" bg="var(--bg-warm)" label="Texte brut (TXT)" sublabel="Avec horodatages" gratuit disabled={!has} onClick={() => dl('txt', 'txt')} />
          <ExportRow icon={<SrtIcon />} color="#8b5cf6" bg="#f5f3ff" label="Sous-titres (SRT)" sublabel="Format standard" gratuit disabled={!has} onClick={() => dl('srt', 'srt')} />
          <ExportRow icon={<Mp3Icon />} color="#f59e0b" bg="#fffbeb" label="Audio (MP3)" sublabel="Fichier original" gratuit disabled={!has} onClick={() => dl('mp3', 'mp3')} />
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '0 0 14px' }} />

        {/* Actions */}
        <SectionLabel label="Actions" />
        <div style={{ marginBottom: 14 }}>
          <ExportRow
            icon={copied ? <CheckIcon style={{ color: '#16a34a' }} /> : <CopyIcon />}
            color={copied ? '#16a34a' : 'var(--ink-muted)'}
            bg={copied ? '#f0fdf4' : 'var(--bg-warm)'}
            label={copied ? 'Copié !' : 'Copier le texte'}
            sublabel="Vers le presse-papier"
            disabled={!has}
            onClick={handleCopy}
            success={copied}
          />
          <ExportRow icon={<MdIcon />} color="#16a34a" bg="#f0fdf4" label="Markdown (.md)" sublabel="Format structuré" gratuit disabled={!has} onClick={() => dl('md', 'md')} />
        </div>
      </div>

      {/* Stats footer */}
      <div style={{ padding: 14, borderTop: '1px solid var(--border)' }}>
        {has ? (
          <div style={{ background: 'linear-gradient(160deg, var(--ac-red-wash), var(--bg-warm))', border: '1px solid var(--ac-red-line)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
            <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10 }}>Statistiques</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <StatRow icon={<SegIcon />} label="Segments" value={transcript.segments.length} />
              <StatRow icon={<ClockIcon />} label="Durée" value={formatDuration(transcript.segments.at(-1)?.end ?? 0)} />
              <StatRow icon={<WordIcon />} label="Mots (approx.)" value={countWords(transcript.exports?.txt || '').toLocaleString()} />
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg-warm)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', margin: '0 auto 8px' }}>
              <LockIcon />
            </div>
            <p style={{ fontSize: 11, color: 'var(--ink-muted)', fontWeight: 600, lineHeight: 1.5 }}>Actions disponibles<br />après transcription</p>
          </div>
        )}
      </div>
    </aside>
  )
}

function SectionLabel({ label }) {
  return <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--ink-faint)', padding: '0 6px 8px' }}>{label}</p>
}

function ExportRow({ icon, color, bg, label, sublabel, gratuit, disabled, onClick, success }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled && !success}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 8px', borderRadius: 'var(--r)', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: hov && !disabled ? 'var(--bg-warm)' : 'transparent',
        opacity: disabled ? 0.4 : 1,
        transition: 'background .15s, opacity .15s',
        marginBottom: 2, textAlign: 'left',
      }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 8, background: bg, display: 'grid', placeItems: 'center', flexShrink: 0, color }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        {sublabel && <div style={{ fontSize: 10.5, color: 'var(--ink-muted)', marginTop: 1 }}>{sublabel}</div>}
      </div>
      {gratuit && (
        <span style={{ fontSize: 9, fontWeight: 800, background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: 99, flexShrink: 0, letterSpacing: '.3px' }}>
          Gratuit
        </span>
      )}
      {!disabled && !gratuit && (
        <DownloadIcon style={{ color: 'var(--ink-faint)', flexShrink: 0 }} />
      )}
    </button>
  )
}

function StatRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--ac-red)', display: 'flex' }}>{icon}</span>
        <span style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{label}</span>
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}

/* Icons */
function ExportIcon({ style }) { return <svg style={{ width: 15, height: 15, ...style }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> }
function PDFIcon() { return <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="15" y2="13"/></svg> }
function DocIcon() { return <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg> }
function TxtIcon() { return <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="14" y2="14"/><line x1="4" y1="18" x2="10" y2="18"/></svg> }
function SrtIcon() { return <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 9l3.5 3L7 15M13 15h4"/></svg> }
function Mp3Icon() { return <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function CopyIcon() { return <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> }
function MdIcon() { return <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="15" y2="13"/></svg> }
function CheckIcon({ style }) { return <svg style={{ width: 15, height: 15, ...style }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> }
function DownloadIcon({ style }) { return <svg style={{ width: 14, height: 14, ...style }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> }
function LockIcon() { return <svg style={{ width: 16, height: 16, color: 'var(--ink-faint)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> }
function SegIcon() { return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="12" y2="14"/></svg> }
function ClockIcon() { return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> }
function WordIcon() { return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg> }
