import { useState, useCallback, useRef, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import UploadZone from './components/UploadZone'
import TranscriptView from './components/TranscriptView'
import ExportPanel from './components/ExportPanel'
import ProcessingState from './components/ProcessingState'
import ErrorBanner from './components/ErrorBanner'

export default function App() {
  const [status, setStatus]         = useState('idle')
  const [transcript, setTranscript] = useState(null)
  const [error, setError]           = useState(null)
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [audioUrl, setAudioUrl]     = useState(null)
  const audioBlobRef = useRef(null)

  // Nettoyer l'URL blob quand on reset
  useEffect(() => {
    return () => { if (audioBlobRef.current) URL.revokeObjectURL(audioBlobRef.current) }
  }, [])

  const handleUpload = useCallback(async (file) => {
    setStatus('processing')
    setError(null)
    setTranscript(null)
    // Créer une URL blob du fichier pour le lecteur audio
    if (audioBlobRef.current) URL.revokeObjectURL(audioBlobRef.current)
    const blobUrl = URL.createObjectURL(file)
    audioBlobRef.current = blobUrl
    setAudioUrl(blobUrl)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const controller = new AbortController()
      // Timeout 10 min pour les gros fichiers (Railway max = 300s, Whisper peut être lent)
      const timeout = setTimeout(() => controller.abort(), 10 * 60 * 1000)

      const res = await fetch('/transcribe', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout))

      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: 'Erreur serveur inconnue.' }))
        throw new Error(data.detail || `Erreur ${res.status}`)
      }
      const data = await res.json()
      setTranscript(data)
      setStatus('done')
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('La transcription a pris trop de temps (> 10 min). Essayez un fichier plus court.')
      } else if (err.message === 'Failed to fetch') {
        setError('Connexion au serveur impossible. Vérifiez votre connexion ou réessayez dans quelques instants.')
      } else {
        setError(err.message)
      }
      setStatus('error')
    }
  }, [])

  const handleReset = () => {
    setStatus('idle')
    setTranscript(null)
    setError(null)
    if (audioBlobRef.current) { URL.revokeObjectURL(audioBlobRef.current); audioBlobRef.current = null }
    setAudioUrl(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)', fontFamily: 'var(--font)', overflow: 'hidden' }}>

      <Header onNew={handleReset} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '264px minmax(0, 1fr) 296px', overflow: 'hidden', minHeight: 0 }}>

        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main style={{ overflowY: 'auto', background: 'var(--bg)' }}>
          {error && (
            <div style={{ padding: '16px 24px 0' }}>
              <ErrorBanner message={error} onClose={() => setError(null)} />
            </div>
          )}

          {(status === 'idle' || status === 'error') && (
            <UploadZone onUpload={handleUpload} />
          )}

          {status === 'processing' && <ProcessingState />}

          {status === 'done' && transcript && (
            <TranscriptView
              transcript={transcript}
              audioUrl={audioUrl}
              showTimestamps={showTimestamps}
              onToggleTimestamps={() => setShowTimestamps(v => !v)}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Export panel */}
        <ExportPanel transcript={transcript} />
      </div>
    </div>
  )
}
