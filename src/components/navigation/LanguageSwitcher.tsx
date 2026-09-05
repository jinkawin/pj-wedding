'use client'

import React from 'react'
import { useTranslation } from '@/locale/I18nContext'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="inline-flex items-center rounded-full border border-[#E0D8C8] bg-white/70 backdrop-blur-sm p-0.5 text-xs font-lato">
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded-full uppercase tracking-wider transition-all duration-200 ${
          locale === 'en'
            ? 'bg-[#C4714A] text-[#FAF4EB] font-semibold shadow-xs'
            : 'text-[#5C4033]/70 hover:text-[#3B2A22]'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('th')}
        className={`px-2 py-1 rounded-full uppercase tracking-wider transition-all duration-200 ${
          locale === 'th'
            ? 'bg-[#C4714A] text-[#FAF4EB] font-semibold shadow-xs'
            : 'text-[#5C4033]/70 hover:text-[#3B2A22]'
        }`}
        aria-label="สลับเป็นภาษาไทย"
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => setLocale('cn')}
        className={`px-2 py-1 rounded-full uppercase tracking-wider transition-all duration-200 ${
          locale === 'cn'
            ? 'bg-[#C4714A] text-[#FAF4EB] font-semibold shadow-xs'
            : 'text-[#5C4033]/70 hover:text-[#3B2A22]'
        }`}
        aria-label="切换至中文"
      >
        CN
      </button>
      <button
        type="button"
        onClick={() => setLocale('jp')}
        className={`px-2 py-1 rounded-full uppercase tracking-wider transition-all duration-200 ${
          locale === 'jp'
            ? 'bg-[#C4714A] text-[#FAF4EB] font-semibold shadow-xs'
            : 'text-[#5C4033]/70 hover:text-[#3B2A22]'
        }`}
        aria-label="日本語に切り替える"
      >
        JP
      </button>
    </div>
  )
}
