'use client'

import React, { useState, useMemo, useRef } from 'react'
import { SEATING_TABLES, searchGuests, Table, TableCategory, SearchResult } from '@/data/seatingData'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'
import { useTranslation } from '@/locale/I18nContext'

const CATEGORY_COLORS: Record<TableCategory, { bg: string; border: string; text: string; lightBg: string }> = {
  vip: {
    bg: '#C4714A',
    border: '#A85E38',
    text: '#FAF4EB',
    lightBg: '#F7EBE4',
  },
  bride_family: {
    bg: '#9B5B56',
    border: '#7D4541',
    text: '#FAF4EB',
    lightBg: '#F5ECEB',
  },
  groom_family: {
    bg: '#627264',
    border: '#4D5B4F',
    text: '#FAF4EB',
    lightBg: '#ECF0ED',
  },
  friends: {
    bg: '#A89070',
    border: '#8F7657',
    text: '#FAF4EB',
    lightBg: '#F6F3EE',
  },
  colleagues: {
    bg: '#75685B',
    border: '#5B5045',
    text: '#FAF4EB',
    lightBg: '#EDEAE6',
  },
}

export default function SeatingPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTableId, setSelectedTableId] = useState<number | null>(1)
  const [highlightedGuestName, setHighlightedGuestName] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const floorPlanRef = useRef<HTMLDivElement>(null)

  // Live search results
  const searchResults: SearchResult[] = useMemo(() => {
    return searchGuests(searchQuery)
  }, [searchQuery])

  // Filtered tables based on category
  const filteredTables = useMemo(() => {
    if (selectedCategory === 'all') return SEATING_TABLES
    return SEATING_TABLES.filter((t) => t.category === selectedCategory)
  }, [selectedCategory])

  const selectedTable = useMemo(() => {
    return SEATING_TABLES.find((table) => table.id === selectedTableId) ?? SEATING_TABLES[0]
  }, [selectedTableId])

  const handleSelectSearchResult = (result: SearchResult) => {
    setSelectedTableId(result.table.id)
    setHighlightedGuestName(result.seat.guestName)
    setViewMode('map')
    // Smooth scroll down to map on mobile
    if (window.innerWidth < 768 && floorPlanRef.current) {
      floorPlanRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleSelectTable = (table: Table) => {
    setSelectedTableId(table.id)
    setHighlightedGuestName(null)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setHighlightedGuestName(null)
  }

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative Corner Florals */}
      <CornerFloralDecoration position="top-left" className="absolute top-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="top-right" className="absolute top-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-left" className="absolute bottom-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-right" className="absolute bottom-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <FloatingPetals count={3} />

      <div className="max-w-6xl mx-auto z-20 relative space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <p className="font-cormorant italic tracking-[0.25em] uppercase text-[#A89070] text-xs sm:text-sm">
            {t('seating.subtitle')}
          </p>
          <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
            {t('seating.title')}
          </h1>
          <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
          <p className="font-cormorant text-base sm:text-lg text-[#5C4033] max-w-lg mx-auto">
            {t('seating.description')}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Search Input Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89070]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('seating.searchPlaceholder')}
              className="w-full pl-10 pr-10 py-3 rounded-full bg-white border border-[#E0D8C8] text-sm text-[#3B2A22] placeholder-[#A89070] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C4714A]/40 transition-all font-lato"
              aria-label="Search guest or table"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A89070] hover:text-[#3B2A22]"
                aria-label={t('seating.clearSearch')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Instant Autocomplete Suggestions */}
          {searchQuery.trim().length > 0 && (
            <div className="bg-white rounded-xl border border-[#E0D8C8] shadow-lg p-2 max-h-64 overflow-y-auto space-y-1 font-lato animate-in fade-in-50 duration-150 z-30">
              <div className="px-3 py-1.5 text-[0.7rem] uppercase tracking-wider text-[#A89070] font-semibold border-b border-[#F0EBE1] flex justify-between items-center">
                <span>
                  {t('seating.resultsCount', { count: searchResults.length })}
                </span>
                {searchResults.length > 0 && (
                  <span className="text-[0.65rem] text-[#C4714A]">Tap to highlight table</span>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#75685B] font-cormorant text-base">
                  {t('seating.noResults')}
                </div>
              ) : (
                searchResults.map(({ table, seat }) => (
                  <button
                    key={`${table.id}-${seat.seatNumber}`}
                    onClick={() => handleSelectSearchResult({ table, seat })}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF7F1] flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#C4714A]/10 text-[#C4714A] text-xs font-semibold flex items-center justify-center">
                        {seat.seatNumber}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#3B2A22] group-hover:text-[#C4714A] transition-colors">
                          {seat.guestName}
                        </p>
                        {seat.relationship && (
                          <p className="text-xs text-[#A89070]">{seat.relationship}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#EAE2D2]/60 text-[#5C4033]">
                      {table.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* View Toggle & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: t('seating.allCategories') },
                { id: 'vip', label: 'VIP & Parents' },
                { id: 'bride_family', label: "Bride's Family" },
                { id: 'groom_family', label: "Groom's Family" },
                { id: 'friends', label: 'Friends' },
                { id: 'colleagues', label: 'Colleagues' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-lato tracking-wide whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#C4714A] text-white shadow-sm font-medium'
                      : 'bg-white/80 text-[#5C4033] hover:bg-[#EAE2D2]/50 border border-[#E0D8C8]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Map vs List Mode Switcher */}
            <div className="flex items-center gap-1 bg-white border border-[#E0D8C8] p-1 rounded-full self-end sm:self-auto shadow-xs">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-full text-xs font-lato tracking-wider uppercase transition-colors ${
                  viewMode === 'map'
                    ? 'bg-[#3B2A22] text-[#FAF4EB] font-semibold'
                    : 'text-[#5C4033] hover:text-[#3B2A22]'
                }`}
              >
                🗺️ {t('seating.viewMap')}
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-full text-xs font-lato tracking-wider uppercase transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#3B2A22] text-[#FAF4EB] font-semibold'
                    : 'text-[#5C4033] hover:text-[#3B2A22]'
                }`}
              >
                📋 {t('seating.viewList')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {viewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" ref={floorPlanRef}>
            {/* Interactive Floor Plan Map (8 Columns) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-[#E0D8C8] relative overflow-hidden">
              {/* Floor Plan Controls */}
              <div className="flex items-center justify-between mb-4 border-b border-[#F0EBE1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C4714A] animate-ping" />
                  <span className="text-xs font-lato uppercase tracking-wider text-[#A89070]">
                    The Grand Ballroom • Floor Plan
                  </span>
                </div>
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 text-xs font-lato">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.1))}
                    className="w-7 h-7 rounded border border-[#E0D8C8] flex items-center justify-center hover:bg-[#FAF7F1] text-[#3B2A22]"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="px-2 text-[0.7rem] text-[#75685B]">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.25, z + 0.1))}
                    className="w-7 h-7 rounded border border-[#E0D8C8] flex items-center justify-center hover:bg-[#FAF7F1] text-[#3B2A22]"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="px-2 py-1 ml-1 rounded border border-[#E0D8C8] hover:bg-[#FAF7F1] text-[0.68rem] text-[#75685B]"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Ballroom Floor Canvas */}
              <div
                className="relative w-full rounded-xl bg-[#FAF7F1] border-2 border-dashed border-[#E0D8C8] overflow-hidden transition-transform duration-200"
                style={{
                  height: '560px',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                }}
              >
                {/* NORTH: Main Stage & Arch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4/5 max-w-sm py-2 px-4 rounded-b-xl bg-gradient-to-r from-[#A85E38] via-[#C4714A] to-[#A85E38] text-white text-center shadow-sm z-10">
                  <p className="font-cormorant text-xs tracking-widest uppercase font-semibold">
                    👑 {t('seating.stage')}
                  </p>
                  <p className="text-[0.62rem] font-lato opacity-80">
                    Parima &amp; Jinkawin Wedding
                  </p>
                </div>

                {/* CENTER: Bridal Walkway Carpet */}
                <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-12 sm:w-16 bg-[#F3ECE0] border-x border-[#E2D8C6] flex flex-col items-center justify-center pointer-events-none opacity-70">
                  <span className="text-[0.6rem] font-lato uppercase tracking-[0.25em] text-[#A89070] rotate-90 whitespace-nowrap">
                    {t('seating.walkway')}
                  </span>
                </div>

                {/* SOUTH: Ballroom Entrance */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/5 max-w-xs py-1.5 px-4 rounded-t-xl bg-[#3B2A22] text-[#FAF4EB] text-center shadow-xs z-10">
                  <p className="font-lato text-[0.65rem] tracking-widest uppercase font-medium">
                    🚪 {t('seating.entrance')}
                  </p>
                </div>

                {/* Corner Facilities Badges */}
                <div className="absolute top-4 left-4 text-[0.65rem] font-lato text-[#A89070] bg-white/70 px-2 py-1 rounded border border-[#E0D8C8]">
                  📸 Photo Booth
                </div>
                <div className="absolute top-4 right-4 text-[0.65rem] font-lato text-[#A89070] bg-white/70 px-2 py-1 rounded border border-[#E0D8C8]">
                  🍸 Welcome Bar
                </div>
                <div className="absolute bottom-4 left-4 text-[0.65rem] font-lato text-[#A89070] bg-white/70 px-2 py-1 rounded border border-[#E0D8C8]">
                  🚻 Restrooms ↗
                </div>
                <div className="absolute bottom-4 right-4 text-[0.65rem] font-lato text-[#A89070] bg-white/70 px-2 py-1 rounded border border-[#E0D8C8]">
                  🎁 Gift &amp; Reception
                </div>

                {/* Banquet Tables on Floor */}
                {SEATING_TABLES.map((table) => {
                  const isSelected = selectedTableId === table.id
                  const hasSearchedGuest =
                    highlightedGuestName &&
                    table.guests.some((g) => g.guestName === highlightedGuestName)
                  const isCategoryMatch =
                    selectedCategory === 'all' || table.category === selectedCategory
                  const colors = CATEGORY_COLORS[table.category]

                  return (
                    <div
                      key={table.id}
                      onClick={() => handleSelectTable(table)}
                      style={{
                        left: `${table.x}%`,
                        top: `${table.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`absolute cursor-pointer group transition-all duration-300 z-20 ${
                        !isCategoryMatch ? 'opacity-35 scale-90' : 'opacity-100'
                      }`}
                    >
                      {/* Active Glowing Pulse Halo when table is selected */}
                      {isSelected && (
                        <div className="absolute -inset-3 rounded-full bg-[#C4714A]/25 animate-ping pointer-events-none" />
                      )}

                      {/* Circular Table Node */}
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center text-center shadow-md transition-all duration-200 border-2 ${
                          isSelected
                            ? 'scale-110 ring-4 ring-[#C4714A]/40 shadow-lg'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: isSelected ? colors.bg : 'white',
                          borderColor: colors.border,
                          color: isSelected ? colors.text : colors.border,
                        }}
                      >
                        <span className="font-cormorant font-bold text-base sm:text-lg leading-tight">
                          T-{table.id}
                        </span>
                        <span
                          className={`font-lato text-[0.6rem] uppercase font-medium ${
                            isSelected ? 'text-white/90' : 'text-[#75685B]'
                          }`}
                        >
                          {table.capacity} pax
                        </span>

                        {/* Special indicator if searched guest is at this table */}
                        {hasSearchedGuest && (
                          <span className="absolute -top-2.5 -right-2.5 bg-[#C4714A] text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
                            ★ Found
                          </span>
                        )}
                      </div>

                      {/* Small floating label under table */}
                      <div className="mt-1 text-center whitespace-nowrap">
                        <span className="text-[0.62rem] font-lato font-semibold text-[#5C4033] bg-white/90 px-1.5 py-0.5 rounded-md shadow-xs border border-[#E0D8C8]">
                          {table.categoryLabel}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Table Details Panel (4 Columns) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl shadow-md border border-[#E0D8C8] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                <div>
                  <span
                    className="text-[0.68rem] uppercase font-semibold font-lato px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[selectedTable.category].lightBg,
                      color: CATEGORY_COLORS[selectedTable.category].border,
                    }}
                  >
                    {selectedTable.categoryLabel}
                  </span>
                  <h2 className="font-cormorant text-2xl font-bold text-[#3B2A22] mt-1">
                    {selectedTable.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-lato font-medium text-[#A89070]">
                    {t('seating.capacity', {
                      current: selectedTable.guests.length,
                      max: selectedTable.capacity,
                    })}
                  </span>
                </div>
              </div>

              {/* Guest List at this table */}
              <div className="space-y-2">
                <p className="text-xs uppercase font-lato font-semibold text-[#A89070] tracking-wider">
                  {t('seating.tableGuests')}
                </p>
                <div className="divide-y divide-[#F0EBE1] max-h-96 overflow-y-auto pr-1">
                  {selectedTable.guests.map((guest) => {
                    const isHighlighted = highlightedGuestName === guest.guestName

                    return (
                      <div
                        key={guest.seatNumber}
                        className={`py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
                          isHighlighted
                            ? 'bg-[#C4714A]/15 border border-[#C4714A]/40'
                            : 'hover:bg-[#FAF7F1]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center ${
                              isHighlighted
                                ? 'bg-[#C4714A] text-white'
                                : 'bg-[#EAE2D2] text-[#5C4033]'
                            }`}
                          >
                            {guest.seatNumber}
                          </span>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                isHighlighted
                                  ? 'text-[#C4714A] font-bold'
                                  : 'text-[#3B2A22]'
                              }`}
                            >
                              {guest.guestName}
                            </p>
                            {guest.relationship && (
                              <p className="text-[0.7rem] text-[#A89070]">
                                {guest.relationship}
                              </p>
                            )}
                          </div>
                        </div>

                        {isHighlighted && (
                          <span className="text-[0.65rem] font-bold font-lato uppercase tracking-wider px-2 py-0.5 rounded bg-[#C4714A] text-white">
                            {t('seating.yourSeat')}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Helpful Hint */}
              <div className="p-3 bg-[#FAF7F1] rounded-xl border border-[#E0D8C8] text-xs text-[#5C4033] font-lato leading-relaxed">
                💡 <strong>Tip:</strong> Need help locating your seat upon arrival? Our usher team at the main ballroom entrance is ready with place cards!
              </div>
            </div>
          </div>
        ) : (
          /* Directory List View (Accessible for all screen readers & quick browsing) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-[#E0D8C8] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                  <h3 className="font-cormorant font-bold text-lg text-[#3B2A22]">
                    {table.name}
                  </h3>
                  <span className="text-[0.65rem] font-lato font-medium px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#5C4033]">
                    {table.categoryLabel}
                  </span>
                </div>
                <div className="space-y-1.5 font-lato text-xs">
                  {table.guests.map((guest) => (
                    <div
                      key={guest.seatNumber}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#FAF7F1]"
                    >
                      <span className="text-[#3B2A22] font-medium">
                        {guest.seatNumber}. {guest.guestName}
                      </span>
                      {guest.relationship && (
                        <span className="text-[0.68rem] text-[#A89070]">
                          {guest.relationship}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
