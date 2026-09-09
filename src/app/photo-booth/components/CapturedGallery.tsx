'use client'

import React from 'react'
import { useTranslation } from '@/locale/I18nContext'

export interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: number
}

interface CapturedGalleryProps {
  photos: CapturedPhoto[]
  onDeletePhoto: (id: string) => void
}

export default function CapturedGallery({ photos, onDeletePhoto }: CapturedGalleryProps) {
  const { t } = useTranslation()

  if (photos.length === 0) {
    return (
      <div className="w-full text-center py-8 px-4 border border-dashed border-[#E0D8C8] rounded-2xl bg-[#FAF7F1]/60">
        <p className="text-xs text-[#5C4033]/70 font-lato">{t('photoBooth.noPhotos')}</p>
      </div>
    )
  }

  const handleDownload = (photo: CapturedPhoto) => {
    const link = document.createElement('a')
    link.href = photo.dataUrl
    link.download = `wedding-photo-${photo.timestamp}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-base font-serif text-[#3B2A22] font-semibold border-b border-[#E0D8C8] pb-2">
        {t('photoBooth.galleryTitle')} ({photos.length})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative bg-white p-3 rounded-2xl border border-[#E0D8C8] shadow-sm hover:shadow-md transition-all flex flex-col items-center"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.dataUrl}
                alt="Captured Snapshot"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDownload(photo)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C4714A] hover:bg-[#A85834] text-white text-xs font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {t('photoBooth.download')}
              </button>

              <button
                type="button"
                onClick={() => onDeletePhoto(photo.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                title={t('photoBooth.delete')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

