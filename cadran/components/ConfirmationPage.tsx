'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Calendar, MessageCircle, Bell } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { type Coach, type Service, formatFCFA, formatDate } from '@/lib/mock'

interface Props {
  coach: Coach
  service: Service
  date: string
  time: string
  clientName: string
  phone: string
  method: 'wave' | 'orange'
}

export function ConfirmationPage({ coach, service, date, time, clientName, phone, method }: Props) {
  const methodLabel = method === 'wave' ? 'Wave' : 'Orange Money'

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] py-12 sm:py-16">
      <div className="max-w-[520px] mx-auto px-4 sm:px-6 flex flex-col gap-6">

        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center">
            <CheckCircle size={30} className="text-[#047857]" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#18181B]">Réservation confirmée</h1>
            <p className="text-[#71717A]">
              Votre paiement a été accepté. À bientôt, {clientName.split(' ')[0]}.
            </p>
          </div>
          <Badge variant="paid">
            Payé via {methodLabel}
          </Badge>
        </motion.div>

        {/* Booking recap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar initials={coach.initials} size="md" />
              <div>
                <p className="text-sm font-semibold text-[#18181B]">{coach.name}</p>
                <p className="text-xs text-[#71717A]">{coach.title}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-[#F1F1F2] pt-3">
              <RecapRow label="Service" value={service.name} />
              <RecapRow label="Date" value={formatDate(date)} />
              <RecapRow label="Heure" value={time} mono />
              <RecapRow label="Durée" value={`${service.duration} min`} mono />
              <RecapRow label="Client" value={clientName} />
              {phone && <RecapRow label="WhatsApp" value={phone} mono />}
              <div className="border-t border-[#F1F1F2] pt-2 flex justify-between">
                <span className="text-sm font-semibold text-[#18181B]">Montant paye</span>
                <span className="text-sm font-bold text-[#047857] tabular-nums">
                  {formatFCFA(service.price)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Calendar add */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-[#047857]" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#18181B]">Ajouté à votre agenda</p>
              <p className="text-xs text-[#71717A]">Invitation calendrier envoyée sur {phone || 'votre WhatsApp'}</p>
            </div>
          </Card>
        </motion.div>

        {/* WhatsApp confirmation preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2"
        >
          <p className="text-xs font-medium text-[#71717A] uppercase tracking-wide px-1">
            Confirmation WhatsApp
          </p>
          <Card className="p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F1F1F2]">
              <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle size={13} className="text-white" fill="white" />
              </div>
              <span className="text-sm font-semibold text-[#18181B]">Cadran</span>
              <span className="text-xs text-[#A1A1AA] ml-auto tabular-nums">Maintenant</span>
            </div>
            <div className="bg-[#F4F4F5] rounded-[10px] p-3 text-sm text-[#18181B] leading-relaxed">
              <p>
                Bonjour {clientName.split(' ')[0]}, votre réservation est confirmée.
              </p>
              <p className="mt-1.5 text-[#3F3F46]">
                <strong>{service.name}</strong> avec {coach.name}
              </p>
              <p className="text-[#047857] font-medium tabular-nums mt-1">
                {formatDate(date)} a {time}
              </p>
              <p className="mt-1.5 text-xs text-[#71717A]">
                {formatFCFA(service.price)} - {methodLabel}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-3"
        >
          <p className="text-xs font-medium text-[#71717A] uppercase tracking-wide px-1">
            Ce qui va se passer
          </p>
          <div className="flex flex-col gap-2">
            <ReminderItem
              icon={Bell}
              label="Rappel J-1"
              desc="Un message WhatsApp vous sera envoyé la veille de la séance."
            />
            <ReminderItem
              icon={Bell}
              label="Rappel H-2"
              desc="Un second rappel deux heures avant pour ne rien oublier."
            />
          </div>
        </motion.div>

        {/* Back CTA */}
        <div className="flex justify-center pt-2">
          <Link
            href={`/m/${coach.slug}`}
            className="text-sm text-[#71717A] hover:text-[#18181B] transition-colors underline underline-offset-4"
          >
            Reserver une autre séance
          </Link>
        </div>
      </div>
    </div>
  )
}

function RecapRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-[#71717A]">{label}</span>
      <span className={['text-xs font-medium text-[#18181B] text-right max-w-[60%]', mono ? 'tabular-nums' : ''].join(' ')}>
        {value}
      </span>
    </div>
  )
}

function ReminderItem({
  icon: Icon,
  label,
  desc,
}: {
  icon: typeof Bell
  label: string
  desc: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-[10px] bg-white border border-[#F1F1F2]">
      <div className="w-7 h-7 rounded-[6px] bg-[#FEF3C7] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-[#B45309]" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-sm font-medium text-[#18181B]">{label}</p>
        <p className="text-xs text-[#71717A] leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
