import Link from 'next/link'

export default function MenuAPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-6">
        <p className="font-cormorant italic tracking-[0.25em] uppercase text-[#A89070] text-sm">
          Section
        </p>
        <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
          Menu A
        </h1>
        <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
        <p className="font-cormorant text-lg text-[#5C4033] max-w-md mx-auto">
          Content for Menu A.
        </p>
      </div>
    </main>
  )
}
