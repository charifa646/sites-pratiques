import { notFound } from 'next/navigation'
import { MOCK_COACH } from '@/lib/mock'
import { BookingPage } from '@/components/BookingPage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [{ slug: 'mariam-toure' }]
}

export default async function CoachBookingPage({ params }: Props) {
  const { slug } = await params

  // Only mock coach available
  if (slug !== MOCK_COACH.slug) {
    notFound()
  }

  return <BookingPage coach={MOCK_COACH} />
}
