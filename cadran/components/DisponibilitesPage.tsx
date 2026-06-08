'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

const INITIAL: Record<string, Set<string>> = {
  Lundi: new Set(['09:00', '10:00', '14:00', '15:00']),
  Mardi: new Set(['09:00', '10:00', '11:00', '14:00', '15:00']),
  Mercredi: new Set(['10:00', '11:00']),
  Jeudi: new Set(['09:00', '10:00', '14:00', '15:00', '16:00']),
  Vendredi: new Set(['09:00', '10:00', '11:00']),
  Samedi: new Set(),
}

export function DisponibilitesPage() {
  const [grid, setGrid] = useState<Record<string, Set<string>>>(INITIAL)

  function toggle(day: string, slot: string) {
    setGrid((prev) => {
      const next = { ...prev }
      const slots = new Set(prev[day])
      if (slots.has(slot)) slots.delete(slot)
      else slots.add(slot)
      next[day] = slots
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[900px]">
      <div>
        <h1 className="text-xl font-semibold text-[#18181B]">Mes disponibilités</h1>
        <p className="text-sm text-[#71717A] mt-1">
          Selectionnez les créneaux disponibles pour la prise de rendez-vous.
        </p>
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Grille de disponibilités">
            <thead>
              <tr>
                <th className="w-24 text-left pb-3">
                  <span className="sr-only">Heure</span>
                </th>
                {DAYS.map((d) => (
                  <th key={d} className="pb-3 text-xs font-medium text-[#71717A] text-center">
                    {d.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot} className="border-t border-[#F1F1F2]">
                  <td className="py-2 pr-4 text-xs tabular-nums text-[#71717A]">{slot}</td>
                  {DAYS.map((day) => {
                    const active = grid[day]?.has(slot)
                    return (
                      <td key={day} className="py-1.5 text-center">
                        <button
                          onClick={() => toggle(day, slot)}
                          aria-pressed={active}
                          aria-label={`${day} ${slot} ${active ? 'disponible' : 'indisponible'}`}
                          className={[
                            'w-8 h-8 rounded-[6px] mx-auto transition-colors duration-150',
                            active
                              ? 'bg-[#047857] hover:bg-[#065F46]'
                              : 'bg-[#F4F4F5] hover:bg-[#E4E4E7]',
                          ].join(' ')}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#F1F1F2]">
          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <span className="w-4 h-4 rounded-[3px] bg-[#047857]" />
            Disponible
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <span className="w-4 h-4 rounded-[3px] bg-[#F4F4F5] border border-[#E4E4E7]" />
            Indisponible
          </div>
        </div>
      </Card>
    </div>
  )
}
