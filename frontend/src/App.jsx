import { useState, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import UploadZone from './components/UploadZone'
import TranscriptView from './components/TranscriptView'
import ExportPanel from './components/ExportPanel'
import ProcessingState from './components/ProcessingState'
import ErrorBanner from './components/ErrorBanner'

export default function App() {
  const [status, setStatus]         = useState('idle')   // idle | processing | done | error
  const [transcript, setTranscript] = useState(null)
  const [error, setError]           = useState(null)
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [quotaUsed, setQuotaUsed] = useState(() =>
    parseInt(localStorage.getItem('actiwork_quota') || '0', 10)
  )

  const handleUpload = useCallback(async (file) => {
    setStatus('processing')
    setError(null)
    setTranscript(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/transcribe', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ detail: 'Erreur serveur inconnue.' }))
        throw new Error(data.detail || `Erreur ${res.status}`)
      }
      const data = await res.json()
      setTranscript(data)
      setStatus('done')
      const n = quotaUsed + 1
      setQuotaUsed(n)
      localStorage.setItem('actiwork_quota', String(n))
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [quotaUsed])

  const handleReset = () => {
    setStatus('idle')
    setTranscript(null)
    setError(null)
  }

  return (
    <div className="flex flex-col h-screen bg-acti-bg bg-grid-pattern font-sans">
      <Header />

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar gauche */}
        <aside className="hidden lg:flex flex-col w-[268px] bg-white border-r border-gray-100/80 overflow-y-auto flex-shrink-0 shadow-sm">
          <Sidebar quotaUsed={quotaUsed} />
        </aside>

        {/* Contenu central */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <ErrorBanner message={error} onClose={() => setError(null)} />
          )}

          {(status === 'idle' || status === 'error') && (
            <UploadZone onUpload={handleUpload} />
          )}

          {status === 'processing' && <ProcessingState />}

          {status === 'done' && transcript && (
            <TranscriptView
              transcript={transcript}
              showTimestamps={showTimestamps}
              onToggleTimestamps={() => setShowTimestamps(v => !v)}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Panneau export droit */}
        <aside className="hidden lg:flex flex-col w-[240px] bg-white border-l border-gray-100/80 overflow-y-auto flex-shrink-0 shadow-sm">
          <ExportPanel transcript={transcript} />
        </aside>
      </div>
    </div>
  )
}
