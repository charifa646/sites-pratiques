'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MiniBookingWidget } from '@/components/MiniBookingWidget'

export function LandingHero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center pt-16 overflow-hidden">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% 0%, #ECFDF5 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 max-w-xl"
          >
            <div className="flex flex-col gap-4">
              <h1 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.25rem] leading-[1.1] font-semibold tracking-tight text-[#18181B]">
                Fini les<br />
                no-shows et
                <br />
                <span className="text-[#047857]">l&apos;argent perdu.</span>
              </h1>
              <p className="text-lg text-[#3F3F46] leading-relaxed max-w-[42ch]">
                Cadran permet a vos clients de reserver et payer leurs séances en avance, via Wave ou Orange Money.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="h-11 px-6 text-base font-medium text-white bg-[#047857] rounded-[10px] hover:bg-[#065F46] transition-colors duration-150 flex items-center shadow-[0_1px_2px_rgba(4,120,87,.24)] active:scale-[0.97]"
              >
                Creer ma page
              </Link>
              <Link
                href="/m/mariam-toure"
                className="h-11 px-5 text-base font-medium text-[#18181B] bg-white border border-[#E4E4E7] rounded-[10px] hover:bg-[#F4F4F5] transition-colors duration-150 flex items-center active:scale-[0.97]"
              >
                Voir une demo
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-[#71717A]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
                Gratuit pour démarrer
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
                Aucune installation
              </span>
            </div>
          </motion.div>

          {/* Right: live mini booking widget */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <MiniBookingWidget />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
