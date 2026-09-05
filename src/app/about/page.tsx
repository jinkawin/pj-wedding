'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'

type TabType = 'all' | 'groom' | 'bride' | 'story'

export default function AboutUsPage() {
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
            Meet the Bride &amp; Groom
          </p>
          <h1 className="font-vibes text-5xl sm:text-6xl text-[#3B2A22]">
            About Parima &amp; Jinkawin
          </h1>
          <div className="w-16 h-[1px] bg-[#E0D8C8] mx-auto" />
          <p className="font-cormorant text-base sm:text-lg text-[#5C4033] max-w-lg mx-auto leading-relaxed">
            Welcome! Whether you are here from the Groom’s or Bride’s family &amp; friends, here is a little glimpse into who we are and our journey together.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 border-b border-[#E0D8C8] pb-3">
          {[
            { id: 'all', label: 'Overview' },
            { id: 'bride', label: 'Meet Parima (Bride)' },
            { id: 'groom', label: 'Meet Jinkawin (Groom)' },
            { id: 'story', label: 'Our Story & Q&A' },
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
                      The Bride
                    </span>
                    <h2 className="font-vibes text-3xl sm:text-4xl text-[#3B2A22]">
                      Parima S. (Pang)
                    </h2>
                    <p className="font-lato text-xs text-[#A89070] uppercase tracking-wider">
                      Warm-hearted • Creative • Coffee Enthusiast
                    </p>
                  </div>

                  <div className="w-12 h-[1px] bg-[#E0D8C8] mx-auto" />

                  {/* Personal Bio */}
                  <div className="space-y-4 font-cormorant text-base text-[#5C4033] leading-relaxed">
                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        Parents &amp; Family
                      </h3>
                      <p>Daughter of Somchai &amp; Wanida S., raised in Bangkok with a love for arts and family gatherings.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        Hobbies &amp; Passions
                      </h3>
                      <p>Baking sourdough, botanical watercolor painting, and discovering hidden café gems across Thailand.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        How Jinkawin Describes Her
                      </h3>
                      <p className="italic bg-[#F5EDD6]/60 p-3 rounded-sm border-l-2 border-[#C4714A]">
                        &ldquo;Parima brings warmth and laughter to every room she enters. Her kindness and endless thoughtfulness make me want to be a better person every day.&rdquo;
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
                      The Groom
                    </span>
                    <h2 className="font-vibes text-3xl sm:text-4xl text-[#3B2A22]">
                      Jinkawin P. (Win)
                    </h2>
                    <p className="font-lato text-xs text-[#A89070] uppercase tracking-wider">
                      Thoughtful • Tech Enthusiast • Photographer
                    </p>
                  </div>

                  <div className="w-12 h-[1px] bg-[#E0D8C8] mx-auto" />

                  {/* Personal Bio */}
                  <div className="space-y-4 font-cormorant text-base text-[#5C4033] leading-relaxed">
                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        Parents &amp; Family
                      </h3>
                      <p>Son of Prasert &amp; Chintana P., known for his helpful nature and love for technology.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        Hobbies &amp; Passions
                      </h3>
                      <p>Landscape photography, mechanical keyboards, hiking mountain trails, and brewing espresso.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#C4714A] text-sm uppercase tracking-wider mb-1">
                        How Parima Describes Him
                      </h3>
                      <p className="italic bg-[#F5EDD6]/60 p-3 rounded-sm border-l-2 border-[#C4714A]">
                        &ldquo;Jinkawin is my steady anchor. He is patient, incredibly funny when you get to know him, and always knows how to brighten my day.&rdquo;
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
                Our Journey
              </span>
              <h2 className="font-vibes text-4xl text-[#3B2A22]">
                How We Met &amp; Fun Q&amp;A
              </h2>
              <div className="w-12 h-[1px] bg-[#E0D8C8] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center font-cormorant">
              <div className="bg-[#FAF7F1] p-5 rounded border border-[#E8DFC8]/60 space-y-2">
                <span className="text-2xl">☕</span>
                <h3 className="font-semibold text-[#3B2A22] text-lg">First Met</h3>
                <p className="text-sm text-[#5C4033]">At a cozy café in Ari, Bangkok in 2021 over cold brew coffee.</p>
              </div>

              <div className="bg-[#FAF7F1] p-5 rounded border border-[#E8DFC8]/60 space-y-2">
                <span className="text-2xl">💍</span>
                <h3 className="font-semibold text-[#3B2A22] text-lg">The Proposal</h3>
                <p className="text-sm text-[#5C4033]">During a sunset walk along the Chiang Mai mountain view in late 2024.</p>
              </div>

              <div className="bg-[#FAF7F1] p-5 rounded border border-[#E8DFC8]/60 space-y-2">
                <span className="text-2xl">🏡</span>
                <h3 className="font-semibold text-[#3B2A22] text-lg">Shared Dream</h3>
                <p className="text-sm text-[#5C4033]">Building a home filled with art, travel memories, and family warmth.</p>
              </div>
            </div>

            {/* Quick Q&A Accordion/List */}
            <div className="space-y-4 pt-4 border-t border-[#E0D8C8]">
              <h3 className="font-cormorant font-semibold text-center text-[#C4714A] uppercase tracking-wider text-sm">
                Fun Facts for Friends &amp; Relatives
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-cormorant text-sm">
                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">Q: Who made the first move?</p>
                  <p className="text-[#5C4033] mt-1">Jinkawin! He asked Parima if she wanted to explore a photography exhibition together.</p>
                </div>

                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">Q: Who is the better cook?</p>
                  <p className="text-[#5C4033] mt-1">Parima masters all desserts &amp; pastries, while Jinkawin handles savory weekend pastas!</p>
                </div>

                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">Q: Favorite trip together?</p>
                  <p className="text-[#5C4033] mt-1">Exploring the historic streets of Kyoto during autumn foliage season.</p>
                </div>

                <div className="bg-[#FAF7F1] p-4 rounded border border-[#E8DFC8]/80">
                  <p className="font-semibold text-[#3B2A22]">Q: Favorite shared ritual?</p>
                  <p className="text-[#5C4033] mt-1">Making hand-poured pour-over coffee together every Sunday morning.</p>
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
            ← Back to Overview
          </Link>
        </div>
      </div>
    </main>
  )
}
