'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/locale/I18nContext'
import HeartPhotoBooth from './components/HeartPhotoBooth'
import CapturedGallery, { CapturedPhoto } from './components/CapturedGallery'

export default function PhotoBoothPage() {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])

  const handlePhotoCaptured = (dataUrl: string) => {
    const newPhoto: CapturedPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      dataUrl,
      timestamp: Date.now(),
    }
    setPhotos((prev) => [newPhoto, ...prev])
  }

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/overview"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[#5C4033]/70 hover:text-[#C4714A] transition-colors"
          >
            {t('about.backToOverview')}
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2">
          <p className="font-lato text-xs sm:text-sm uppercase tracking-[0.2em] text-[#C4714A] font-semibold">
            {t('photoBooth.subtitle')}
          </p>
          <h1 className="font-vibes text-4xl sm:text-6xl text-[#3B2A22]">
            {t('photoBooth.title')}
          </h1>
          <p className="font-lato text-xs sm:text-sm text-[#5C4033]/80 max-w-xl mx-auto leading-relaxed">
            {t('photoBooth.description')}
          </p>
        </div>

        {/* Active Camera Viewport */}
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-[#E0D8C8] shadow-sm flex flex-col items-center">
          <HeartPhotoBooth onPhotoCaptured={handlePhotoCaptured} />
        </div>

        {/* Captured Gallery */}
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-[#E0D8C8] shadow-sm">
          <CapturedGallery photos={photos} onDeletePhoto={handleDeletePhoto} />
        </div>
      </div>
    </main>
  )
}


