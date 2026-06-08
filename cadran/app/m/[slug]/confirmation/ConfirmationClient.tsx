'use client'

import { useSearchParams } from 'next/navigation'
import { MOCK_COACH } from '@/lib/mock'
import { ConfirmationPage } from '@/components/ConfirmationPage'

export function ConfirmationClient() {
  const sp = useSearchParams()
  const service =
    MOCK_COACH.services.find((s) => s.id === sp.get('service')) ?? MOCK_COACH.services[0]

  return (
    <ConfirmationPage
      coach={MOCK_COACH}
      service={service}
      date={sp.get('date') ?? new Date().toISOString().split('T')[0]}
      time={sp.get('time') ?? '09:00'}
      clientName={sp.get('client') ?? 'Client'}
      phone={sp.get('phone') ?? ''}
      method={(sp.get('method') as 'wave' | 'orange') ?? 'wave'}
    />
  )
}
