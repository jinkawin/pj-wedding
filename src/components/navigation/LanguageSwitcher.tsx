'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTranslation, Locale } from '@/locale/I18nContext'

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'cn', label: '中文', flag: '🇨🇳' },
  { code: 'jp', label: '日本語', flag: '🇯🇵' },
]

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E0D8C8] bg-white/80 backdrop-blur-sm text-xs font-lato font-medium text-[#3B2A22] hover:bg-white transition-all shadow-xs focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{currentLang.flag}</span>
        <span className="uppercase tracking-wider font-semibold">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 text-[#A89070] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-[#E0D8C8] bg-white/95 backdrop-blur-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          {LANGUAGES.map((lang) => {
            const isSelected = locale === lang.code
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLocale(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-lato text-left transition-colors ${
                  isSelected
                    ? 'bg-[#C4714A]/10 text-[#C4714A] font-semibold'
                    : 'text-[#5C4033] hover:bg-[#FAF7F1]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {isSelected && <span className="text-[#C4714A]">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
