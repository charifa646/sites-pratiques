'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MOCK_COACH, formatFCFA } from '@/lib/mock'

export function ServicesPage() {
  const [activeServices, setActiveServices] = useState<Set<string>>(
    new Set(MOCK_COACH.services.map((s) => s.id)),
  )

  function toggle(id: string) {
    setActiveServices((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[800px]">
      <div>
        <h1 className="text-xl font-semibold text-[#18181B]">Mes services</h1>
        <p className="text-sm text-[#71717A] mt-1">
          Activez ou desactivez les services visibles sur votre page publique.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_COACH.services.map((s) => {
          const active = activeServices.has(s.id)
          return (
            <Card key={s.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#18181B]">{s.name}</p>
                  {active ? (
                    <Badge variant="paid">Actif</Badge>
                  ) : (
                    <Badge variant="default">Inactif</Badge>
                  )}
                </div>
                <p className="text-xs text-[#71717A] leading-relaxed max-w-[60ch]">{s.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-[#71717A]">
                    <Clock size={11} strokeWidth={1.75} />
                    {s.duration} min
                  </span>
                  <span className="text-xs font-semibold text-[#047857] tabular-nums">
                    {formatFCFA(s.price)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggle(s.id)}
                aria-pressed={active}
                aria-label={`${active ? 'Desactiver' : 'Activer'} ${s.name}`}
                className={[
                  'relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0',
                  active ? 'bg-[#047857]' : 'bg-[#E4E4E7]',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-sm',
                    active ? 'translate-x-5' : 'translate-x-0',
                  ].join(' ')}
                />
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
