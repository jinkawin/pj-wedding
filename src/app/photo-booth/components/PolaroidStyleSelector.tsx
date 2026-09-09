'use client'

import React from 'react'
import { POLAROID_STYLES, PolaroidStyleConfig } from '../types/polaroidStyles'
import { useTranslation } from '@/locale/I18nContext'

interface PolaroidStyleSelectorProps {
  selectedStyle: PolaroidStyleConfig
  onSelectStyle: (style: PolaroidStyleConfig) => void
}

export default function PolaroidStyleSelector({
  selectedStyle,
  onSelectStyle,
}: PolaroidStyleSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full space-y-3">
      <label className="block text-xs font-semibold tracking-wider uppercase text-[#5C4033]/80 text-center sm:text-left">
        Choose Polaroid Style
      </label>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
        {POLAROID_STYLES.map((style) => {
          const isSelected = selectedStyle.id === style.id

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                isSelected
                  ? 'border-[#C4714A] bg-[#C4714A]/10 text-[#C4714A] font-semibold scale-105 shadow-sm'
                  : 'border-[#E0D8C8] text-[#5C4033] hover:border-[#C4714A]/50 bg-white/70'
              }`}
            >
              <span>{t(style.nameKey)}</span>
              <span className="text-[10px] text-[#5C4033]/60">({style.shotsRequired} Shots)</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

