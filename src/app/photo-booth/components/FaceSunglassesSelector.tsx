'use client'

import React from 'react'
import { getStrategiesByCategory } from '../hooks/sunglassesStrategies'

interface FaceSunglassesSelectorProps {
  isGlassesEnabled: boolean
  selectedGlassesId: string
  onToggleGlasses: (enabled: boolean) => void
  onSelectGlassesId: (id: string) => void
  isHatEnabled: boolean
  selectedHatId: string
  onToggleHat: (enabled: boolean) => void
  onSelectHatId: (id: string) => void
  detectedFacesCount: number
}

export default function FaceSunglassesSelector({
  isGlassesEnabled,
  selectedGlassesId,
  onToggleGlasses,
  onSelectGlassesId,
  isHatEnabled,
  selectedHatId,
  onToggleHat,
  onSelectHatId,
  detectedFacesCount,
}: FaceSunglassesSelectorProps) {
  const glassesStrategies = getStrategiesByCategory('glasses')
  const hatStrategies = getStrategiesByCategory('hat')

  return (
    <div className="w-full bg-white/70 backdrop-blur-md p-4 rounded-xl border border-[#E0D8C8] shadow-sm space-y-3">
      {/* Top Status Header */}
      <div className="flex items-center justify-between border-b border-[#E0D8C8]/60 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3B2A22]">
          Face AI Filters (Max 3 Faces)
        </span>
        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FAF7F1] border border-[#E0D8C8] text-[#8C6D58] whitespace-nowrap">
          {detectedFacesCount > 0
            ? `${detectedFacesCount}/3 Face${detectedFacesCount > 1 ? 's' : ''} Tracked`
            : 'Scanning Faces...'}
        </span>
      </div>

      {/* Category 1: Glasses */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onToggleGlasses(!isGlassesEnabled)}
          className="flex items-center gap-2.5 focus:outline-none cursor-pointer group"
        >
          <div
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
              isGlassesEnabled ? 'bg-[#C4714A]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                isGlassesEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-xs font-semibold text-[#5C4033] whitespace-nowrap">
            Glasses
          </span>
        </button>

        {isGlassesEnabled && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {glassesStrategies.map((strategy) => {
              const isSelected = strategy.id === selectedGlassesId

return (
                <button
                  key={strategy.id}
                  type="button"
                  onClick={() => onSelectGlassesId(strategy.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#3B2A22] text-[#FAF7F1] shadow-sm ring-1 ring-[#D4AF37]'
                      : 'bg-[#FAF7F1] text-[#5C4033] hover:bg-white border border-[#E0D8C8]'
                  }`}
                >
                  {strategy.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Category 2: Hat */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 border-t border-[#E0D8C8]/40">
        <button
          type="button"
          onClick={() => onToggleHat(!isHatEnabled)}
          className="flex items-center gap-2.5 focus:outline-none cursor-pointer group"
        >
          <div
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
              isHatEnabled ? 'bg-[#C4714A]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                isHatEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-xs font-semibold text-[#5C4033] whitespace-nowrap">
            Hat
          </span>
        </button>

        {isHatEnabled && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {hatStrategies.map((strategy) => {
              const isSelected = strategy.id === selectedHatId

return (
                <button
                  key={strategy.id}
                  type="button"
                  onClick={() => onSelectHatId(strategy.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#3B2A22] text-[#FAF7F1] shadow-sm ring-1 ring-[#D4AF37]'
                      : 'bg-[#FAF7F1] text-[#5C4033] hover:bg-white border border-[#E0D8C8]'
                  }`}
                >
                  {strategy.name}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
