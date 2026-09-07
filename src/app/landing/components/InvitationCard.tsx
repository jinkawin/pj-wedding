'use client'

import { useEffect, useState } from 'react'
import { WreathTopSVG, CardDividerSVG } from '@/assets/svg'
import { weddingConfig } from '@/configs/app'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'
import { useTranslation } from '@/locale/I18nContext'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now()
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
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!isVisible) return
    const targetDate = new Date(weddingConfig.weddingDate)
    setTimeLeft(calculateTimeLeft(targetDate))

    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000)

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
      {/* ── Top bar: Language switcher ── */}
      <div className="absolute top-3 right-4 z-20" style={{ animation: delay(400) }}>
        <LanguageSwitcher />
      </div>

      {/* ── Botanical wreath border (SVG) ── */}
      <div className="w-full px-5 pt-7 pb-0">
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
          {t('invitation.together')}
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
          <CardDividerSVG />
          <div style={{ flex: 1, height: '1px', background: '#E0D8C8' }} />
        </div>

        {/* Date & Time */}
        <div style={{ animation: delay(820) }}>
          <p
            className="font-cormorant font-semibold"
            style={{ color: '#5C4033', fontSize: '0.96rem' }}
          >
            {weddingConfig.location.dateTimeText}
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
            {t('invitation.formalAttire')}
          </p>
        </div>

        {/* Countdown */}
        <div style={{ animation: delay(1020) }} aria-live="polite" aria-label={t('countdown.ariaLabel')}>
          <div className="flex gap-1.5 sm:gap-2 justify-center items-end">
            <CountdownUnit value={timeLeft.days} label={t('countdown.days')} />
            <span className="font-cormorant text-lg sm:text-xl pb-4 sm:pb-5" style={{ color: '#C4714A' }}>:</span>
            <CountdownUnit value={timeLeft.hours} label={t('countdown.hours')} />
            <span className="font-cormorant text-lg sm:text-xl pb-4 sm:pb-5" style={{ color: '#C4714A' }}>:</span>
            <CountdownUnit value={timeLeft.minutes} label={t('countdown.minutes')} />
            <span className="font-cormorant text-lg sm:text-xl pb-4 sm:pb-5" style={{ color: '#C4714A' }}>:</span>
            <CountdownUnit value={timeLeft.seconds} label={t('countdown.seconds')} />
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
          aria-label={t('invitation.enterWebsite')}
        >
          {t('invitation.enterWebsite')}
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
          {t('invitation.lookForward')}
        </p>
      </div>

      {/* Botanical wreath bottom (flipped) */}
      <div className="w-full px-5 pb-3" style={{ transform: 'rotate(180deg)' }}>
        <WreathTopSVG />
      </div>
    </div>
  )
}

