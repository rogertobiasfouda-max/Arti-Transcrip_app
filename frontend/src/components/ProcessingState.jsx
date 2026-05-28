import { useState, useEffect } from 'react'

const STEPS = [
  'Envoi du fichier…',
  'Transcription en cours…',
  'Finalisation du texte…',
]
const DELAYS = [0, 2500, 9000]

export default function ProcessingState() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = DELAYS.slice(1).map((d, i) =>
      setTimeout(() => setStep(i + 1), d)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-card shadow-card p-10 text-center w-full max-w-md">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-acti-blue animate-spin" />
        </div>

        <p className="text-acti-dark font-semibold text-lg mb-1">{STEPS[step]}</p>
        <p className="text-sm text-acti-muted">
          Cela peut prendre quelques secondes selon la durée de l'audio.
        </p>

        {/* Indicateurs d'étapes */}
        <div className="flex justify-center gap-2 mt-6" aria-hidden="true">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-acti-blue' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
