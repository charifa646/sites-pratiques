'use client'

import { useSearchParams } from 'next/navigation'
import { MOCK_COACH } from '@/lib/mock'
import { PaiementPage } from '@/components/PaiementPage'

export function PaiementClient() {
  const sp = useSearchParams()
  const service =
    MOCK_COACH.services.find((s) => s.id === sp.get('service')) ?? MOCK_COACH.services[0]
  const date = sp.get('date') ?? new Date().toISOString().split('T')[0]
  const time = sp.get('time') ?? '09:00'

  return <PaiementPage coach={MOCK_COACH} service={service} date={date} time={time} />
}
