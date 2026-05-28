import { useState, useEffect } from 'react'

const STEPS = [
  { label: 'Envoi du fichier',     desc: 'Upload sécurisé en cours…',          icon: UploadIcon  },
  { label: 'Analyse audio',        desc: 'Détection langue et découpage…',      icon: WaveformIcon },
  { label: 'Transcription IA',     desc: 'Whisper traite votre audio…',         icon: BrainIcon   },
  { label: 'Finalisation',         desc: 'Organisation des paragraphes…',       icon: SparkleIcon },
]
const DELAYS = [0, 2000, 5000, 12000]

const WAVE_HEIGHTS = [0.3, 0.7, 1.0, 0.6, 0.85, 0.45, 0.9, 0.55, 1.0, 0.4, 0.75, 0.3, 0.65, 0.9, 0.5]

export default function ProcessingState() {
  const [step, setStep]       = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timers = DELAYS.slice(1).map((d, i) =>
      setTimeout(() => setStep(i + 1), d)
    )
    const ticker = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => { timers.forEach(clearTimeout); clearInterval(ticker) }
  }, [])

  const progress = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-lifted border border-gray-100 p-10 w-full max-w-md">

        {/* Waveform animation */}
        <div className="flex items-end justify-center gap-1 h-14 mb-8">
          {WAVE_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="wave-bar rounded-full bg-gradient-to-t from-acti-blue to-blue-300"
              style={{
                width: '6px',
                height: `${h * 100}%`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: `${0.9 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Current step */}
        <div className="text-center mb-7">
          <p className="text-lg font-extrabold text-acti-dark mb-1">
            {STEPS[step].label}…
          </p>
          <p className="text-sm text-acti-muted">{STEPS[step].desc}</p>
        </div>

        {/* Step list */}
        <div className="space-y-2.5 mb-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done    = i < step
            const current = i === step
            const pending = i > step
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  current ? 'bg-acti-blue/5 border border-acti-blue/15' : ''
                }`}
              >
                {/* Status dot */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  done    ? 'bg-green-500 shadow-sm'
                  : current ? 'bg-acti-blue shadow-blue animate-pulse'
                  : 'bg-gray-100'
                }`}>
                  {done ? (
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${current ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </div>

                <span className={`text-sm flex-1 transition-colors duration-300 ${
                  done    ? 'text-gray-500 line-through decoration-gray-300'
                  : current ? 'text-acti-dark font-semibold'
                  : 'text-gray-300'
                }`}>
                  {s.label}
                </span>

                {done && (
                  <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ OK
                  </span>
                )}
                {current && (
                  <span className="text-[10px] text-acti-blue font-bold bg-acti-blue/10 px-2 py-0.5 rounded-full animate-pulse">
                    En cours
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-acti-blue to-blue-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-gray-400">⏱ {elapsed}s écoulé{elapsed > 1 ? 's' : ''}</span>
            <span className="text-[11px] font-semibold text-acti-blue">{progress}%</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        La transcription peut prendre quelques secondes selon la durée de l&apos;audio.
      </p>
    </div>
  )
}

/* ── Step icons ── */
function UploadIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
}
function WaveformIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
}
function BrainIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
}
function SparkleIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
}
function CheckIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
}
