import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-[#F1F1F2] bg-white py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#047857] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
                <path d="M7 3.5V7l2 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-[#18181B]">Cadran</span>
            <span className="text-[#A1A1AA] text-sm ml-2">
              Prototype - pas de donnees réelles
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-4 text-sm text-[#71717A]">
            <Link href="/m/mariam-toure" className="hover:text-[#18181B] transition-colors">
              Demo réservations
            </Link>
            <Link href="/dashboard" className="hover:text-[#18181B] transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
