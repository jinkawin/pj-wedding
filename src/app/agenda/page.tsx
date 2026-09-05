'use client'

import React, { useState } from 'react'
import { AGENDA_EVENTS, AgendaEvent } from '@/data/agendaData'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'
import AddToCalendar from '@/components/AddToCalendar'
import { useTranslation } from '@/locale/I18nContext'
import { weddingConfig } from '@/configs/app'

export default function AgendaPage() {
  const { t } = useTranslation()
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'morning' | 'evening'>('all')

  const filteredEvents = AGENDA_EVENTS.filter((event) => {
    if (filterPeriod === 'all') return true
    return event.period === filterPeriod
  })

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-8 sm:py-14 relative overflow-hidden">
      {/* Decorative Corner Florals */}
      <CornerFloralDecoration position="top-left" className="absolute top-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="top-right" className="absolute top-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-left" className="absolute bottom-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-right" className="absolute bottom-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <FloatingPetals count={3} />

      <div className="max-w-4xl mx-auto z-20 relative space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <p className="font-cormorant italic tracking-[0.25em] uppercase text-[#A89070] text-xs sm:text-sm">
            {t('agenda.subtitle')}
          </p>
          <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
            {t('agenda.title')}
          </h1>
          <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
          <p className="font-cormorant text-base sm:text-lg text-[#5C4033] max-w-lg mx-auto">
            {t('agenda.description')}
          </p>

          {/* Date & Location Pill Banner */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#E0D8C8] text-xs font-lato text-[#5C4033] shadow-xs">
              📅 {weddingConfig.location.dateTimeText}
            </span>
            <AddToCalendar />
          </div>
        </div>

        {/* Filter Period Tabs */}
        <div className="flex justify-center gap-2 border-b border-[#E0D8C8] pb-3 flex-wrap">
          {[
            { id: 'all', label: t('agenda.allTab') },
            { id: 'morning', label: t('agenda.morningTab') },
            { id: 'evening', label: t('agenda.eveningTab') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPeriod(tab.id as 'all' | 'morning' | 'evening')}
              className={`font-lato uppercase text-xs tracking-[0.14em] px-4 py-2 transition-all rounded-full ${
                filterPeriod === tab.id
                  ? 'bg-[#C4714A] text-[#FAF4EB] font-semibold shadow-sm'
                  : 'text-[#A89070] hover:text-[#3B2A22] hover:bg-[#EAE2D2]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Informational Notes Banner */}
        {filterPeriod === 'morning' && (
          <div className="p-3.5 bg-white/80 rounded-xl border border-[#E0D8C8] text-center text-xs font-lato text-[#5C4033]">
            🌸 {t('agenda.morningNote')}
          </div>
        )}
        {filterPeriod === 'evening' && (
          <div className="p-3.5 bg-white/80 rounded-xl border border-[#E0D8C8] text-center text-xs font-lato text-[#5C4033]">
            🥂 {t('agenda.eveningNote')}
          </div>
        )}

        {/* Vertical Timeline Container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E0D8C8] ml-3 sm:ml-6 space-y-8 sm:space-y-10">
          {filteredEvents.map((event: AgendaEvent, index: number) => {
            return (
              <div key={event.id} className="relative group">
                {/* Timeline Connector Dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white transition-transform group-hover:scale-110 ${
                    event.highlight
                      ? 'bg-[#C4714A] text-white ring-4 ring-[#C4714A]/20'
                      : 'bg-[#EAE2D2] text-[#5C4033]'
                  }`}
                >
                  <span>{event.icon}</span>
                </div>

                {/* Event Card */}
                <div
                  className={`bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
                    event.highlight
                      ? 'border-[#C4714A]/50 bg-gradient-to-br from-white to-[#FDF9F5]'
                      : 'border-[#E0D8C8]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE1] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-lato font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[#C4714A]/10 text-[#C4714A]">
                        {event.time}
                      </span>
                      {event.highlight && (
                        <span className="text-[0.65rem] font-lato font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C4714A] text-white">
                          ★ Highlight
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-lato text-[#A89070] flex items-center gap-1">
                      📍 {event.location}
                    </span>
                  </div>

                  <h3 className="font-cormorant font-bold text-xl sm:text-2xl text-[#3B2A22] mb-1.5 group-hover:text-[#C4714A] transition-colors">
                    {event.titleDefault}
                  </h3>

                  <p className="font-cormorant text-base text-[#5C4033] leading-relaxed mb-3">
                    {event.descDefault}
                  </p>

                  {event.attire && (
                    <div className="pt-2 border-t border-dashed border-[#EAE2D2] flex items-center gap-2 text-xs font-lato text-[#A89070]">
                      <span className="font-semibold text-[#5C4033]">Dress Suggestion:</span>
                      <span>{event.attire}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Closing Note */}
        <div className="text-center pt-6 text-xs text-[#A89070] font-lato">
          Schedule timings are approximate to allow for smooth transitions between ceremonies.
        </div>
      </div>
    </main>
  )
}
