function downloadBlob(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ActionRow({ icon, label, sublabel, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
        focus:outline-none focus:ring-2 focus:ring-acti-blue
        ${disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-blue-50 cursor-pointer'
        }`}
      aria-label={label}
      title={disabled && !onClick ? 'Bientôt disponible' : label}
    >
      <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-acti-dark">{label}</p>
        {sublabel && <p className="text-xs text-acti-muted">{sublabel}</p>}
      </div>
    </button>
  )
}

export default function ExportPanel({ transcript }) {
  const has = !!transcript

  const dl = (key, ext) => {
    if (!has) return
    downloadBlob(transcript.exports[key], `${transcript.title}.${ext}`)
  }

  return (
    <div className="p-4 space-y-5">

      {/* Section Exporter */}
      <div>
        <p className="text-[11px] font-semibold text-acti-muted uppercase tracking-wider mb-2 px-1">
          Exporter
        </p>
        <div className="space-y-0.5">
          <ActionRow icon="📄" label="PDF"  sublabel="Bientôt disponible" disabled />
          <ActionRow icon="📝" label="DOCX" sublabel="Bientôt disponible" disabled />
          <ActionRow
            icon="📃"
            label="TXT"
            sublabel="Texte brut avec horodatages"
            onClick={() => dl('txt', 'txt')}
            disabled={!has}
          />
          <ActionRow
            icon="🎬"
            label="SRT"
            sublabel="Fichier de sous-titres"
            onClick={() => dl('srt', 'srt')}
            disabled={!has}
          />
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Section Plus */}
      <div>
        <p className="text-[11px] font-semibold text-acti-muted uppercase tracking-wider mb-2 px-1">
          Plus
        </p>
        <div className="space-y-0.5">
          <ActionRow
            icon="📋"
            label="Copier"
            sublabel="Tout le texte dans le presse-papier"
            onClick={() => has && navigator.clipboard.writeText(transcript.exports.txt)}
            disabled={!has}
          />
          <ActionRow
            icon="📥"
            label="Markdown"
            sublabel="Exporter en .md"
            onClick={() => dl('md', 'md')}
            disabled={!has}
          />
          <ActionRow icon="🔗" label="Partager"  sublabel="Bientôt disponible" disabled />
          <ActionRow icon="✏️" label="Renommer"  sublabel="Bientôt disponible" disabled />
        </div>
      </div>

      {!has && (
        <p className="text-xs text-acti-muted text-center italic px-2 pt-2">
          Les actions seront disponibles après la transcription.
        </p>
      )}
    </div>
  )
}
