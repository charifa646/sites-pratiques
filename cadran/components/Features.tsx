'use client'

import { motion } from 'framer-motion'
import {
  CalendarDays,
  Smartphone,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Prise de rendez-vous en ligne',
    body: 'Votre page publique permet a vos clients de voir vos disponibilités et de reserver un créneau en autonomie, a toute heure.',
  },
  {
    icon: Smartphone,
    title: 'Paiement Wave & Orange Money',
    body: 'Integration native des deux wallets les plus utilises en Afrique de l\'Ouest. Le paiement se fait avant la séance.',
  },
  {
    icon: MessageCircle,
    title: 'Rappels WhatsApp automatiques',
    body: 'Votre client recoit un rappel la veille (J-1) et deux heures avant (H-2). Moins d\'oublis, plus de serieux.',
  },
  {
    icon: ShieldCheck,
    title: 'Anti no-show garanti',
    body: 'Quand la séance est payee d\'avance, le client s\'engage. Votre temps a de la valeur. Cadran le protege.',
  },
]

export function Features() {
  return (
    <section id="fonctionnalites" className="py-20 sm:py-24 bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Asymmetric header */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181B] leading-tight">
            Tout ce qu&apos;il faut<br />pour gérer votre activité.
          </h2>
          <p className="text-[#71717A] lg:pb-1 max-w-[45ch]">
            Cadran reunit en un seul outil ce que vous faisiez avant avec WhatsApp, Wave et votre agenda papier.
          </p>
        </div>

        {/* Features grid — asymmetric 2+2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-[16px] bg-white border border-[#E4E4E7] [box-shadow:0_1px_2px_rgba(24,24,27,.04),0_12px_30px_-14px_rgba(24,24,27,.08)] flex flex-col gap-3"
            >
              <div className="w-9 h-9 rounded-[8px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <f.icon size={16} className="text-[#047857]" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#18181B]">{f.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
