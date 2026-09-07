'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { GALLERY_ITEMS, GalleryItem, GalleryCategory, TIMELINE_YEARS } from '@/data/galleryData'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'
import { useTranslation } from '@/locale/I18nContext'

export default function GalleryPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  // Filtered photos based on year and category
  const filteredPhotos = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesYear = selectedYear === 'all' || item.year === selectedYear
      return matchesCategory && matchesYear
    })
  }, [activeCategory, selectedYear])

  // Group photos by year for timeline presentation
  const groupedByYear = useMemo(() => {
    const map = new Map<number, GalleryItem[]>()
    filteredPhotos.forEach((item) => {
      const list = map.get(item.year) ?? []
      list.push(item)
      map.set(item.year, list)
    })
    return Array.from(map.entries()).sort(([yearA], [yearB]) => yearA - yearB)
  }, [filteredPhotos])

  // Keyboard controls for Lightbox
  const handleNext = useCallback(() => {
    if (selectedPhotoIndex === null) return
    setSelectedPhotoIndex((prev) => ((prev ?? 0) + 1) % filteredPhotos.length)
  }, [selectedPhotoIndex, filteredPhotos.length])

  const handlePrev = useCallback(() => {
    if (selectedPhotoIndex === null) return
    setSelectedPhotoIndex((prev) =>
      (prev ?? 0) === 0 ? filteredPhotos.length - 1 : (prev ?? 0) - 1
    )
  }, [selectedPhotoIndex, filteredPhotos.length])

  const handleClose = useCallback(() => {
    setSelectedPhotoIndex(null)
  }, [])

  useEffect(() => {
    if (selectedPhotoIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedPhotoIndex, handleClose, handleNext, handlePrev])

  const activePhoto =
    selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null

  // Helper to open lightbox based on item ID
  const openLightboxForItem = (id: string) => {
    const idx = filteredPhotos.findIndex((p) => p.id === id)
    if (idx !== -1) {
      setSelectedPhotoIndex(idx)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-8 sm:py-14 relative overflow-hidden">
      {/* Decorative Corner Florals */}
      <CornerFloralDecoration position="top-left" className="absolute top-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="top-right" className="absolute top-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-left" className="absolute bottom-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-right" className="absolute bottom-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <FloatingPetals count={4} />

      <div className="max-w-5xl mx-auto z-20 relative space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C4714A]/10 text-[#C4714A] text-xs font-lato uppercase tracking-[0.2em]">
            <span>✨</span>
            <span>{t('gallery.subtitle')}</span>
          </div>
          <h1 className="font-vibes text-5xl sm:text-6xl md:text-7xl text-[#3B2A22]">
            {t('gallery.title')}
          </h1>
          <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
          <p className="font-cormorant text-base sm:text-lg text-[#5C4033] max-w-xl mx-auto">
            {t('gallery.description')}
          </p>
        </div>

        {/* Year Filter Quick-Jump Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pb-1">
            <button
              onClick={() => {
                setSelectedYear('all')
                setSelectedPhotoIndex(null)
              }}
              className={`font-lato uppercase text-xs tracking-[0.14em] px-3.5 py-1.5 rounded-full transition-all border ${
                selectedYear === 'all'
                  ? 'bg-[#3B2A22] text-[#FAF4EB] border-[#3B2A22] shadow-sm font-semibold'
                  : 'bg-white/80 text-[#8C7662] border-[#E0D8C8] hover:bg-white hover:text-[#3B2A22]'
              }`}
            >
              {t('gallery.allYears')}
            </button>
            {TIMELINE_YEARS.map((yr) => (
              <button
                key={yr}
                onClick={() => {
                  setSelectedYear(yr)
                  setSelectedPhotoIndex(null)
                }}
                className={`font-lato text-xs tracking-wider px-3.5 py-1.5 rounded-full transition-all border ${
                  selectedYear === yr
                    ? 'bg-[#C4714A] text-[#FAF4EB] border-[#C4714A] shadow-sm font-semibold scale-105'
                    : 'bg-white/80 text-[#8C7662] border-[#E0D8C8] hover:bg-white hover:text-[#3B2A22]'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex justify-center gap-2 border-b border-[#E0D8C8] pb-3 flex-wrap">
            {[
              { id: 'all', label: t('gallery.filter.all') },
              { id: 'prewedding', label: t('gallery.filter.prewedding') },
              { id: 'proposal', label: t('gallery.filter.proposal') },
              { id: 'moments', label: t('gallery.filter.moments') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id as GalleryCategory)
                  setSelectedPhotoIndex(null)
                }}
                className={`font-lato uppercase text-xs tracking-[0.14em] px-3.5 py-1.5 transition-all rounded-full ${
                  activeCategory === tab.id
                    ? 'bg-[#C4714A]/15 text-[#C4714A] font-semibold border border-[#C4714A]/30'
                    : 'text-[#A89070] hover:text-[#3B2A22] hover:bg-[#EAE2D2]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state if filters yield no photos */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-[#E0D8C8]">
            <p className="font-cormorant text-xl text-[#8C7662]">
              No photos match the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedYear('all')
                setActiveCategory('all')
              }}
              className="mt-3 text-xs uppercase tracking-widest text-[#C4714A] font-lato underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Chronological Timeline Container */}
        <div className="space-y-12 sm:space-y-16">
          {groupedByYear.map(([year, photos]) => {
            return (
              <section key={year} className="relative">
                {/* Year Milestone Header Pin */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center gap-4 w-full">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E0D8C8] to-[#C4714A]/40 flex-1" />
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#E0D8C8] shadow-sm text-[#3B2A22] z-10">
                      <span className="w-2 h-2 rounded-full bg-[#C4714A] animate-pulse" />
                      <span className="font-cormorant font-bold text-2xl text-[#3B2A22] tracking-wider">
                        {year}
                      </span>
                    </div>
                    <div className="h-[1px] bg-gradient-to-r from-[#C4714A]/40 via-[#E0D8C8] to-transparent flex-1" />
                  </div>
                </div>

                {/* Vertical Timeline Track */}
                <div className="relative">
                  {/* Center line (Desktop) / Left line (Mobile) */}
                  <div className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-ml-[1px] w-[2px] bg-[#E0D8C8]" />

                  {/* Timeline Photo Cards */}
                  <div className="space-y-8 md:space-y-12">
                    {photos.map((photo, pIdx) => {
                      const isEven = pIdx % 2 === 0
                      return (
                        <div
                          key={photo.id}
                          className="relative flex flex-col md:flex-row items-center group"
                        >
                          {/* Timeline Node Badge on Center Spine */}
                          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 z-20 w-8 h-8 rounded-full bg-white border-2 border-[#C4714A] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#C4714A] transition-all">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C4714A] group-hover:bg-white transition-colors" />
                          </div>

                          {/* Desktop Alternating / Mobile Left-Aligned Card */}
                          <div
                            className={`w-full md:w-1/2 pl-12 ${
                              isEven
                                ? 'md:pl-0 md:pr-10 md:mr-auto'
                                : 'md:pl-10 md:ml-auto'
                            }`}
                          >
                            <TimelineCard
                              photo={photo}
                              onSelect={() => openLightboxForItem(photo.id)}
                              align={isEven ? 'right' : 'left'}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && selectedPhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          {/* Modal Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
            aria-label={t('gallery.close')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Photo Navigation: Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-3 sm:left-6 z-50 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
            aria-label={t('gallery.prev')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Photo Navigation: Next */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-3 sm:right-6 z-50 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
            aria-label={t('gallery.next')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main Lightbox Card */}
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-[#FAF7F1] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Preview */}
            <div className="relative w-full md:w-3/5 h-80 sm:h-96 md:h-[540px] bg-black">
              <Image
                src={activePhoto.src}
                alt={activePhoto.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Sidebar Details & Story */}
            <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF7F1] border-t md:border-t-0 md:border-l border-[#E0D8C8]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-lato uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-[#C4714A]/15 text-[#C4714A]">
                      {activePhoto.year} • {activePhoto.categoryLabel}
                    </span>
                    {activePhoto.tag && (
                      <span className="text-[0.68rem] font-lato uppercase px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#5C4033]">
                        {activePhoto.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-lato text-[#A89070]">
                    {t('gallery.photoCount', {
                      current: selectedPhotoIndex + 1,
                      total: filteredPhotos.length,
                    })}
                  </span>
                </div>

                <div>
                  <h2 className="font-cormorant font-bold text-2xl sm:text-3xl text-[#3B2A22]">
                    {activePhoto.title}
                  </h2>
                  <p className="text-xs font-lato text-[#A89070] mt-1">
                    📍 {activePhoto.location} • {activePhoto.date}
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-[#E0D8C8]" />

                <p className="font-cormorant text-base sm:text-lg text-[#5C4033] leading-relaxed">
                  “{activePhoto.story}”
                </p>
              </div>

              {/* Navigation Hints */}
              <div className="pt-6 mt-6 border-t border-[#E0D8C8] flex items-center justify-between text-xs text-[#A89070] font-lato">
                <span>Use keyboard arrows ← →</span>
                <span>Esc to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

interface TimelineCardProps {
  photo: GalleryItem
  onSelect: () => void
  align: 'left' | 'right'
}

function TimelineCard({ photo, onSelect, align }: TimelineCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group bg-white rounded-2xl overflow-hidden border border-[#E0D8C8] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
        align === 'right' ? 'md:ml-auto md:max-w-md' : 'md:mr-auto md:max-w-md'
      }`}
    >
      {/* Photo with hover zoom */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#EAE2D2]">
        <Image
          src={photo.src}
          alt={photo.title}
          fill
          sizes="(max-width: 768px) 90vw, 45vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-xs font-lato text-white/90">
            Click to view full memory 🔍
          </span>
        </div>
        {photo.tag && (
          <div className="absolute top-3 right-3 bg-[#FAF7F1]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[0.68rem] font-lato tracking-wider text-[#3B2A22] border border-[#E0D8C8]/80 shadow-xs">
            {photo.tag}
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 sm:p-5 text-left space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[0.68rem] font-lato uppercase tracking-wider text-[#C4714A] font-semibold">
            {photo.date}
          </span>
          <span className="text-[0.65rem] font-lato uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE2D2]/80 text-[#5C4033]">
            {photo.categoryLabel}
          </span>
        </div>

        <h3 className="font-cormorant font-bold text-xl text-[#3B2A22] group-hover:text-[#C4714A] transition-colors leading-snug">
          {photo.title}
        </h3>

        <p className="text-xs text-[#8C7662] font-lato flex items-center gap-1">
          <span>📍</span>
          <span className="truncate">{photo.location}</span>
        </p>

        <p className="text-xs sm:text-sm font-cormorant text-[#5C4033] line-clamp-2 leading-relaxed pt-1">
          {photo.story}
        </p>
      </div>
    </div>
  )
}
