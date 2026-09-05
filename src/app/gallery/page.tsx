'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { GALLERY_ITEMS, GalleryItem, GalleryCategory } from '@/data/galleryData'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'
import { useTranslation } from '@/locale/I18nContext'

export default function GalleryPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  // Filtered photos
  const filteredPhotos = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true
    return item.category === activeCategory
  })

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
    // Prevent background scrolling when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedPhotoIndex, handleClose, handleNext, handlePrev])

  const activePhoto =
    selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-8 sm:py-14 relative overflow-hidden">
      {/* Decorative Corner Florals */}
      <CornerFloralDecoration position="top-left" className="absolute top-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="top-right" className="absolute top-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-left" className="absolute bottom-0 left-0 z-10 w-20 sm:w-24 opacity-40" />
      <CornerFloralDecoration position="bottom-right" className="absolute bottom-0 right-0 z-10 w-20 sm:w-24 opacity-40" />
      <FloatingPetals count={3} />

      <div className="max-w-6xl mx-auto z-20 relative space-y-8 sm:space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <p className="font-cormorant italic tracking-[0.25em] uppercase text-[#A89070] text-xs sm:text-sm">
            {t('gallery.subtitle')}
          </p>
          <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
            {t('gallery.title')}
          </h1>
          <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
          <p className="font-cormorant text-base sm:text-lg text-[#5C4033] max-w-lg mx-auto">
            {t('gallery.description')}
          </p>
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
              className={`font-lato uppercase text-xs tracking-[0.14em] px-4 py-2 transition-all rounded-full ${
                activeCategory === tab.id
                  ? 'bg-[#C4714A] text-[#FAF4EB] font-semibold shadow-sm'
                  : 'text-[#A89070] hover:text-[#3B2A22] hover:bg-[#EAE2D2]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Photo Grid / Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative rounded-2xl overflow-hidden shadow-md bg-white border border-[#E0D8C8] cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image Container with Consistent Aspect Ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE2D2]">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="text-[0.68rem] uppercase font-lato tracking-wider text-[#FAF4EB]/80">
                    {photo.categoryLabel}
                  </span>
                  <h3 className="font-cormorant font-bold text-xl text-white">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-[#FAF4EB]/90 font-lato mt-0.5">
                    📍 {photo.location} • {photo.date}
                  </p>
                </div>
              </div>

              {/* Card Footer Caption */}
              <div className="p-4 bg-white border-t border-[#F0EBE1]">
                <div className="flex items-center justify-between">
                  <h4 className="font-cormorant font-bold text-lg text-[#3B2A22] group-hover:text-[#C4714A] transition-colors">
                    {photo.title}
                  </h4>
                  <span className="text-[0.65rem] font-lato uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#5C4033]">
                    {photo.categoryLabel}
                  </span>
                </div>
                <p className="text-xs text-[#A89070] font-lato mt-1 truncate">
                  {photo.story}
                </p>
              </div>
            </div>
          ))}
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
                  <span className="text-xs font-lato uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-[#C4714A]/15 text-[#C4714A]">
                    {activePhoto.categoryLabel}
                  </span>
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
