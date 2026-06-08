'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const PROFILES = [
  { label: 'Coachs de vie', desc: 'Bilan, objectifs, transformation personnelle' },
  { label: 'Coachs en carriere', desc: 'CV, entretiens, reconversion professionnelle' },
  { label: 'Consultants RH', desc: 'Recrutement, formation, conseil organisationnel' },
  { label: 'Therapeutes', desc: 'Sophrologie, PNL, gestion du stress' },
  { label: 'Formateurs', desc: 'Packs de formation, ateliers collectifs' },
  { label: 'Mentors', desc: 'Accompagnement entrepreneurial, startups' },
]

export function PourQui() {
  return (
    <section className="py-20 sm:py-24 bg-white border-t border-[#F1F1F2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#18181B]">
                Pour tous les pros<br />de l&apos;accompagnement.
              </h2>
              <p className="text-[#71717A] max-w-[44ch]">
                Que vous soyez coach, consultant ou formateur, Cadran s&apos;adapte a votre facon de travailler.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex h-11 px-6 items-center text-base font-medium text-white bg-[#047857] rounded-[10px] hover:bg-[#065F46] transition-colors duration-150 w-fit shadow-[0_1px_2px_rgba(4,120,87,.24)] active:scale-[0.97]"
            >
              Commencer gratuitement
            </Link>
          </motion.div>

          {/* Right: profiles grid */}
          <div className="grid grid-cols-2 gap-3">
            {PROFILES.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 rounded-[12px] bg-[#FAFAFA] border border-[#F1F1F2] flex flex-col gap-1"
              >
                <p className="text-sm font-semibold text-[#18181B]">{p.label}</p>
                <p className="text-xs text-[#71717A] leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
