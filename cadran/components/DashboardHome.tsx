'use client'

import { useState } from 'react'
import { Copy, Check, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import {
  MOCK_COACH,
  MOCK_BOOKINGS,
  MOCK_KPIS,
  MOCK_REVENUE_CHART,
  formatFCFA,
} from '@/lib/mock'

const TODAY_BOOKINGS = MOCK_BOOKINGS.filter((b) => b.date === '2026-06-08')

export function DashboardHome() {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(`https://cadran.app/m/${MOCK_COACH.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maxAmount = Math.max(...MOCK_REVENUE_CHART.map((r) => r.amount))

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1100px] w-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#18181B]">
            Bonjour, {MOCK_COACH.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-[#71717A] mt-0.5">
            Lundi 8 juin 2026
          </p>
        </div>
        {/* Public link */}
        <div className="flex items-center gap-2 bg-white border border-[#E4E4E7] rounded-[10px] px-3 py-2 text-sm">
          <span className="text-[#A1A1AA] text-xs truncate max-w-[200px]">
            cadran.app/m/{MOCK_COACH.slug}
          </span>
          <button
            onClick={copyLink}
            className="flex items-center gap-1 text-xs font-medium text-[#047857] hover:text-[#065F46] transition-colors ml-1"
            aria-label="Copier le lien"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copie' : 'Copier'}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Encaisse ce mois"
          value={formatFCFA(MOCK_KPIS.encaisseMonth)}
          sub="+18% vs mai"
          accent
        />
        <KpiCard
          label="Séances a venir"
          value={String(MOCK_KPIS.seancesAVenir)}
          sub="7 jours"
        />
        <KpiCard
          label="Taux de remplissage"
          value={`${MOCK_KPIS.tauxRemplissage} %`}
          sub="cette semaine"
        />
        <KpiCard
          label="Reglees d'avance"
          value={`${MOCK_KPIS.paiementsAvance} %`}
          sub="100 % par design"
          accent
        />
      </div>

      {/* Main area: agenda + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* Agenda today */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#18181B]">Agenda du jour</h2>
            <span className="text-xs text-[#71717A]">Lundi 8 juin</span>
          </div>

          <div className="flex flex-col gap-2">
            {TODAY_BOOKINGS.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-3 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#F1F1F2]"
              >
                <Avatar initials={booking.clientInitials} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#18181B] truncate">{booking.clientName}</p>
                  <p className="text-xs text-[#71717A] truncate">{booking.service.name}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm tabular-nums text-[#18181B] font-medium">{booking.time}</span>
                  <Badge variant="paid" className="text-[10px] px-2 py-0.5">
                    {formatFCFA(booking.amount)}
                    <span className="text-[#A7F3D0]">·</span>
                    {booking.paymentMethod === 'wave' ? 'Wave' : 'Orange'}
                  </Badge>
                </div>
              </div>
            ))}

            {/* Free slot */}
            <div className="flex items-center gap-3 p-3 rounded-[10px] border border-dashed border-[#E4E4E7]">
              <div className="w-7 h-7 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0">
                <span className="text-[10px] text-[#A1A1AA]">--</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#A1A1AA]">Creneau libre</p>
              </div>
              <span className="text-sm tabular-nums text-[#A1A1AA]">17:00</span>
            </div>
          </div>
        </Card>

        {/* Revenue chart */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#18181B]">Revenus</h2>
            <div className="flex items-center gap-1 text-xs text-[#047857]">
              <TrendingUp size={12} strokeWidth={1.75} />
              +27%
            </div>
          </div>

          {/* Mini bar chart — CSS only */}
          <div className="flex items-end gap-2 h-[90px]" aria-label="Graphique revenus 6 derniers mois">
            {MOCK_REVENUE_CHART.map((r) => {
              const pct = (r.amount / maxAmount) * 100
              const isLast = r.month === 'Juin'
              return (
                <div key={r.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex items-end justify-center" style={{ height: 72 }}>
                    <div
                      className={[
                        'w-full rounded-[4px] transition-all',
                        isLast ? 'bg-[#047857]' : 'bg-[#D1FAE5]',
                      ].join(' ')}
                      style={{ height: `${pct}%` }}
                      title={`${r.month}: ${formatFCFA(r.amount)}`}
                    />
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] tabular-nums">{r.month}</span>
                </div>
              )
            })}
          </div>

          <div className="border-t border-[#F1F1F2] pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#71717A]">Ce mois</span>
              <span className="text-sm font-bold text-[#047857] tabular-nums">
                {formatFCFA(MOCK_KPIS.encaisseMonth)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming bookings (rest of week) */}
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#18181B]">Prochaines séances</h2>
          <span className="text-xs text-[#71717A]">Cette semaine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MOCK_BOOKINGS.filter((b) => b.date !== '2026-06-08').map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 p-3 rounded-[10px] border border-[#F1F1F2] bg-white"
            >
              <Avatar initials={b.clientInitials} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#18181B] truncate">{b.clientName}</p>
                <p className="text-xs text-[#71717A] truncate">{b.service.name}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs tabular-nums text-[#18181B] font-medium">{b.time}</span>
                <Badge variant="paid" className="text-[10px] px-1.5 py-0.5">Payé</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string
  value: string
  sub: string
  accent?: boolean
}) {
  return (
    <Card className="p-4 flex flex-col gap-1.5">
      <p className="text-xs text-[#71717A]">{label}</p>
      <p className={['text-xl font-bold tabular-nums', accent ? 'text-[#047857]' : 'text-[#18181B]'].join(' ')}>
        {value}
      </p>
      <p className="text-xs text-[#A1A1AA]">{sub}</p>
    </Card>
  )
}
