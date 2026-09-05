import Link from 'next/link'
import Countdown from '@/components/Countdown'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-6 py-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Colorful Floral Corner Decorations */}
      <CornerFloralDecoration position="top-left" className="absolute top-0 left-0 z-10" />
      <CornerFloralDecoration position="top-right" className="absolute top-0 right-0 z-10" />
      <CornerFloralDecoration position="bottom-left" className="absolute bottom-0 left-0 z-10" />
      <CornerFloralDecoration position="bottom-right" className="absolute bottom-0 right-0 z-10" />

      {/* Floating Petals */}
      <FloatingPetals count={6} />

      <div className="max-w-2xl w-full text-center space-y-6 z-20 relative">
        <p className="font-cormorant italic tracking-[0.25em] uppercase text-[#A89070] text-sm">
          Wedding Overview
        </p>
        <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
          Parima &amp; Jinkawin
        </h1>
        <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
        <p className="font-cormorant text-lg text-[#5C4033] max-w-md mx-auto">
          Welcome to our wedding celebration overview. Here you will find all the details regarding our schedule, venue, and registry.
        </p>

        {/* Countdown Timer */}
        <div className="pt-4 pb-2">
          <p className="font-cormorant italic text-[#A89070] text-sm mb-4">
            Counting down to our big day
          </p>
          <Countdown />
        </div>

        <div className="pt-6">
          <Link
            href="/"
            className="inline-block font-lato uppercase text-xs tracking-[0.18em] px-6 py-3 rounded bg-[#C4714A] text-[#FAF4EB] hover:bg-[#A85E38] transition-colors shadow-sm"
          >
            ← Back to Invitation
          </Link>
        </div>
      </div>
    </main>
  )
}

