import { useState, useRef, useCallback } from 'react'

const ACCEPTED = '.mp3,.wav,.m4a,.ogg,.webm,.flac,.mp4'

export default function UploadZone({ onUpload }) {
  const [dragging, setDragging]     = useState(false)
  const [selectedFile, setSelected] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (file) setSelected(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-2xl">

        {/* Zone de dépôt */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Zone de dépôt de fichier audio. Cliquez ou glissez un fichier."
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-card p-14 text-center cursor-pointer
            transition-all duration-200 select-none
            ${dragging
              ? 'border-acti-blue bg-blue-50 scale-[1.01]'
              : 'border-gray-300 bg-white hover:border-acti-blue hover:bg-blue-50/40'
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

          <div className="text-5xl mb-4" aria-hidden="true">🎙️</div>

          <p className="text-lg font-semibold text-acti-dark mb-1">
            Glissez un fichier audio ici
          </p>
          <p className="text-sm text-acti-muted mb-4">
            ou{' '}
            <span className="text-acti-blue font-semibold">cliquez pour parcourir</span>
          </p>
          <p className="text-xs text-gray-400">
            MP3 · WAV · M4A · OGG · FLAC — jusqu'à 100 Mo
          </p>

          {selectedFile && (
            <div className="mt-5 inline-flex items-center gap-2 bg-green-50 text-green-700
                            border border-green-200 rounded-lg px-4 py-2 text-sm font-medium">
              <span>✅</span>
              <span className="truncate max-w-[300px]">{selectedFile.name}</span>
            </div>
          )}
        </div>

        {/* Bouton Transcrire */}
        {selectedFile && (
          <button
            onClick={() => onUpload(selectedFile)}
            className="mt-4 w-full bg-acti-blue text-white font-semibold py-3.5 rounded-card
                       hover:bg-blue-800 active:scale-[0.99] transition-all
                       focus:outline-none focus:ring-2 focus:ring-acti-blue focus:ring-offset-2"
          >
            Transcrire
          </button>
        )}
      </div>
    </div>
  )
}
