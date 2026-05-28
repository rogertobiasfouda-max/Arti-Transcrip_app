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
    <div className="flex flex-col h-full bg-white">

      {/* Panel header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-acti-blue/10 flex items-center justify-center">
            <ExportIcon className="w-3.5 h-3.5 text-acti-blue" />
          </div>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Exporter</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">

        {/* Export formats */}
        <SectionLabel label="Format de fichier" />
        <div className="space-y-0.5 mb-4">
          <ExportRow
            icon={<PDFIcon className="w-4 h-4 text-red-500" />}
            iconBg="bg-red-50"
            label="PDF"
            sublabel="Document formaté"
            badge="PRO"
            disabled
          />
          <ExportRow
            icon={<DocIcon className="w-4 h-4 text-blue-600" />}
            iconBg="bg-blue-50"
            label="Word (DOCX)"
            sublabel="Microsoft Word"
            badge="PRO"
            disabled
          />
          <ExportRow
            icon={<TxtIcon className="w-4 h-4 text-gray-500" />}
            iconBg="bg-gray-100"
            label="Texte brut (TXT)"
            sublabel="Avec horodatages"
            disabled={!has}
            onClick={() => dl('txt', 'txt')}
          />
          <ExportRow
            icon={<SrtIcon className="w-4 h-4 text-purple-600" />}
            iconBg="bg-purple-50"
            label="Sous-titres (SRT)"
            sublabel="Format standard"
            disabled={!has}
            onClick={() => dl('srt', 'srt')}
          />
        </div>

        <div className="h-px bg-gray-100 my-3" />

        {/* Actions */}
        <SectionLabel label="Actions" />
        <div className="space-y-0.5">
          <ExportRow
            icon={copied
              ? <CheckIcon className="w-4 h-4 text-green-600" />
              : <CopyIcon className="w-4 h-4 text-gray-500" />
            }
            iconBg={copied ? 'bg-green-50' : 'bg-gray-100'}
            label={copied ? 'Copié !' : 'Copier le texte'}
            sublabel="Vers le presse-papier"
            disabled={!has}
            onClick={handleCopy}
            success={copied}
          />
          <ExportRow
            icon={<MdIcon className="w-4 h-4 text-green-600" />}
            iconBg="bg-green-50"
            label="Markdown (.md)"
            sublabel="Format structuré"
            disabled={!has}
            onClick={() => dl('md', 'md')}
          />
          <ExportRow
            icon={<ShareIcon className="w-4 h-4 text-indigo-500" />}
            iconBg="bg-indigo-50"
            label="Partager"
            sublabel="Bientôt disponible"
            badge="SOON"
            disabled
          />
          <ExportRow
            icon={<EditIcon className="w-4 h-4 text-amber-500" />}
            iconBg="bg-amber-50"
            label="Renommer"
            sublabel="Bientôt disponible"
            badge="SOON"
            disabled
          />
        </div>
      </div>

      {/* Stats / locked */}
      <div className="p-3 border-t border-gray-100">
        {has ? (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
              Statistiques
            </p>
            <div className="space-y-2">
              <StatRow
                icon={<SegmentsIcon className="w-3 h-3 text-acti-blue" />}
                label="Segments"
                value={transcript.segments.length}
              />
              <StatRow
                icon={<ClockIcon className="w-3 h-3 text-purple-500" />}
                label="Durée"
                value={formatDuration(transcript.segments.at(-1)?.end ?? 0)}
              />
              <StatRow
                icon={<WordIcon className="w-3 h-3 text-green-500" />}
                label="Mots (approx.)"
                value={countWords(transcript.exports?.txt || '').toLocaleString()}
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <LockIcon className="w-4.5 h-4.5 text-gray-400" />
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-snug">
              Actions disponibles<br />après transcription
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ label }) {
  return (
    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2 px-1">
      {label}
    </p>
  )
}

function ExportRow({ icon, iconBg, label, sublabel, badge, disabled, onClick, success }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left transition-all duration-150
        ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : success
            ? 'bg-green-50 cursor-pointer'
            : 'hover:bg-gray-50 cursor-pointer hover:shadow-sm active:scale-[0.98]'
        }`}
    >
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-gray-700 truncate leading-snug">{label}</p>
        {sublabel && <p className="text-[10px] text-gray-400 leading-snug">{sublabel}</p>}
      </div>
      {badge === 'PRO' && (
        <span className="text-[9px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
          PRO
        </span>
      )}
      {badge === 'SOON' && (
        <span className="text-[9px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
          SOON
        </span>
      )}
      {!disabled && !badge && (
        <DownloadIcon className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
      )}
    </button>
  )
}

function StatRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] text-gray-500">{label}</span>
      </div>
      <span className="text-[11px] font-bold text-gray-700">{value}</span>
    </div>
  )
}

/* ── Icons ── */
function ExportIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> }
function PDFIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
function DocIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
function TxtIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h10M4 18h6" /></svg> }
function SrtIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" strokeWidth={1.5} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 9l3.5 3L7 15M13 15h4" /></svg> }
function CopyIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> }
function MdIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg> }
function ShareIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> }
function EditIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> }
function DownloadIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> }
function CheckIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> }
function LockIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> }
function SegmentsIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h8" /></svg> }
function ClockIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" /></svg> }
function WordIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> }
