'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'
import { useTranslation } from '@/locale/I18nContext'

type TabType = 'all' | 'groom' | 'bride' | 'story'

export default function AboutUsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('all')

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
      {/* Minimal Decorative Florals for About page */}
      <CornerFloralDecoration position="top-left" className="absolute top-0 left-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <CornerFloralDecoration position="top-right" className="absolute top-0 right-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <CornerFloralDecoration position="bottom-left" className="absolute bottom-0 left-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <CornerFloralDecoration position="bottom-right" className="absolute bottom-0 right-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <FloatingPetals count={3} />

      <div className="max-w-4xl mx-auto z-20 relative space-y-10 sm:space-y-14">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <p className="font-cormorant italic tracking-[0.25em] uppercase text-[#A89070] text-xs sm:text-sm">
            {t('about.subtitle')}
          </p>
          <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
            {t('about.title')}
          </h1>
          <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
          <p className="font-cormorant text-base sm:text-lg text-[#5C4033] max-w-lg mx-auto leading-relaxed">
            {t('about.welcome')}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 border-b border-[#E0D8C8] pb-3 flex-wrap">
          {[
            { id: 'all', label: t('about.tabs.all') },
            { id: 'bride', label: t('about.tabs.bride') },
            { id: 'groom', label: t('about.tabs.groom') },
            { id: 'story', label: t('about.tabs.story') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`font-lato uppercase text-xs tracking-[0.14em] px-3 sm:px-4 py-2 transition-colors rounded-sm ${
                activeTab === tab.id
                  ? 'bg-[#C4714A] text-[#FAF4EB] font-medium shadow-sm'
                  : 'text-[#A89070] hover:text-[#3B2A22] hover:bg-[#EAE2D2]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── PROFILE CARDS SECTION ── */}
        {(activeTab === 'all' || activeTab === 'bride' || activeTab === 'groom') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* BRIDE CARD */}
            {(activeTab === 'all' || activeTab === 'bride') && (
              <div className="bg-[#FAF4EB] border border-[#E8DFC8] rounded-md p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
                <div className="space-y-6">
                  {/* Avatar Frame */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-full overflow-hidden border-4 border-[#FAF7F1] shadow-md">
                    <Image
                      src="/bride.jpg"
                      alt="Parima - Bride"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <span className="font-cormorant italic text-[#C4714A] text-sm uppercase tracking-widest">
                      {t('about.bride.role')}
                    </span>
                    <h2 className="font-vibes text-3xl sm:text-4xl text-[#3B2A22]">
                      {t('about.bride.name')}
                    </h2>
                    <p className="font-lato text-xs text-[#A89070] uppercase tracking-wider">
                      {t('about.bride.traits')}
                    </p>
                  </div>

                  <div className="w-12 h-[1px] bg-[#E0D8C8] mx-auto" />

                  {/* Personal Bio */}
                  <div className="space-y-4 font-cormorant text-base text-[#5C4033] leading-relaxed">
                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        {t('about.bride.parentsTitle')}
                      </h3>
                      <p>{t('about.bride.parentsText')}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        {t('about.bride.hobbiesTitle')}
                      </h3>
                      <p>{t('about.bride.hobbiesText')}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        {t('about.bride.quoteTitle')}
                      </h3>
                      <p className="italic bg-[#F5EDD6]/60 p-3 rounded-sm border-l-2 border-[#C4714A]">
                        {t('about.bride.quoteText')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GROOM CARD */}
            {(activeTab === 'all' || activeTab === 'groom') && (
              <div className="bg-[#FAF4EB] border border-[#E8DFC8] rounded-md p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
                <div className="space-y-6">
                  {/* Avatar Frame */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-full overflow-hidden border-4 border-[#FAF7F1] shadow-md">
                    <Image
                      src="/groom.jpg"
                      alt="Jinkawin - Groom"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <span className="font-cormorant italic text-[#C4714A] text-sm uppercase tracking-widest">
                      {t('about.groom.role')}
                    </span>
                    <h2 className="font-vibes text-3xl sm:text-4xl text-[#3B2A22]">
                      {t('about.groom.name')}
                    </h2>
                    <p className="font-lato text-xs text-[#A89070] uppercase tracking-wider">
                      {t('about.groom.traits')}
                    </p>
                  </div>

                  <div className="w-12 h-[1px] bg-[#E0D8C8] mx-auto" />

                  {/* Personal Bio */}
                  <div className="space-y-4 font-cormorant text-base text-[#5C4033] leading-relaxed">
                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        {t('about.groom.parentsTitle')}
                      </h3>
                      <p>{t('about.groom.parentsText')}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        {t('about.groom.hobbiesTitle')}
                      </h3>
                      <p>{t('about.groom.hobbiesText')}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        {t('about.groom.quoteTitle')}
                      </h3>
                      <p className="italic bg-[#F5EDD6]/60 p-3 rounded-sm border-l-2 border-[#C4714A]">
                        {t('about.groom.quoteText')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── OUR STORY & FUN TRIVIA SECTION ── */}
        {(activeTab === 'all' || activeTab === 'story') && (
          <div className="bg-[#FAF4EB] border border-[#E8DFC8] rounded-md p-6 sm:p-10 space-y-8 shadow-sm">
            <div className="text-center space-y-2">
              <span className="font-cormorant italic text-[#C4714A] text-sm uppercase tracking-widest">
                {t('about.story.category')}
              </span>
              <h2 className="font-vibes text-4xl text-[#3B2A22]">
                {t('about.story.title')}
              </h2>
              <div className="w-12 h-[1px] bg-[#E0D8C8] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center font-cormorant">
              <div className="bg-[#FAF7F1] p-5 rounded border border-[#E8DFC8]/60 space-y-2">
                <span className="text-2xl">☕</span>
                <h3 className="font-semibold text-[#3B2A22] text-lg">{t('about.story.firstMetTitle')}</h3>
                <p className="text-sm text-[#5C4033]">{t('about.story.firstMetText')}</p>
              </div>

              <div className="bg-[#FAF7F1] p-5 rounded border border-[#E8DFC8]/60 space-y-2">
                <span className="text-2xl">💍</span>
                <h3 className="font-semibold text-[#3B2A22] text-lg">{t('about.story.proposalTitle')}</h3>
                <p className="text-sm text-[#5C4033]">{t('about.story.proposalText')}</p>
              </div>

              <div className="bg-[#FAF7F1] p-5 rounded border border-[#E8DFC8]/60 space-y-2">
                <span className="text-2xl">🏡</span>
                <h3 className="font-semibold text-[#3B2A22] text-lg">{t('about.story.sharedDreamTitle')}</h3>
                <p className="text-sm text-[#5C4033]">{t('about.story.sharedDreamText')}</p>
              </div>
            </div>

            {/* Quick Q&A Accordion/List */}
            <div className="space-y-4 pt-4 border-t border-[#E0D8C8]">
              <h3 className="font-cormorant font-semibold text-center text-[#C4714A] uppercase tracking-wider text-sm">
                {t('about.story.triviaTitle')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-cormorant text-sm">
                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">{t('about.story.q1')}</p>
                  <p className="text-[#5C4033] mt-1">{t('about.story.a1')}</p>
                </div>

                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">{t('about.story.q2')}</p>
                  <p className="text-[#5C4033] mt-1">{t('about.story.a2')}</p>
                </div>

                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">{t('about.story.q3')}</p>
                  <p className="text-[#5C4033] mt-1">{t('about.story.a3')}</p>
                </div>

                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">{t('about.story.q4')}</p>
                  <p className="text-[#5C4033] mt-1">{t('about.story.a4')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Back Button */}
        <div className="text-center pt-4">
          <Link
            href="/overview"
            className="inline-block font-lato uppercase text-xs tracking-[0.18em] px-6 py-3 rounded bg-[#C4714A] text-[#FAF4EB] hover:bg-[#A85E38] transition-colors shadow-sm"
          >
            {t('about.backToOverview')}
          </Link>
        </div>
      </div>
    </main>
  )
}
