const QUOTA_MAX = 3

const RECENT_FILES = [
  { name: 'Réunion_équipe_23mai', date: 'il y a 2h', duration: '32 min' },
  { name: 'Appel_client_ACME', date: 'hier', duration: '18 min' },
  { name: 'Interview_podcast_ep12', date: '26 mai', duration: '54 min' },
]

export default function Sidebar({ quotaUsed }) {
  const used = Math.min(quotaUsed, QUOTA_MAX)
  const pct  = used / QUOTA_MAX

  // SVG circular progress
  const r = 26
  const circ = 2 * Math.PI * r
  const offset = circ - pct * circ
  const ringColor = used >= QUOTA_MAX ? '#E1251B' : '#3B82F6'

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Quota card — dark premium */}
      <div className="m-3 rounded-xl bg-gradient-to-br from-[#1a2235] to-[#232d42] text-white p-4 shadow-lifted">
        {/* Ring + info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <svg width="60" height="60" className="-rotate-90" aria-hidden="true">
              <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle
                cx="30" cy="30" r={r}
                fill="none"
                stroke={ringColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-extrabold leading-none text-white">{used}</span>
              <span className="text-[9px] text-gray-500 leading-none mt-0.5">/{QUOTA_MAX}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold text-white">Plan Gratuit</span>
              <span className="text-[9px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">FREE</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              {Math.max(0, QUOTA_MAX - used)} transcription{QUOTA_MAX - used !== 1 ? 's' : ''} restante{QUOTA_MAX - used !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: QUOTA_MAX }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i < used ? 'flex-1 bg-acti-red' : 'flex-1 bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade button */}
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-acti-blue to-blue-400 text-white text-[11px] font-bold tracking-wider py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-blue active:scale-[0.98] focus-ring">
          <LightningIcon className="w-3.5 h-3.5" />
          PASSER À ILLIMITÉ
        </button>
      </div>

      {/* Navigation */}
      <div className="px-3 py-1">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1.5 px-2 mt-1">
          Navigation
        </p>
        {[
          { icon: HomeIcon,   label: 'Tableau de bord',  active: false, badge: null },
          { icon: ClockIcon,  label: 'Fichiers récents', active: true,  badge: String(RECENT_FILES.length) },
          { icon: FolderIcon, label: 'Mes dossiers',     active: false, badge: null },
          { icon: StarIcon,   label: 'Favoris',          active: false, badge: null },
        ].map(({ icon: Icon, label, active, badge }) => (
          <button
            key={label}
            className={`flex items-center gap-2.5 text-sm w-full py-2 px-3 rounded-xl mb-0.5 transition-all duration-150
              ${active
                ? 'bg-acti-blue/10 text-acti-blue font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-acti-blue font-medium'
              }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-acti-blue' : 'text-gray-400'}`} />
            <span className="flex-1 text-left text-xs">{label}</span>
            {badge && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                active ? 'bg-acti-blue text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {badge}
              </span>
            )}
            {active && !badge && <span className="w-1.5 h-1.5 rounded-full bg-acti-blue ml-auto" />}
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-100 mx-3 my-2" />

      {/* Recent files */}
      <div className="px-3 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1.5 px-2">
          Récents
        </p>
        {RECENT_FILES.map((file, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition-colors mb-0.5 text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-acti-blue/8 border border-acti-blue/10 flex items-center justify-center flex-shrink-0">
              <AudioIcon className="w-3.5 h-3.5 text-acti-blue/70" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-gray-700 truncate group-hover:text-acti-blue transition-colors leading-snug">
                {file.name}
              </p>
              <p className="text-[10px] text-gray-400 leading-snug">
                {file.date} · {file.duration}
              </p>
            </div>
          </button>
        ))}

        <button className="flex items-center gap-2 text-[11px] text-acti-blue font-semibold px-2.5 py-2 hover:bg-blue-50 rounded-xl transition-colors w-full mt-1">
          <PlusIcon className="w-3.5 h-3.5" />
          Nouveau dossier
        </button>
      </div>

      {/* Status footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] text-gray-400 font-medium">Whisper AI · En ligne</span>
          </div>
          <button className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors">
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Icons ── */
function HomeIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
}
function ClockIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" /></svg>
}
function FolderIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
}
function StarIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
}
function AudioIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
}
function LightningIcon({ className }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
}
function PlusIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
}
function SettingsIcon({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
