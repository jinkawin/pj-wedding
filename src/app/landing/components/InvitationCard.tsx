'use client'

import { useEffect, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// ── Update this to the real wedding date ──────────────────────────────────────
const WEDDING_DATE = new Date('2025-03-15T10:00:00+07:00')
// ─────────────────────────────────────────────────────────────────────────────

function calculateTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-cormorant font-semibold"
        style={{
          background: 'linear-gradient(135deg, #C4714A 0%, #A85E38 100%)',
          color: '#FAF4EB',
          borderRadius: '2px',
        }}
        aria-hidden="true"
      >
        {String(value).padStart(2, '0')}
      </div>
      <span
        className="font-lato uppercase"
        style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#A89070' }}
      >
        {label}
      </span>
    </div>
  )
}

type InvitationCardProps = {
  isVisible: boolean
  onEnterWebsite: () => void
}

export default function InvitationCard({ isVisible, onEnterWebsite }: InvitationCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    if (!isVisible) return
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)

    return () => clearInterval(timer)
  }, [isVisible])

  const delay = (ms: number) =>
    isVisible ? `fadeInUp 450ms ease-out ${ms}ms both` : undefined

  return (
    <div
      className="relative w-full"
      style={{
        background: '#FAF7F1',
        border: '1px solid #DDD5C0',
        borderRadius: '2px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
      }}
    >
      {/* ── Botanical wreath border (SVG) ── */}
      <div className="w-full px-5 pt-5 pb-0">
        <WreathTopSVG />
      </div>

      {/* ── Card content ── */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col items-center text-center gap-2.5 sm:gap-3">
        {/* Together line */}
        <p
          className="font-cormorant italic"
          style={{
            color: '#A89070',
            fontSize: '0.68rem',
            lineHeight: 1.2,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            animation: delay(500),
          }}
        >
          Together with their families
        </p>

        {/* Couple names */}
        <div style={{ animation: delay(620) }}>
          <h1
            className="font-vibes"
            style={{
              color: '#3B2A22',
              fontSize: 'clamp(1.85rem, 6.2vw, 2.6rem)',
              lineHeight: 1.1,
            }}
          >
            Parima S.
          </h1>
          <p
            className="font-cormorant italic"
            style={{ color: '#C4714A', fontSize: '1.05rem', lineHeight: 1.2 }}
          >
            &amp;
          </p>
          <h1
            className="font-vibes"
            style={{
              color: '#3B2A22',
              fontSize: 'clamp(1.85rem, 6.2vw, 2.6rem)',
              lineHeight: 1.1,
            }}
          >
            Jinkawin P.
          </h1>
        </div>

        {/* Thin divider */}
        <div
          className="w-full flex items-center gap-3"
          style={{ animation: delay(720) }}
        >
          <div style={{ flex: 1, height: '1px', background: '#E0D8C8' }} />
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="2.5" fill="#C9A99A" opacity="0.8" />
            <circle cx="7" cy="7" r="5" stroke="#7A8C6E" strokeWidth="0.7" fill="none" opacity="0.5" />
          </svg>
          <div style={{ flex: 1, height: '1px', background: '#E0D8C8' }} />
        </div>

        {/* Date & Time */}
        <div style={{ animation: delay(820) }}>
          <p
            className="font-cormorant font-semibold"
            style={{ color: '#5C4033', fontSize: '0.96rem' }}
          >
            Saturday, 15 March 2025
          </p>
          <p
            className="font-cormorant italic"
            style={{ color: '#A89070', fontSize: '0.78rem', marginTop: '2px' }}
          >
            at Ten o&apos;clock in the morning
          </p>
        </div>

        {/* Venue */}
        <div style={{ animation: delay(920) }}>
          <p
            className="font-cormorant font-semibold italic"
            style={{ color: '#5C4033', fontSize: '1.02rem' }}
          >
            Bangkok, Thailand
          </p>
          <p
            className="font-lato uppercase"
            style={{ color: '#A89070', fontSize: '0.58rem', letterSpacing: '0.16em', marginTop: '2px' }}
          >
            Formal Attire Requested
          </p>
        </div>

        {/* Countdown */}
        <div style={{ animation: delay(1020) }} aria-live="polite" aria-label="Time until the wedding">
          <div className="flex gap-1.5 sm:gap-2 justify-center items-end">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <span className="font-cormorant text-lg sm:text-xl pb-4 sm:pb-5" style={{ color: '#C4714A' }}>:</span>
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <span className="font-cormorant text-lg sm:text-xl pb-4 sm:pb-5" style={{ color: '#C4714A' }}>:</span>
            <CountdownUnit value={timeLeft.minutes} label="Min" />
            <span className="font-cormorant text-lg sm:text-xl pb-4 sm:pb-5" style={{ color: '#C4714A' }}>:</span>
            <CountdownUnit value={timeLeft.seconds} label="Sec" />
          </div>
        </div>

        {/* RSVP */}
        <button
          className="w-full font-lato uppercase transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: 'linear-gradient(135deg, #C4714A, #A85E38)',
            color: '#FAF4EB',
            fontSize: '0.66rem',
            letterSpacing: '0.18em',
            padding: '12px 0',
            borderRadius: '2px',
            animation: delay(1120),
            minHeight: '44px',

            ['--tw-ring-color' as any]: '#C4714A',
          }}
          onClick={onEnterWebsite}
          aria-label="Enter website to see wedding details"
        >
          Enter Website
        </button>

        {/* Footer */}
        <p
          className="font-cormorant italic"
          style={{
            color: '#A89070',
            fontSize: '0.72rem',
            animation: delay(1220),
          }}
        >
          We look forward to celebrating with you
        </p>
      </div>

      {/* Botanical wreath bottom (flipped) */}
      <div className="w-full px-5 pb-3" style={{ transform: 'rotate(180deg)' }}>
        <WreathTopSVG />
      </div>
    </div>
  )
}

/** Botanical top wreath — sage green leaves + dusty rose flowers */
function WreathTopSVG() {
  return (
    <svg
      viewBox="0 0 300 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      {/* Thin inner border rect (top line) */}
      <line x1="0" y1="44" x2="300" y2="44" stroke="#CEC5B0" strokeWidth="0.6" />

      {/* ── Left branch ── */}
      {/* Main stem */}
      <path d="M 148 38 Q 110 30 72 36" stroke="#7A8C6E" strokeWidth="1.2" fill="none" />
      <path d="M 148 38 Q 120 20 90 26" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      {/* Leaves */}
      <ellipse cx="112" cy="27" rx="7" ry="3.5" fill="#7A8C6E" opacity="0.55" transform="rotate(-18 112 27)" />
      <ellipse cx="90" cy="28" rx="6" ry="3" fill="#7A8C6E" opacity="0.5" transform="rotate(-10 90 28)" />
      <ellipse cx="128" cy="23" rx="5.5" ry="2.8" fill="#7A8C6E" opacity="0.45" transform="rotate(-25 128 23)" />
      {/* Small side sprigs */}
      <path d="M 100 33 Q 96 26 92 29" stroke="#7A8C6E" strokeWidth="0.7" fill="none" />
      <ellipse cx="91" cy="28" rx="4" ry="2" fill="#7A8C6E" opacity="0.4" transform="rotate(-15 91 28)" />
      {/* Flowers */}
      <circle cx="72" cy="36" r="5" fill="#C9A99A" opacity="0.7" />
      <circle cx="72" cy="36" r="2.5" fill="#B89080" opacity="0.6" />
      <circle cx="52" cy="38" r="4" fill="#C9A99A" opacity="0.55" />
      <circle cx="36" cy="36" r="3" fill="#7A8C6E" opacity="0.4" />
      <circle cx="20" cy="38" r="2.5" fill="#C9A99A" opacity="0.4" />
      {/* Connecting stem */}
      <path d="M 72 32 Q 52 30 20 38" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      {/* Small leaves on far left */}
      <ellipse cx="44" cy="32" rx="5" ry="2.5" fill="#7A8C6E" opacity="0.4" transform="rotate(10 44 32)" />

      {/* ── Right branch (mirror) ── */}
      <path d="M 152 38 Q 190 30 228 36" stroke="#7A8C6E" strokeWidth="1.2" fill="none" />
      <path d="M 152 38 Q 180 20 210 26" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      <ellipse cx="188" cy="27" rx="7" ry="3.5" fill="#7A8C6E" opacity="0.55" transform="rotate(18 188 27)" />
      <ellipse cx="210" cy="28" rx="6" ry="3" fill="#7A8C6E" opacity="0.5" transform="rotate(10 210 28)" />
      <ellipse cx="172" cy="23" rx="5.5" ry="2.8" fill="#7A8C6E" opacity="0.45" transform="rotate(25 172 23)" />
      <path d="M 200 33 Q 204 26 208 29" stroke="#7A8C6E" strokeWidth="0.7" fill="none" />
      <ellipse cx="209" cy="28" rx="4" ry="2" fill="#7A8C6E" opacity="0.4" transform="rotate(15 209 28)" />
      <circle cx="228" cy="36" r="5" fill="#C9A99A" opacity="0.7" />
      <circle cx="228" cy="36" r="2.5" fill="#B89080" opacity="0.6" />
      <circle cx="248" cy="38" r="4" fill="#C9A99A" opacity="0.55" />
      <circle cx="264" cy="36" r="3" fill="#7A8C6E" opacity="0.4" />
      <circle cx="280" cy="38" r="2.5" fill="#C9A99A" opacity="0.4" />
      <path d="M 228 32 Q 248 30 280 38" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      <ellipse cx="256" cy="32" rx="5" ry="2.5" fill="#7A8C6E" opacity="0.4" transform="rotate(-10 256 32)" />

      {/* ── Centre diamond ── */}
      <rect x="146" y="34" width="8" height="8" transform="rotate(45 150 38)" fill="#C9A99A" opacity="0.5" />
    </svg>
  )
}
