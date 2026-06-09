'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { type Coach, type Service, getMockAvailability, formatFCFA, formatDateShort } from '@/lib/mock'

interface Props {
  coach: Coach
}

const TODAY = new Date().toISOString().split('T')[0]

function firstAvailableDay(weekStart: string): string | null {
  return (
    getMockAvailability(weekStart)
      .slice(0, 7)
      .find((d) => d.slots.some((s) => s.available))?.date ?? null
  )
}

export function BookingPage({ coach }: Props) {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<Service>(coach.services[0])
  const [weekOffset, setWeekOffset] = useState(0)
  // Pre-select the first available day so slots show immediately (no empty default).
  const [selectedDate, setSelectedDate] = useState<string | null>(() => firstAvailableDay(TODAY))
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Calculate week start
  const weekStart = useMemo(() => {
    const d = new Date(TODAY)
    d.setDate(d.getDate() + weekOffset * 7)
    return d.toISOString().split('T')[0]
  }, [weekOffset])

  const availability = useMemo(() => getMockAvailability(weekStart), [weekStart])

  const selectedDaySlots = useMemo(
    () => availability.find((d) => d.date === selectedDate)?.slots ?? [],
    [availability, selectedDate],
  )

  // When the visible week changes, reset the time and auto-select the first
  // available day of that week (so the slot grid is never empty by default).
  useEffect(() => {
    setSelectedTime(null)
    const week = availability.slice(0, 7)
    const stillValid = week.some(
      (d) => d.date === selectedDate && d.slots.some((s) => s.available),
    )
    if (!stillValid) setSelectedDate(firstAvailableDay(weekStart))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart])

  function handleContinue() {
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    const params = new URLSearchParams({
      service: selectedService.id,
      date: selectedDate,
      time: selectedTime,
    })
    router.push(`/m/${coach.slug}/paiement/?${params.toString()}`)
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

          {/* Left: coach profile */}
          <aside>
            <Card className="p-6 flex flex-col gap-5 sticky top-8">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <Avatar initials={coach.initials} size="xl" />
                <div>
                  <h1 className="text-lg font-semibold text-[#18181B] leading-tight">
                    {coach.name}
                  </h1>
                  <p className="text-sm text-[#71717A] mt-0.5">{coach.title}</p>
                </div>
              </div>

              {/* City */}
              <div className="flex items-center gap-1.5 text-sm text-[#71717A]">
                <MapPin size={13} strokeWidth={1.75} />
                {coach.city}
              </div>

              {/* Bio */}
              <p className="text-sm text-[#3F3F46] leading-relaxed border-t border-[#F1F1F2] pt-4">
                {coach.bio}
              </p>

              {/* Services */}
              <div className="flex flex-col gap-2 border-t border-[#F1F1F2] pt-4">
                <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wide">
                  Choisir un service
                </p>
                {coach.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    aria-pressed={selectedService.id === s.id}
                    className={[
                      'w-full text-left p-3 rounded-[10px] border transition-all duration-150',
                      selectedService.id === s.id
                        ? 'border-[#047857] bg-[#ECFDF5]'
                        : 'border-[#E4E4E7] bg-white hover:border-[#A7F3D0] hover:bg-[#FAFAFA]',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className={[
                          'text-sm font-medium',
                          selectedService.id === s.id ? 'text-[#047857]' : 'text-[#18181B]',
                        ].join(' ')}>
                          {s.name}
                        </span>
                        <span className="text-xs text-[#71717A] flex items-center gap-1">
                          <Clock size={11} strokeWidth={1.75} />
                          {s.duration} min
                        </span>
                      </div>
                      <span className={[
                        'text-sm font-semibold tabular-nums shrink-0',
                        selectedService.id === s.id ? 'text-[#047857]' : 'text-[#18181B]',
                      ].join(' ')}>
                        {formatFCFA(s.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Right: calendar + slot picker */}
          <main>
            <Card className="p-6 flex flex-col gap-6">
              {/* Week navigation */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#18181B]">
                  Choisir une date
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                    disabled={weekOffset === 0}
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Semaine précédente"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setWeekOffset((w) => w + 1)}
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] transition-colors"
                    aria-label="Semaine suivante"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1">
                {availability.slice(0, 7).map((day) => {
                  const d = new Date(day.date + 'T00:00:00')
                  const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short' })
                  const dayNum = d.getDate()
                  const hasSlots = day.slots.some((s) => s.available)
                  const isSelected = selectedDate === day.date

                  return (
                    <button
                      key={day.date}
                      onClick={() => {
                        if (hasSlots) {
                          setSelectedDate(day.date)
                          setSelectedTime(null)
                        }
                      }}
                      disabled={!hasSlots}
                      aria-label={formatDateShort(day.date)}
                      aria-pressed={isSelected}
                      className={[
                        'flex flex-col items-center py-2.5 rounded-[10px] transition-all duration-150 text-xs',
                        hasSlots
                          ? isSelected
                            ? 'bg-[#047857] text-white'
                            : 'hover:bg-[#ECFDF5] text-[#18181B] cursor-pointer'
                          : 'text-[#A1A1AA] cursor-not-allowed',
                      ].join(' ')}
                    >
                      <span className={['text-[10px] mb-0.5', isSelected ? 'text-emerald-200' : 'text-[#71717A]'].join(' ')}>
                        {dayLabel.slice(0, 3)}
                      </span>
                      <span className="font-semibold text-sm">{dayNum}</span>
                    </button>
                  )
                })}
              </div>

              {/* Time slots */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-[#18181B]">
                  {selectedDate
                    ? `Créneaux - ${formatDateShort(selectedDate)}`
                    : 'Créneaux disponibles'}
                </h3>

                {selectedDaySlots.length === 0 ? (
                  <p className="text-sm text-[#71717A] py-4 text-center">
                    Aucun créneau disponible cette semaine.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {selectedDaySlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        aria-pressed={selectedTime === slot.time}
                        className={[
                          'h-10 rounded-[10px] text-sm tabular-nums font-medium transition-all duration-150',
                          !slot.available
                            ? 'bg-[#F4F4F5] text-[#A1A1AA] cursor-not-allowed line-through'
                            : selectedTime === slot.time
                            ? 'bg-[#047857] text-white'
                            : 'bg-[#F4F4F5] text-[#18181B] hover:bg-[#ECFDF5] hover:text-[#047857]',
                        ].join(' ')}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary + CTA */}
              {selectedDate && selectedTime && (
                <div className="border-t border-[#F1F1F2] pt-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-[#18181B]">Récapitulatif</p>
                    <div className="bg-[#FAFAFA] rounded-[10px] border border-[#E4E4E7] p-4 flex flex-col gap-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#71717A]">Service</span>
                        <span className="font-medium text-[#18181B]">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#71717A]">Durée</span>
                        <span className="font-medium text-[#18181B] tabular-nums">{selectedService.duration} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#71717A]">Date</span>
                        <span className="font-medium text-[#18181B]">{formatDateShort(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#71717A]">Heure</span>
                        <span className="font-medium text-[#18181B] tabular-nums">{selectedTime}</span>
                      </div>
                      <div className="border-t border-[#E4E4E7] pt-2 flex justify-between">
                        <span className="text-sm font-semibold text-[#18181B]">Total</span>
                        <span className="text-base font-semibold text-[#047857] tabular-nums">
                          {formatFCFA(selectedService.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    loading={loading}
                    onClick={handleContinue}
                    className="w-full"
                  >
                    Continuer vers le paiement
                  </Button>
                  <div className="flex justify-center">
                    <Badge variant="paid">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#047857]" aria-hidden="true" />
                      Paiement sécurisé Wave / Orange Money
                    </Badge>
                  </div>
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
