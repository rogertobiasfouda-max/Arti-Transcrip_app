const QUOTA_MAX = 3

export default function Sidebar({ quotaUsed }) {
  const used = Math.min(quotaUsed, QUOTA_MAX)
  const pct  = Math.round((used / QUOTA_MAX) * 100)

  return (
    <div className="flex flex-col h-full">

      {/* Carte quota */}
      <div className="m-4 rounded-xl bg-acti-sidebar text-white p-4">
        <p className="text-xs text-gray-400 mb-1 leading-snug">
          {used} des {QUOTA_MAX} transcriptions quotidiennes utilisées
        </p>
        <div className="h-1.5 bg-gray-700 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-acti-red rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={used}
            aria-valuemax={QUOTA_MAX}
          />
        </div>
        <button className="w-full text-xs font-semibold tracking-widest border border-gray-600 rounded-lg py-2 px-3 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-acti-blue">
          ↻ PASSER À ILLIMITÉ
        </button>
      </div>

      {/* Raccourcis */}
      <div className="px-4 py-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Raccourcis
        </p>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-acti-blue w-full py-1.5 px-2 rounded-lg hover:bg-blue-50 transition-colors">
          <IconClock />
          Fichiers récents
        </button>
      </div>

      <div className="h-px bg-gray-100 mx-4 my-1" />

      {/* Dossiers */}
      <div className="px-4 py-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Dossiers
        </p>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-acti-blue w-full py-1.5 px-2 rounded-lg hover:bg-blue-50 transition-colors">
          <IconPlus />
          Nouveau dossier
        </button>
      </div>
    </div>
  )
}

function IconClock() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
    </svg>
  )
}
