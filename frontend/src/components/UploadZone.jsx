import { useState, useRef, useCallback } from 'react'

const ACCEPTED = '.mp3,.wav,.m4a,.ogg,.webm,.flac,.mp4'

const FORMATS = [
  { ext: 'MP3',  color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { ext: 'WAV',  color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { ext: 'M4A',  color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { ext: 'OGG',  color: 'bg-green-100 text-green-600 border-green-200' },
  { ext: 'FLAC', color: 'bg-pink-100 text-pink-600 border-pink-200' },
  { ext: 'WEBM', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
  { ext: 'MP4',  color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
]

const FEATURES = [
  { icon: LightningIcon, text: 'OpenAI Whisper',   color: 'text-yellow-500' },
  { icon: TargetIcon,    text: 'Précision > 95%',  color: 'text-green-500' },
  { icon: ClockIcon,     text: '~2 min / 30 min',  color: 'text-blue-500' },
  { icon: ShieldIcon,    text: 'Données sécurisées', color: 'text-purple-500' },
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in-up">
      <div className="w-full max-w-2xl">

        {/* Hero text */}
        <div className="text-center mb-7">
          <h2 className="text-2xl font-extrabold text-acti-dark mb-2 leading-tight">
            Transcription audio{' '}
            <span className="gradient-text">intelligente</span>
          </h2>
          <p className="text-sm text-acti-muted max-w-md mx-auto">
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
          aria-label="Zone de dépôt de fichier audio. Cliquez ou glissez un fichier."
          onKeyDown={(e) => e.key === 'Enter' && !selectedFile && inputRef.current?.click()}
          className={`
            relative rounded-2xl p-12 text-center select-none overflow-hidden
            border-2 transition-all duration-300
            ${dragging
              ? 'border-acti-blue bg-gradient-to-br from-blue-50 to-indigo-50/40 shadow-blue scale-[1.01] cursor-copy'
              : selectedFile
                ? 'border-green-400 bg-gradient-to-br from-green-50/60 to-emerald-50/30 cursor-default shadow-card'
                : 'border-dashed border-gray-200 bg-white hover:border-acti-blue hover:bg-blue-50/30 hover:shadow-card cursor-pointer'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {/* Background decor */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-acti-blue/3 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-acti-red/3 to-transparent rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          {!selectedFile ? (
            <div className="relative">
              {/* Animated icon */}
              <div className={`relative w-20 h-20 mx-auto mb-5 ${dragging ? 'scale-110' : 'animate-float'} transition-transform duration-300`}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-acti-blue to-blue-400 shadow-blue flex items-center justify-center">
                  <MicBigIcon className="w-9 h-9 text-white" />
                </div>
                {dragging && (
                  <>
                    <div className="absolute inset-0 rounded-2xl bg-acti-blue/20 animate-ping" />
                    <div className="absolute -inset-3 rounded-3xl bg-acti-blue/10 animate-ping" style={{ animationDelay: '200ms' }} />
                  </>
                )}
              </div>

              <h3 className="text-lg font-bold text-acti-dark mb-1.5">
                {dragging ? '📂 Relâchez pour déposer' : 'Glissez votre fichier audio ici'}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                ou{' '}
                <span className="text-acti-blue font-semibold underline underline-offset-2 hover:text-blue-700">
                  cliquez pour parcourir
                </span>
              </p>

              {/* Format pills */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {FORMATS.map(({ ext, color }) => (
                  <span key={ext} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${color}`}>
                    {ext}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-300 font-medium">Taille maximale · 100 Mo</p>
            </div>
          ) : (
            <div className="relative animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg flex items-center justify-center">
                <CheckIcon className="w-8 h-8 text-white" />
              </div>
              <p className="font-bold text-gray-800 text-lg mb-1.5 truncate max-w-sm mx-auto px-4">
                {selectedFile.name}
              </p>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <HddIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatSize(selectedFile.size)}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold">✓ Prêt à transcrire</span>
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(null); inputRef.current?.click() }}
                className="text-xs text-acti-blue hover:underline font-medium"
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
            className="mt-4 w-full bg-gradient-to-r from-acti-blue via-blue-600 to-blue-500 text-white font-bold py-4 rounded-2xl
                       hover:from-blue-700 hover:to-blue-500 active:scale-[0.99] transition-all duration-200
                       shadow-blue hover:shadow-blue-lg
                       focus:outline-none focus:ring-2 focus:ring-acti-blue focus:ring-offset-2
                       flex items-center justify-center gap-3 text-base tracking-wide"
          >
            <WaveIcon className="w-5 h-5" />
            Lancer la transcription
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}

        {/* Feature pills */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {FEATURES.map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 border border-gray-100 shadow-sm hover:shadow-card transition-shadow">
              <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
              <span className="text-[11px] text-gray-600 font-medium leading-snug">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Icons ── */
function MicBigIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
}
function CheckIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
}
function HddIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="8" rx="2" strokeWidth="1.5" /><circle cx="18" cy="12" r="1" fill="currentColor" /><circle cx="14" cy="12" r="1" fill="currentColor" /></svg>
}
function WaveIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
}
function ArrowRightIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
}
function LightningIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
}
function TargetIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><circle cx="12" cy="12" r="6" strokeWidth="1.5" /><circle cx="12" cy="12" r="2" strokeWidth="1.5" /></svg>
}
function ClockIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" /></svg>
}
function ShieldIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
}
