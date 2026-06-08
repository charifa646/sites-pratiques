import { notFound } from 'next/navigation'
import { MOCK_COACH } from '@/lib/mock'
import { ConfirmationPage } from '@/components/ConfirmationPage'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    service?: string
    date?: string
    time?: string
    client?: string
    phone?: string
    method?: string
  }>
}

export default async function Confirmation({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams

  if (slug !== MOCK_COACH.slug) notFound()

  const service =
    MOCK_COACH.services.find((s) => s.id === sp.service) ?? MOCK_COACH.services[0]

  return (
    <ConfirmationPage
      coach={MOCK_COACH}
      service={service}
      date={sp.date ?? new Date().toISOString().split('T')[0]}
      time={sp.time ?? '09:00'}
      clientName={sp.client ?? 'Client'}
      phone={sp.phone ?? ''}
      method={(sp.method as 'wave' | 'orange') ?? 'wave'}
    />
  )
}
