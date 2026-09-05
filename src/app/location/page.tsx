'use client'

import { weddingConfig } from '@/configs/app'
import { useTranslation } from '@/locale/I18nContext'

export default function LocationPage() {
  const { t } = useTranslation()
  const { venueName, dateTimeText, mapsEmbedUrl, directMapsUrl } = weddingConfig.location

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-10 flex flex-col items-center">
      <div className="max-w-3xl w-full text-center space-y-4 mb-8">
        <p className="font-cormorant italic tracking-[0.25em] uppercase text-[#A89070] text-sm">
          {t('location.category')}
        </p>
        <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
          {t('location.title')}
        </h1>
        <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
        <p className="font-cormorant text-lg text-[#5C4033] max-w-md mx-auto">
          {t('location.city')}
        </p>
      </div>

      {/* Embedded Google Map */}
      <div className="max-w-3xl w-full bg-white p-3 sm:p-4 rounded-md shadow-md border border-[#E0D8C8] space-y-4">
        <div className="relative w-full h-[350px] sm:h-[450px] rounded overflow-hidden bg-[#EEE8DC]">
          <iframe
            title="Wedding Venue Location Map"
            src={mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-2">
          <div className="text-left space-y-1 text-center sm:text-left">
            <h3 className="font-cormorant font-semibold text-lg text-[#3B2A22]">
              {venueName}
            </h3>
            <p className="font-lato text-xs text-[#A89070]">
              {dateTimeText}
            </p>
          </div>
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-lato uppercase text-xs tracking-[0.15em] px-5 py-2.5 rounded bg-[#C4714A] text-[#FAF4EB] hover:bg-[#A85E38] transition-colors shrink-0"
          >
            {t('location.openMaps')}
          </a>
        </div>
      </div>
    </main>
  )
}
