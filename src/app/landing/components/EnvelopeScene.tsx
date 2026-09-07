'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import InvitationCard from './InvitationCard'

type SceneState = 'idle' | 'open'

// The warm kraft/terracotta that fills the screen background
const SCENE_BG = '#8c4716'
const SCENE_PATTERN = '/O6DXQE0.jpg'

export default function EnvelopeScene() {
  const router = useRouter()
  const [scene, setScene] = useState<SceneState>('idle')

  const handleOpen = useCallback(() => {
    if (scene !== 'idle') return
    setScene('open')
  }, [scene])

  const handleEnterWebsite = useCallback(() => {
    router.push('/overview')
  }, [router])

  const isOpen = scene === 'open'

  return (
    <main
      className="min-h-screen w-full overflow-hidden relative"
      style={{ backgroundColor: SCENE_BG }}
    >
      {/* Pattern wash overlay for the terracotta backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${SCENE_PATTERN})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '280px 280px',
          backgroundPosition: 'center',
          opacity: 0.18,
          mixBlendMode: 'screen',
        }}
      />

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
          style={{ maxWidth: '420px' }}
          onClick={handleOpen}
        >
          {/* Breathing float animation on the wrapper */}
          <div className="animate-breathe">
            <ClosedEnvelopeSVG />
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
            Parima S. &amp;
          </div>
          <div
            className="font-vibes"
            style={{
              color: '#FAF4EB',
              fontSize: 'clamp(3rem, 11vw, 4.5rem)',
              lineHeight: 1.1,
            }}
          >
            Jinkawin P.
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
          className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[330px] sm:max-w-[360px] md:max-w-[380px]"
          style={{
            bottom: 'calc(min(34vh, 220px) - 36px)',
            animation: isOpen
              ? 'cardRise 700ms cubic-bezier(0.34, 1.25, 0.64, 1) 180ms both'
              : undefined,
          }}
        >
          <InvitationCard isVisible={isOpen} onEnterWebsite={handleEnterWebsite} />
        </div>
      </div>
    </main>
  )
}

/** Closed envelope asset — use the provided PNG for the landing hero */
function ClosedEnvelopeSVG() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.28))',
      }}
    >
      <img
        src="/envelope2.png"
        alt="Wedding invitation envelope"
        className="w-full h-auto block"
        loading="eager"
        decoding="async"
        aria-hidden="true"
      />
    </div>
  )
}

/** Open envelope asset — use the provided PNG for the open state */
function OpenEnvelopeSVG() {
  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{
        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18))',
      }}
    >
      <img
        src="/opened-envelope.png"
        alt="Open wedding invitation envelope"
        className="w-full h-full object-cover block"
        loading="eager"
        decoding="async"
        aria-hidden="true"
      />
    </div>
  )
}
