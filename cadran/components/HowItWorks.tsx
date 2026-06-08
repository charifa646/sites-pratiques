'use client'

import { motion } from 'framer-motion'
import { Link2, CreditCard, CalendarCheck } from 'lucide-react'

const STEPS = [
  {
    icon: Link2,
    number: '01',
    title: 'Créez votre page',
    body: 'Configurez vos services, vos tarifs et vos disponibilités en quelques minutes. Vous obtenez un lien unique a partager.',
  },
  {
    icon: CreditCard,
    number: '02',
    title: 'Le client paie en avance',
    body: 'Votre client choisit un créneau et paie directement via Wave ou Orange Money. Aucun echange d\'argent le jour J.',
  },
  {
    icon: CalendarCheck,
    number: '03',
    title: 'La séance a lieu',
    body: 'Le client recoit une confirmation et un rappel WhatsApp. Vous etes paye, la séance est confirmée. Zéro no-show.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      className="py-20 sm:py-24 bg-white border-y border-[#F1F1F2]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181B] max-w-[30ch]">
            Simple pour vous.<br />Simple pour vos clients.
          </h2>
          <p className="text-[#71717A] max-w-[50ch]">
            Trois etapes, pas plus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 p-6 rounded-[16px] bg-[#FAFAFA] border border-[#F1F1F2]"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-[10px] bg-[#ECFDF5] flex items-center justify-center">
                  <step.icon size={18} className="text-[#047857]" strokeWidth={1.75} />
                </div>
                <span className="text-2xl font-semibold text-[#E4E4E7] tabular-nums select-none">
                  {step.number}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-[#18181B]">{step.title}</h3>
                <p className="text-sm text-[#71717A] leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
