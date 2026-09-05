'use client'

import { useEffect, useState } from 'react'
import { weddingConfig } from '@/configs/app'
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
        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-cormorant font-semibold shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #C4714A 0%, #A85E38 100%)',
          color: '#FAF4EB',
          borderRadius: '4px',
        }}
        aria-hidden="true"
      >
        {String(value).padStart(2, '0')}
      </div>
      <span
        className="font-lato uppercase"
        style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#A89070' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const targetDate = new Date(weddingConfig.weddingDate)
    setTimeLeft(calculateTimeLeft(targetDate))

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isMounted) return null

  return (
    <div className="flex gap-2 sm:gap-3 justify-center items-end" aria-live="polite" aria-label={t('countdown.ariaLabel')}>
      <CountdownUnit value={timeLeft.days} label={t('countdown.days')} />
      <span className="font-cormorant text-xl sm:text-2xl pb-4 text-[#C4714A] font-semibold">:</span>
      <CountdownUnit value={timeLeft.hours} label={t('countdown.hours')} />
      <span className="font-cormorant text-xl sm:text-2xl pb-4 text-[#C4714A] font-semibold">:</span>
      <CountdownUnit value={timeLeft.minutes} label={t('countdown.minutes')} />
      <span className="font-cormorant text-xl sm:text-2xl pb-4 text-[#C4714A] font-semibold">:</span>
      <CountdownUnit value={timeLeft.seconds} label={t('countdown.seconds')} />
    </div>
  )
}
