import Link from 'next/link'

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-6">
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

        <div className="pt-8">
          <Link
            href="/"
            className="inline-block font-lato uppercase text-xs tracking-[0.18em] px-6 py-3 rounded bg-[#C4714A] text-[#FAF4EB] hover:bg-[#A85E38] transition-colors"
          >
            ← Back to Invitation
          </Link>
        </div>
      </div>
    </main>
  )
}
