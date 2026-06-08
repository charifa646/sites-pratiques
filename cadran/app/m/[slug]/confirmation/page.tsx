import { Suspense } from 'react'
import { ConfirmationClient } from './ConfirmationClient'

export function generateStaticParams() {
  return [{ slug: 'mariam-toure' }]
}

export default function Confirmation() {
  return (
    <Suspense fallback={null}>
      <ConfirmationClient />
    </Suspense>
  )
}
