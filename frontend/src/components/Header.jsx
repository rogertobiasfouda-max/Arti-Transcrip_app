export default function Header() {
  return (
    <header className="bg-white shadow-sm flex-shrink-0">
      {/* Liseré tricolore */}
      <div className="flex h-1">
        <div className="flex-1 bg-acti-blue" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-acti-red" />
      </div>

      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo + nav */}
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold tracking-tight select-none">
            <span className="text-acti-dark">Acti</span>
            <span className="text-acti-blue">work</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500" aria-label="Navigation principale">
            <a href="#" className="hover:text-acti-blue transition-colors">TARIFS</a>
            <a href="#" className="hover:text-acti-blue transition-colors">FAQ</a>
            <a href="#" className="hover:text-acti-blue transition-colors">BLOG</a>
          </nav>
        </div>

        {/* Utilisateur */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-gray-500 truncate max-w-[200px]">
            rogertobiasfouda@gmail.com
          </span>
          <div
            className="w-8 h-8 rounded-full bg-acti-blue text-white flex items-center justify-center text-sm font-bold flex-shrink-0"
            aria-label="Avatar utilisateur"
          >
            R
          </div>
        </div>
      </div>
    </header>
  )
}
