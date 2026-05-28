export default function ErrorBanner({ message, onClose }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3.5 mb-4 shadow-sm animate-fade-in"
    >
      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertIcon className="w-4 h-4 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-700 leading-snug mb-0.5">Erreur</p>
        <p className="text-xs text-red-500 leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Fermer l'erreur"
        className="w-6 h-6 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5"
      >
        <XIcon className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
      </button>
    </div>
  )
}

function AlertIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
