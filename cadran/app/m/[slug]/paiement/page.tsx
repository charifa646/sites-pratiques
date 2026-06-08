import { notFound } from 'next/navigation'
import { MOCK_COACH } from '@/lib/mock'
import { PaiementPage } from '@/components/PaiementPage'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string; date?: string; time?: string }>
}

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { service, date, time } = await searchParams

  if (slug !== MOCK_COACH.slug) notFound()

  const selectedService =
    MOCK_COACH.services.find((s) => s.id === service) ?? MOCK_COACH.services[0]

  return (
    <PaiementPage
      coach={MOCK_COACH}
      service={selectedService}
      date={date ?? new Date().toISOString().split('T')[0]}
      time={time ?? '09:00'}
    />
  )
}
