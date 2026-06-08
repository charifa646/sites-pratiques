'use client'

import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Check } from 'lucide-react'

const DAYS = [
  { date: '09', label: 'Lun', active: false },
  { date: '10', label: 'Mar', active: true },
  { date: '11', label: 'Mer', active: false },
  { date: '12', label: 'Jeu', active: true },
  { date: '13', label: 'Ven', active: true },
]

const TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
const BOOKED = ['10:00', '14:00']

export function MiniBookingWidget() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  return (
    <Card className="w-full max-w-[340px] p-5 flex flex-col gap-4">
      {/* Coach header */}
      <div className="flex items-center gap-3">
        <Avatar initials="MT" size="lg" />
        <div>
          <p className="text-sm font-semibold text-[#18181B]">Mariam Toure</p>
          <p className="text-xs text-[#71717A]">Coach en leadership</p>
          <p className="text-xs text-[#A1A1AA]">Séance individuelle · 60 min</p>
        </div>
      </div>

      {/* Week strip */}
      <div>
        <p className="text-xs font-medium text-[#71717A] mb-2">Juin 2026</p>
        <div className="grid grid-cols-5 gap-1">
          {DAYS.map((day, i) => (
            <button
              key={day.date}
              onClick={() => {
                if (day.active) {
                  setSelectedDay(i)
                  setSelectedTime(null)
                }
              }}
              disabled={!day.active}
              className={[
                'flex flex-col items-center py-2 rounded-[8px] transition-all duration-150 text-xs',
                day.active
                  ? selectedDay === i
                    ? 'bg-[#047857] text-white'
                    : 'hover:bg-[#F4F4F5] text-[#18181B] cursor-pointer'
                  : 'text-[#A1A1AA] cursor-not-allowed',
              ].join(' ')}
            >
              <span className="font-medium">{day.date}</span>
              <span className="text-[10px] mt-0.5 opacity-70">{day.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div className="grid grid-cols-3 gap-1.5">
        {TIMES.map((t) => {
          const booked = BOOKED.includes(t)
          const selected = selectedTime === t
          return (
            <button
              key={t}
              onClick={() => !booked && setSelectedTime(t)}
              disabled={booked}
              className={[
                'h-9 rounded-[8px] text-sm tabular-nums transition-all duration-150',
                booked
                  ? 'bg-[#F4F4F5] text-[#A1A1AA] cursor-not-allowed line-through'
                  : selected
                  ? 'bg-[#047857] text-white font-medium'
                  : 'bg-[#F4F4F5] text-[#18181B] hover:bg-[#ECFDF5] hover:text-[#047857]',
              ].join(' ')}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* CTA */}
      {selectedTime ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-[#ECFDF5] rounded-[10px] px-3 py-2">
            <span className="text-xs text-[#047857]">
              Jeu 12 juin &middot; {selectedTime}
            </span>
            <span className="text-xs font-semibold text-[#047857] tabular-nums">
              25 000 F
            </span>
          </div>
          <button className="h-10 w-full bg-[#047857] text-white text-sm font-medium rounded-[10px] hover:bg-[#065F46] transition-colors duration-150 flex items-center justify-center gap-2 active:scale-[0.97]">
            <Check size={14} />
            Continuer
          </button>
        </div>
      ) : (
        <p className="text-xs text-[#A1A1AA] text-center">
          Selectionnez un créneau
        </p>
      )}
    </Card>
  )
}
