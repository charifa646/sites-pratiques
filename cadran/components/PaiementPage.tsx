'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { type Coach, type Service, formatFCFA, formatDateShort } from '@/lib/mock'

type PaymentMethod = 'wave' | 'orange'

interface Props {
  coach: Coach
  service: Service
  date: string
  time: string
}

export function PaiementPage({ coach, service, date, time }: Props) {
  const router = useRouter()
  const [method, setMethod] = useState<PaymentMethod>('wave')
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [errors, setErrors] = useState<{ nom?: string; telephone?: string }>({})
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const e: typeof errors = {}
    if (!nom.trim()) e.nom = 'Veuillez entrer votre nom complet.'
    if (!telephone.trim()) e.telephone = 'Veuillez entrer votre numéro WhatsApp.'
    else if (!/^\+?\d[\d\s\-]{7,}$/.test(telephone.trim()))
      e.telephone = 'Numéro invalide. Incluez l\'indicatif pays.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handlePay() {
    if (!validate()) return
    setLoading(true)

    // Simulate payment gateway delay (1.5s)
    await new Promise((r) => setTimeout(r, 1500))

    const params = new URLSearchParams({
      service: service.id,
      date,
      time,
      client: nom,
      phone: telephone,
      method,
    })
    router.push(`/m/${coach.slug}/confirmation/?${params.toString()}`)
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href={`/m/${coach.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#71717A] hover:text-[#18181B] transition-colors mb-6"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Modifier la réservation
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
          {/* Left: form */}
          <Card className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-[#18181B]">Finaliser la réservation</h1>
              <p className="text-sm text-[#71717A]">Vos informations de contact</p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Nom complet"
                placeholder="Awa Cisse"
                value={nom}
                onChange={(e) => {
                  setNom(e.target.value)
                  if (errors.nom) setErrors((err) => ({ ...err, nom: undefined }))
                }}
                error={errors.nom}
                autoComplete="name"
              />
              <Input
                label="Téléphone WhatsApp"
                type="tel"
                placeholder="+221 77 000 00 00"
                value={telephone}
                onChange={(e) => {
                  setTelephone(e.target.value)
                  if (errors.telephone) setErrors((err) => ({ ...err, telephone: undefined }))
                }}
                error={errors.telephone}
                helper="Votre confirmation et rappels vous seront envoyés sur ce numéro."
                autoComplete="tel"
              />
            </div>

            {/* Payment method */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-[#18181B]">Mode de paiement</p>
              <div className="grid grid-cols-2 gap-2">
                {/* Wave */}
                <button
                  onClick={() => setMethod('wave')}
                  aria-pressed={method === 'wave'}
                  className={[
                    'flex items-center gap-2.5 p-3.5 rounded-[10px] border text-sm font-medium transition-all duration-150',
                    method === 'wave'
                      ? 'border-[#047857] bg-[#ECFDF5] text-[#047857]'
                      : 'border-[#E4E4E7] bg-white text-[#18181B] hover:border-[#A7F3D0]',
                  ].join(' ')}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: '#19B6E8' }}
                    aria-hidden="true"
                  />
                  Wave
                </button>
                {/* Orange Money */}
                <button
                  onClick={() => setMethod('orange')}
                  aria-pressed={method === 'orange'}
                  className={[
                    'flex items-center gap-2.5 p-3.5 rounded-[10px] border text-sm font-medium transition-all duration-150',
                    method === 'orange'
                      ? 'border-[#047857] bg-[#ECFDF5] text-[#047857]'
                      : 'border-[#E4E4E7] bg-white text-[#18181B] hover:border-[#A7F3D0]',
                  ].join(' ')}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: '#FF7900' }}
                    aria-hidden="true"
                  />
                  Orange Money
                </button>
              </div>
            </div>

            {/* Pay CTA */}
            <button
              onClick={handlePay}
              disabled={loading}
              className={[
                'h-12 w-full rounded-[10px] text-base font-semibold text-white',
                'bg-[#047857] hover:bg-[#065F46] active:scale-[0.98]',
                'transition-all duration-150 flex items-center justify-center gap-2',
                'shadow-[0_1px_2px_rgba(4,120,87,.24)]',
                'disabled:opacity-70 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Paiement en cours...
                </>
              ) : (
                <>Payer {formatFCFA(service.price)}</>
              )}
            </button>

            <p className="text-xs text-[#A1A1AA] text-center">
              Simulation prototype - aucun paiement réel n&apos;est effectué.
            </p>
          </Card>

          {/* Right: order summary */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Avatar initials={coach.initials} size="md" />
              <div>
                <p className="text-sm font-semibold text-[#18181B]">{coach.name}</p>
                <p className="text-xs text-[#71717A]">{coach.title}</p>
              </div>
            </div>

            <div className="border-t border-[#F1F1F2] pt-4 flex flex-col gap-2.5">
              <Row label="Service" value={service.name} />
              <Row label="Durée" value={`${service.duration} min`} mono />
              <Row label="Date" value={formatDateShort(date)} />
              <Row label="Heure" value={time} mono />
              <div className="border-t border-[#F1F1F2] pt-2.5 flex justify-between items-center">
                <span className="text-sm font-semibold text-[#18181B]">Total</span>
                <span className="text-base font-bold text-[#047857] tabular-nums">
                  {formatFCFA(service.price)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-[#71717A]">{label}</span>
      <span className={['text-xs text-[#18181B] font-medium text-right', mono ? 'tabular-nums' : ''].join(' ')}>
        {value}
      </span>
    </div>
  )
}
