import { Suspense } from 'react'
import { PaiementClient } from './PaiementClient'

export function generateStaticParams() {
  return [{ slug: 'mariam-toure' }]
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <PaiementClient />
    </Suspense>
  )
}
