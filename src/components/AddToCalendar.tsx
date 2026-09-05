'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/locale/I18nContext'
import { weddingConfig } from '@/configs/app'

export default function AddToCalendar() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const title = 'Parima & Jinkawin Wedding'
  const description = 'Join us in celebrating the wedding of Parima & Jinkawin!'
  const location = `${weddingConfig.location.venueName}, Bangkok, Thailand`

  // 2027-02-27 10:00:00 GMT+7 => 20270227T030000Z
  const startTimeUtc = '20270227T030000Z'
  const endTimeUtc = '20270227T070000Z' // 4 hours event

  // Google Calendar URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startTimeUtc}/${endTimeUtc}&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`

  // Outlook Web URL
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title
  )}&startdt=2027-02-27T10:00:00%2B07:00&enddt=2027-02-27T14:00:00%2B07:00&body=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`

  // Download iCal (.ics) file
  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Parima & Jinkawin Wedding//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${startTimeUtc}`,
      `DTEND:${endTimeUtc}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'wedding-parima-jinkawin.ics')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#C4714A]/40 bg-white/80 hover:bg-[#FAF4EB] text-[#C4714A] font-lato text-xs tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C4714A]/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-[#C4714A]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{t('countdown.addToCalendar')}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 h-3 text-[#C4714A] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 rounded-md bg-white shadow-lg border border-[#E0D8C8] py-1 z-30 font-lato text-xs text-[#3B2A22] animate-in fade-in zoom-in-95 duration-150">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAF7F1] text-[#5C4033] transition-colors"
          >
            <span>{t('countdown.googleCalendar')}</span>
          </a>

          <button
            onClick={handleDownloadIcs}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAF7F1] text-[#5C4033] transition-colors"
          >
            <span>{t('countdown.appleCalendar')}</span>
          </button>

          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAF7F1] text-[#5C4033] transition-colors border-t border-[#F0EBE1]"
          >
            <span>Outlook / Office 365</span>
          </a>
        </div>
      )}
    </div>
  )
}
