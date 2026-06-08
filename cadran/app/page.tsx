import { Nav } from '@/components/Nav'
import { LandingHero } from '@/components/LandingHero'
import { HowItWorks } from '@/components/HowItWorks'
import { Features } from '@/components/Features'
import { PourQui } from '@/components/PourQui'
import { LandingFooter } from '@/components/LandingFooter'

export default function LandingPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-[100dvh]">
      <Nav />
      <main>
        <LandingHero />
        <HowItWorks />
        <Features />
        <PourQui />
      </main>
      <LandingFooter />
    </div>
  )
}
