'use client'

import { useState, useCallback } from 'react'
import InvitationCard from '@/components/landing/InvitationCard'
import WaxSeal from '@/components/landing/WaxSeal'

type SceneState = 'idle' | 'open' | 'details'

// The warm kraft/terracotta that fills the screen background
const SCENE_BG = '#B87240'

export default function EnvelopeScene() {
  const [scene, setScene] = useState<SceneState>('idle')

  const handleOpen = useCallback(() => {
    if (scene !== 'idle') return
    setScene('open')
  }, [scene])

  const handleEnterWebsite = useCallback(() => {
    if (scene !== 'open') return
    setScene('details')
  }, [scene])

  const handleBackToInvitation = useCallback(() => {
    if (scene !== 'details') return
    setScene('open')
  }, [scene])

  const isOpen = scene === 'open'
  const isDetails = scene === 'details'

  return (
    <main
      className="min-h-screen w-full overflow-hidden relative"
      style={{ backgroundColor: SCENE_BG }}
    >
      {/* ── IDLE ── sealed envelope + couple names */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-8"
        style={{
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? 'none' : 'auto',
          transition: 'opacity 600ms ease',
        }}
        aria-hidden={isOpen}
      >
        {/* Envelope (clickable) */}
        <div
          className="relative w-full cursor-pointer select-none"
          style={{ maxWidth: '300px' }}
          onClick={handleOpen}
        >
          {/* Breathing float animation on the wrapper */}
          <div className="animate-breathe">
            <ClosedEnvelopeSVG />
          </div>

          {/* Wax seal — sits right at the horizontal center fold */}
          <div
            className="absolute left-1/2 z-10"
            style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <WaxSeal isOpen={false} onClick={handleOpen} />
          </div>
        </div>

        {/* Names */}
        <div className="text-center leading-none">
          <p
            className="font-cormorant italic tracking-[0.3em] uppercase mb-3"
            style={{ color: 'rgba(250,244,235,0.7)', fontSize: '0.82rem' }}
          >
            A Love Letter From
          </p>
          <div
            className="font-vibes"
            style={{
              color: '#FAF4EB',
              fontSize: 'clamp(3rem, 11vw, 4.5rem)',
              lineHeight: 1.15,
            }}
          >
            Jinkawin &amp;
          </div>
          <div
            className="font-vibes"
            style={{
              color: '#FAF4EB',
              fontSize: 'clamp(3rem, 11vw, 4.5rem)',
              lineHeight: 1.1,
            }}
          >
            Parima
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleOpen}
          className="font-cormorant italic text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
          style={{
            color: 'rgba(250,244,235,0.6)',
            fontSize: '0.8rem',
            letterSpacing: '0.22em',
            marginTop: '0.25rem',
          }}
          aria-label="Open the wedding invitation"
        >
          Open the Invitation
          <br />↓
        </button>
      </div>

      {/* ── OPEN ── card rising + open envelope at bottom */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 400ms ease',
        }}
        aria-hidden={!isOpen}
      >
        {/* Open envelope — pinned to bottom of screen */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '45vh', maxHeight: '280px' }}
        >
          <OpenEnvelopeSVG />
        </div>

        {/* Invitation card — rises from inside the envelope */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-2.25rem)] max-w-[320px] sm:max-w-[340px] md:max-w-[380px]"
          style={{
            bottom: 'calc(min(45vh, 280px) - 172px)',
            animation: isOpen
              ? 'cardRise 700ms cubic-bezier(0.34, 1.25, 0.64, 1) 180ms both'
              : undefined,
          }}
        >
          <InvitationCard isVisible={isOpen} onEnterWebsite={handleEnterWebsite} />
        </div>
      </div>

      {/* ── DETAILS ── full wedding information */}
      <section
        className="absolute inset-0"
        style={{
          opacity: isDetails ? 1 : 0,
          pointerEvents: isDetails ? 'auto' : 'none',
          transition: 'opacity 350ms ease',
          background: 'linear-gradient(180deg, #F6EFE2 0%, #F2E7D7 100%)',
        }}
        aria-hidden={!isDetails}
      >
        <div className="h-full overflow-y-auto px-5 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-[720px] rounded-sm border border-[#D8CCB8] bg-[#FAF7F1] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
            <p
              className="font-cormorant italic uppercase tracking-[0.22em]"
              style={{ color: '#A89070', fontSize: '0.72rem' }}
            >
              Wedding Details
            </p>

            <h2
              className="mt-2 font-vibes"
              style={{ color: '#3B2A22', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.05 }}
            >
              Jinkawin &amp; Parima
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <article className="rounded-sm border border-[#E2D8C6] bg-white/40 p-4">
                <h3 className="font-cormorant font-semibold" style={{ color: '#5C4033', fontSize: '1.1rem' }}>
                  Ceremony
                </h3>
                <p className="mt-2 font-lato" style={{ color: '#6E5242', fontSize: '0.9rem' }}>
                  Saturday, 15 March 2025 at 10:00 AM
                </p>
                <p className="mt-1 font-lato" style={{ color: '#6E5242', fontSize: '0.9rem' }}>
                  Bangkok, Thailand
                </p>
              </article>

              <article className="rounded-sm border border-[#E2D8C6] bg-white/40 p-4">
                <h3 className="font-cormorant font-semibold" style={{ color: '#5C4033', fontSize: '1.1rem' }}>
                  Reception
                </h3>
                <p className="mt-2 font-lato" style={{ color: '#6E5242', fontSize: '0.9rem' }}>
                  Lunch reception follows ceremony
                </p>
                <p className="mt-1 font-lato" style={{ color: '#6E5242', fontSize: '0.9rem' }}>
                  Formal attire requested
                </p>
              </article>
            </div>

            <article className="mt-5 rounded-sm border border-[#E2D8C6] bg-white/40 p-4">
              <h3 className="font-cormorant font-semibold" style={{ color: '#5C4033', fontSize: '1.1rem' }}>
                Notes for Guests
              </h3>
              <ul className="mt-2 space-y-1 font-lato" style={{ color: '#6E5242', fontSize: '0.9rem' }}>
                <li>Please arrive 30 minutes early for seating.</li>
                <li>Parking and shuttle service will be available.</li>
                <li>Kindly confirm attendance before 20 February 2025.</li>
              </ul>
            </article>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                className="w-full sm:w-auto px-6 py-3 font-lato uppercase transition-opacity hover:opacity-85"
                style={{
                  background: 'linear-gradient(135deg, #C4714A, #A85E38)',
                  color: '#FAF4EB',
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  borderRadius: '2px',
                }}
                onClick={handleBackToInvitation}
                aria-label="Back to invitation card"
              >
                Back to Invitation
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/** Closed envelope SVG — ivory with diamond fold lines */
function ClosedEnvelopeSVG() {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.28))' }}
      aria-hidden="true"
    >
      {/* Base */}
      <rect x="0.5" y="0.5" width="299" height="199" rx="4" fill="#F5F0E8" />

      {/* Bottom flap */}
      <polygon points="0,200 300,200 150,108" fill="#EBE4D4" />
      {/* Left flap */}
      <polygon points="0,0 0,200 150,108" fill="#EEE8DC" />
      {/* Right flap */}
      <polygon points="300,0 300,200 150,108" fill="#EEE8DC" />
      {/* Top flap (folded over centre) */}
      <polygon points="0,0 300,0 150,95" fill="#E8E1D0" />

      {/* Fold lines */}
      <line x1="0"   y1="0"   x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.55" />
      <line x1="300" y1="0"   x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.55" />
      <line x1="0"   y1="200" x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.4" />
      <line x1="300" y1="200" x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.4" />

      {/* Outer border */}
      <rect x="0.5" y="0.5" width="299" height="199" rx="4" stroke="#CEC5B0" strokeWidth="1" fill="none" />
    </svg>
  )
}

/** Open envelope SVG — flap pointing upward, interior liner visible */
function OpenEnvelopeSVG() {
  return (
    <svg
      viewBox="0 0 360 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/* Envelope body */}
      <rect x="0" y="50" width="360" height="210" rx="4" fill="#F5F0E8" />

      {/* Cream interior liner */}
      <rect x="6" y="56" width="348" height="198" rx="2" fill="#FAF7F1" />

      {/* Side and bottom flaps drawn on top for depth */}
      {/* Left flap */}
      <polygon points="0,50 0,258 180,158" fill="rgba(230,221,205,0.7)" />
      {/* Right flap */}
      <polygon points="360,50 360,258 180,158" fill="rgba(230,221,205,0.7)" />
      {/* Bottom flap */}
      <polygon points="0,258 360,258 180,158" fill="rgba(220,211,194,0.75)" />

      {/* Open top flap — points upward */}
      <polygon points="0,50 360,50 180,-24" fill="#E8E1D0" />
      {/* Flap border line */}
      <line x1="0" y1="50" x2="180" y2="-24" stroke="#CEC5B0" strokeWidth="0.8" opacity="0.5" />
      <line x1="360" y1="50" x2="180" y2="-24" stroke="#CEC5B0" strokeWidth="0.8" opacity="0.5" />

      {/* Fold lines */}
      <line x1="0"   y1="50"  x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.6" opacity="0.35" />
      <line x1="360" y1="50"  x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.6" opacity="0.35" />
      <line x1="0"   y1="258" x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.45" />
      <line x1="360" y1="258" x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.45" />

      {/* Outer border */}
      <rect x="0" y="50" width="360" height="210" rx="4" stroke="#CEC5B0" strokeWidth="1" fill="none" />
    </svg>
  )
}
