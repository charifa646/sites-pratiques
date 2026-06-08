'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_COACH } from '@/lib/mock'

const NAV = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/services', label: 'Services', icon: Settings },
  { href: '/dashboard/disponibilités', label: 'Disponibilités', icon: Calendar },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-[100dvh] bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 border-r border-[#E4E4E7] bg-white">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[#F1F1F2]">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-[#18181B] text-base tracking-tight"
          >
            <span className="w-6 h-6 rounded-[6px] bg-[#047857] flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
                <path d="M7 3.5V7l2 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            Cadran
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-3">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-2.5 h-9 px-3 rounded-[8px] text-sm transition-colors duration-150',
                  active
                    ? 'bg-[#ECFDF5] text-[#047857] font-medium'
                    : 'text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]',
                ].join(' ')}
              >
                <item.icon size={15} strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          })}

          <div className="border-t border-[#F1F1F2] mt-2 pt-2">
            <Link
              href={`/m/${MOCK_COACH.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 h-9 px-3 rounded-[8px] text-sm text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
            >
              <ExternalLink size={15} strokeWidth={1.75} />
              Ma page publique
            </Link>
          </div>
        </nav>

        {/* Coach footer */}
        <div className="p-3 border-t border-[#F1F1F2]">
          <div className="flex items-center gap-2.5 p-2">
            <Avatar initials={MOCK_COACH.initials} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#18181B] truncate">{MOCK_COACH.name}</p>
              <p className="text-[10px] text-[#71717A] truncate">Coach</p>
            </div>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#71717A] hover:bg-[#F4F4F5] transition-colors"
              aria-label="Se deconnecter"
            >
              <LogOut size={13} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[#E4E4E7] flex items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#18181B] text-sm">
          <span className="w-5 h-5 rounded-[5px] bg-[#047857] flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.5" />
              <path d="M7 3.5V7l2 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          Cadran
        </Link>
        <Avatar initials={MOCK_COACH.initials} size="sm" />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
