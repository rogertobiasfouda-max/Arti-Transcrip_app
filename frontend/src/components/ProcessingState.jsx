import { useState, useEffect } from 'react'

const STEPS = [
  { label: 'Envoi du fichier',     desc: 'Upload sécurisé en cours…',          icon: UploadIcon  },
  { label: 'Analyse audio',        desc: 'Détection langue et découpage…',      icon: WaveformIcon },
  { label: 'Transcription IA',     desc: 'Whisper traite votre audio…',         icon: BrainIcon   },
  { label: 'Finalisation',         desc: 'Organisation des paragraphes…',       icon: SparkleIcon },
]
const DELAYS = [0, 2000, 5000, 12000]

const BARS = Array.from({ length: 16 }, (_, i) => {
  const h = [.3, .7, 1, .6, .85, .45, .9, .55, 1, .4, .75, .3, .65, .9, .5, .7][i]
  return h
})

export default function ProcessingState() {
  const [step, setStep]       = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timers = DELAYS.slice(1).map((d, i) => setTimeout(() => setStep(i + 1), d))
    const ticker = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => { timers.forEach(clearTimeout); clearInterval(ticker) }
  }, [])

  const progress = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '0 24px' }}>
      <div style={{ background: 'var(--card)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', padding: '40px 36px', width: '100%', maxWidth: 420 }}>

        {/* Waveform */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: 52, marginBottom: 28 }}>
          {BARS.map((h, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                width: 5,
                height: `${h * 100}%`,
                borderRadius: 99,
                background: `linear-gradient(to top, var(--ac-red) 0%, #ff7a71 100%)`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: `${0.9 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Current step text */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.4px', marginBottom: 4 }}>
            {STEPS[step].label}…
          </p>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{STEPS[step].desc}</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done    = i < step
            const current = i === step
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 'var(--r)',
                  background: current ? 'var(--ac-red-wash)' : 'transparent',
                  border: current ? '1px solid var(--ac-red-line)' : '1px solid transparent',
                  transition: 'all .3s',
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 99, flexShrink: 0,
                  display: 'grid', placeItems: 'center', transition: 'all .5s',
                  background: done ? '#22c55e' : current ? 'var(--ac-red)' : 'var(--bg)',
                  boxShadow: current ? 'var(--shadow-red)' : 'none',
                  color: done || current ? '#fff' : 'var(--ink-faint)',
                }}>
                  {done
                    ? <CheckIcon />
                    : <Icon />
                  }
                </div>
                <span style={{
                  fontSize: 13, flex: 1, fontWeight: current ? 700 : 500, transition: 'color .3s',
                  color: done ? 'var(--ink-muted)' : current ? 'var(--ink)' : 'var(--ink-faint)',
                  textDecoration: done ? 'line-through' : 'none',
                }}>
                  {s.label}
                </span>
                {done && (
                  <span style={{ fontSize: 10, fontWeight: 800, background: '#dcfce7', color: '#16a34a', padding: '2px 7px', borderRadius: 99 }}>✓ OK</span>
                )}
                {current && (
                  <span style={{ fontSize: 10, fontWeight: 800, background: 'var(--ac-red-tint)', color: 'var(--ac-red-deep)', padding: '2px 7px', borderRadius: 99, animation: 'badge-bob 2s ease infinite' }}>En cours</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ height: 6, background: 'var(--bg)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: 'linear-gradient(to right, #ff5a4f, var(--ac-red))',
              width: `${progress}%`,
              transition: 'width 1s var(--ease)',
              boxShadow: 'var(--shadow-red)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
            <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontWeight: 600 }}>⏱ {elapsed}s écoulé{elapsed > 1 ? 's' : ''}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ac-red)' }}>{progress}%</span>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', fontWeight: 500 }}>
        La transcription peut prendre quelques secondes selon la durée de l&apos;audio.
      </p>
    </div>
  )
}

/* Icons (14×14) */
function CheckIcon() {
  return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
}
function UploadIcon() {
  return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
}
function WaveformIcon() {
  return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/></svg>
}
function BrainIcon() {
  return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
}
function SparkleIcon() {
  return <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
}
