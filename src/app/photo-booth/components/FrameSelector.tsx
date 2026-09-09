'use client'

import React from 'react'
import { useTranslation } from '@/locale/I18nContext'

export type FrameId = 'none' | 'floralGold' | 'romanticRose' | 'classicMonogram' | 'modernWarm'

interface FrameSelectorProps {
  selectedFrame: FrameId
  onSelectFrame: (frame: FrameId) => void
}

const FRAMES: { id: FrameId; labelKey: string; previewBg: string; borderStyle: string }[] = [
  {
    id: 'floralGold',
    labelKey: 'photoBooth.frames.floralGold',
    previewBg: 'from-[#D4AF37]/20 to-[#FAF7F1]',
    borderStyle: 'border-2 border-[#D4AF37]',
  },
  {
    id: 'romanticRose',
    labelKey: 'photoBooth.frames.romanticRose',
    previewBg: 'from-[#E8C5C8]/30 to-[#FAF7F1]',
    borderStyle: 'border-2 border-[#C4714A]',
  },
  {
    id: 'classicMonogram',
    labelKey: 'photoBooth.frames.classicMonogram',
    previewBg: 'from-[#3B2A22]/10 to-[#FAF7F1]',
    borderStyle: 'border-2 border-[#3B2A22]',
  },
  {
    id: 'modernWarm',
    labelKey: 'photoBooth.frames.modernWarm',
    previewBg: 'from-[#8C6D58]/20 to-[#FAF7F1]',
    borderStyle: 'border-2 border-[#8C6D58]',
  },
  {
    id: 'none',
    labelKey: 'photoBooth.frames.none',
    previewBg: 'bg-gray-100',
    borderStyle: 'border border-dashed border-gray-300',
  },
]

export default function FrameSelector({ selectedFrame, onSelectFrame }: FrameSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full space-y-3">
      <label className="block text-xs font-semibold tracking-wider uppercase text-[#5C4033]/80 text-center sm:text-left">
        {t('photoBooth.selectFrame')}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {FRAMES.map((frame) => {
          const isSelected = selectedFrame === frame.id

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => onSelectFrame(frame.id)}
              className={`flex flex-col items-center p-2.5 rounded-xl transition-all border ${
                isSelected
                  ? 'border-[#C4714A] bg-[#C4714A]/10 shadow-sm scale-[1.02]'
                  : 'border-[#E0D8C8] hover:border-[#C4714A]/50 bg-white/70'
              }`}
            >
              {/* Miniature frame preview */}
              <div
                className={`w-full h-14 rounded-lg bg-gradient-to-br ${frame.previewBg} ${frame.borderStyle} flex items-center justify-center p-1 relative overflow-hidden mb-2`}
              >
                <span className="text-[10px] font-serif text-[#3B2A22]/70 font-semibold tracking-tighter">
                  {frame.id === 'none' ? 'Clean' : 'P & J'}
                </span>
              </div>

              <span
                className={`text-xs font-medium text-center truncate max-w-full ${
                  isSelected ? 'text-[#C4714A] font-semibold' : 'text-[#5C4033]'
                }`}
              >
                {t(frame.labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
