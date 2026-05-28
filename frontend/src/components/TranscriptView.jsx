import { useState } from 'react'

/** Un paragraphe : liste de segments {ts, text} */
function Paragraph({ segments, showTimestamps }) {
  return (
    <p className="leading-relaxed text-gray-800 text-sm">
      {segments.map((seg, i) => (
        <span key={i}>
          {showTimestamps && (
            <span
              className="text-acti-muted text-[11px] font-mono mr-1 cursor-default"
              title={`Segment à ${seg.ts}`}
            >
              {seg.ts}
            </span>
          )}
          <span>{seg.text}</span>
          {i < segments.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}

export default function TranscriptView({
  transcript,
  showTimestamps,
  onToggleTimestamps,
  onReset,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript.exports.txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* En-tête titre + bouton réinitialiser */}
      <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-acti-dark break-all leading-tight">
            {transcript.title}
          </h1>
          <p className="text-sm text-acti-muted mt-0.5">{transcript.date}</p>
        </div>
        <button
          onClick={onReset}
          className="flex-shrink-0 text-xs text-gray-400 hover:text-acti-blue
                     border border-gray-200 rounded-lg px-3 py-1.5 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-acti-blue"
          aria-label="Nouvelle transcription"
        >
          + Nouvelle
        </button>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={onToggleTimestamps}
          aria-pressed={showTimestamps}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors
            focus:outline-none focus:ring-2 focus:ring-acti-blue
            ${showTimestamps
              ? 'bg-acti-blue text-white border-acti-blue'
              : 'text-gray-600 border-gray-200 hover:border-acti-blue hover:text-acti-blue'
            }`}
        >
          🕐 Afficher les horodatages
        </button>

        <button
          onClick={handleCopy}
          aria-label="Copier tout le texte"
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors
            focus:outline-none focus:ring-2 focus:ring-acti-blue
            ${copied
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'text-gray-600 border-gray-200 hover:border-acti-blue hover:text-acti-blue'
            }`}
        >
          {copied ? '✅ Copié !' : '📋 Copier'}
        </button>
      </div>

      {/* Corps de la transcription */}
      <div className="bg-white rounded-card shadow-card p-6 space-y-4">
        {transcript.paragraphs.length === 0 ? (
          <p className="text-acti-muted text-sm italic">Aucun texte détecté.</p>
        ) : (
          transcript.paragraphs.map((para, i) => (
            <Paragraph key={i} segments={para} showTimestamps={showTimestamps} />
          ))
        )}
      </div>

      {/* Stats */}
      <p className="text-xs text-gray-400 mt-3 text-right">
        {transcript.segments.length} segments · durée ≈{' '}
        {formatDuration(transcript.segments.at(-1)?.end ?? 0)}
      </p>
    </div>
  )
}

function formatDuration(seconds) {
  const s = Math.round(seconds)
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}
