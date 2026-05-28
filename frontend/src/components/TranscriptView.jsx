import { useState } from 'react'

function Paragraph({ segments, showTimestamps, index }) {
  return (
    <p className="leading-relaxed text-gray-700 text-sm group relative pl-0 hover:bg-blue-50/30 -mx-3 px-3 py-0.5 rounded-lg transition-colors duration-150">
      {segments.map((seg, i) => (
        <span key={i}>
          {showTimestamps && (
            <span
              className="inline-block text-acti-blue text-[10px] font-mono bg-acti-blue/8 px-1.5 py-0.5 rounded mr-1 cursor-default hover:bg-acti-blue/15 transition-colors"
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

export default function TranscriptView({ transcript, showTimestamps, onToggleTimestamps, onReset }) {
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript.exports.txt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = transcript.exports.txt
    ? transcript.exports.txt.split(/\s+/).filter(Boolean).length
    : 0

  const duration = formatDuration(transcript.segments.at(-1)?.end ?? 0)

  // Filter paragraphs if searching
  const filtered = search.trim()
    ? transcript.paragraphs.filter(para =>
        para.some(seg => seg.text.toLowerCase().includes(search.toLowerCase()))
      )
    : transcript.paragraphs

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">
                Transcription terminée
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-acti-dark break-words leading-tight mb-1">
              {transcript.title}
            </h1>
            <p className="text-xs text-acti-muted">{transcript.date}</p>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <StatChip icon={<SegIcon />} label={`${transcript.segments.length} segments`} color="blue" />
              <StatChip icon={<ClockIcon />} label={`Durée ${duration}`} color="purple" />
              <StatChip icon={<WordsIcon />} label={`≈ ${wordCount.toLocaleString()} mots`} color="green" />
            </div>
          </div>

          <button
            onClick={onReset}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-acti-blue
                       border border-gray-200 hover:border-acti-blue rounded-xl px-3 py-2
                       transition-all duration-150 focus-ring hover:bg-blue-50/50"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Nouvelle
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans le texte…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:border-acti-blue focus:ring-2 focus:ring-acti-blue/10
                       placeholder-gray-300 text-gray-700"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Toggle timestamps */}
        <button
          onClick={onToggleTimestamps}
          aria-pressed={showTimestamps}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all duration-150
            focus-ring
            ${showTimestamps
              ? 'bg-acti-blue text-white border-acti-blue shadow-blue'
              : 'text-gray-500 border-gray-200 hover:border-acti-blue hover:text-acti-blue hover:bg-blue-50/50'
            }`}
        >
          <ClockIcon2 className="w-3.5 h-3.5" />
          Horodatages
        </button>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all duration-150 focus-ring
            ${copied
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'text-gray-500 border-gray-200 hover:border-acti-blue hover:text-acti-blue hover:bg-blue-50/50'
            }`}
        >
          {copied
            ? <><CheckIcon className="w-3.5 h-3.5" /> Copié !</>
            : <><CopyIcon className="w-3.5 h-3.5" /> Copier</>
          }
        </button>
      </div>

      {/* Transcript body */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
        {search && (
          <div className="mb-4 pb-3 border-b border-gray-100">
            <span className="text-xs text-acti-blue font-semibold">
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour « {search} »
            </span>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <SearchIcon className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Aucun résultat trouvé.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((para, i) => (
              <Paragraph key={i} index={i} segments={para} showTimestamps={showTimestamps} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-xs text-gray-300">
          Transcrit avec Whisper AI · Actiwork
        </p>
        <p className="text-xs text-gray-400">
          {transcript.segments.length} segments · {duration}
        </p>
      </div>
    </div>
  )
}

function StatChip({ icon, label, color }) {
  const colors = {
    blue:   'bg-acti-blue/8 text-acti-blue',
    purple: 'bg-purple-50 text-purple-600',
    green:  'bg-green-50 text-green-600',
  }
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${colors[color]}`}>
      <span className="w-3 h-3">{icon}</span>
      {label}
    </div>
  )
}

function formatDuration(seconds) {
  const s = Math.round(seconds)
  if (s < 60)   return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}

/* ── Icons ── */
function PlusIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> }
function SearchIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function XIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> }
function CopyIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> }
function CheckIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> }
function ClockIcon2({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" /></svg> }
function SegIcon() { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" /></svg> }
function ClockIcon() { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" /></svg> }
function WordsIcon() { return <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10" /></svg> }
