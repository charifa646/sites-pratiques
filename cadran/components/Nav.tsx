import Link from 'next/link'

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-[#F1F1F2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[#18181B] text-lg tracking-tight"
          aria-label="Cadran - accueil"
        >
          <span className="w-7 h-7 rounded-lg bg-[#047857] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
              <path d="M7 3.5V7l2 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          Cadran
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#71717A]">
          <Link href="#comment-ca-marche" className="hover:text-[#18181B] transition-colors duration-150">
            Comment ca marche
          </Link>
          <Link href="#fonctionnalites" className="hover:text-[#18181B] transition-colors duration-150">
            Fonctionnalites
          </Link>
          <Link href="/dashboard" className="hover:text-[#18181B] transition-colors duration-150">
            Dashboard demo
          </Link>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="h-9 px-3 text-sm font-medium text-[#3F3F46] rounded-[10px] hover:bg-[#F4F4F5] transition-colors duration-150 flex items-center"
          >
            Se connecter
          </Link>
          <Link
            href="/dashboard"
            className="h-9 px-4 text-sm font-medium text-white bg-[#047857] rounded-[10px] hover:bg-[#065F46] transition-colors duration-150 flex items-center shadow-[0_1px_2px_rgba(4,120,87,.24)] active:scale-[0.97]"
          >
            Creer ma page
          </Link>
        </div>
      </div>
    </header>
  )
}
