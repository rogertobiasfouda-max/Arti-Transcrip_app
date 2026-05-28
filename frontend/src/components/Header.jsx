export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100/80 flex-shrink-0 z-30 relative">
      {/* Liseré tricolore premium */}
      <div className="flex h-[3px]">
        <div className="flex-1 bg-gradient-to-r from-acti-blue via-blue-500 to-blue-400" />
        <div className="w-6 bg-white" />
        <div className="flex-1 bg-gradient-to-r from-red-400 to-acti-red" />
      </div>

      <div className="flex items-center justify-between px-5 py-2.5">
        {/* Logo + nav */}
        <div className="flex items-center gap-7">
          {/* Logo */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 bg-gradient-to-br from-acti-blue to-blue-500 rounded-lg flex items-center justify-center shadow-blue">
              <MicIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[19px] font-extrabold tracking-tight text-acti-dark">Acti</span>
              <span className="text-[19px] font-extrabold tracking-tight text-acti-blue">work</span>
              <span className="text-[9px] font-bold bg-acti-blue/10 text-acti-blue px-1.5 py-0.5 rounded-full ml-0.5">
                AI
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Navigation principale">
            {['TARIFS', 'FAQ', 'BLOG'].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-gray-400 hover:text-acti-blue hover:bg-blue-50/80 rounded-lg transition-all duration-150"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {/* Nouveau bouton */}
          <button className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-acti-blue to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 shadow-blue hover:shadow-blue-lg active:scale-95 focus-ring">
            <PlusIcon className="w-3.5 h-3.5" />
            Nouvelle
          </button>

          {/* Notification */}
          <button className="relative w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 flex items-center justify-center transition-colors group focus-ring">
            <BellIcon className="w-4 h-4 text-gray-400 group-hover:text-acti-blue" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-acti-red rounded-full" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-100" />

          {/* User */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <span className="hidden md:block text-xs text-gray-400 truncate max-w-[150px] group-hover:text-gray-600 transition-colors">
              rogertobiasfouda@gmail.com
            </span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-acti-blue to-blue-400 text-white flex items-center justify-center text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
                R
              </div>
              <ChevronIcon className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function MicIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
