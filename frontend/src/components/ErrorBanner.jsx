export default function ErrorBanner({ message, onClose }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-card px-4 py-3 mb-4 text-sm"
    >
      <span className="text-base mt-0.5">⚠️</span>
      <p className="flex-1 leading-snug">{message}</p>
      <button
        onClick={onClose}
        aria-label="Fermer l'erreur"
        className="text-red-400 hover:text-red-600 font-bold text-lg leading-none focus:outline-none"
      >
        ×
      </button>
    </div>
  )
}
