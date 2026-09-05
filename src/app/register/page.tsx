'use client'

import { useState } from 'react'
import { useTranslation } from '@/locale/I18nContext'
import { CornerFloralDecoration, FloatingPetals } from '@/components/FloralDecorations'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    followersCount: 1,
    party: 'groom' as 'groom' | 'bride',
    attendance: 'attending' as 'attending' | 'declined' | '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Do not submit to backend as requested; show client preview state
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#3B2A22] px-4 sm:px-6 py-12 flex items-center justify-center relative overflow-hidden">
      {/* Minimal Decorative Florals */}
      <CornerFloralDecoration position="top-left" className="absolute top-0 left-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <CornerFloralDecoration position="top-right" className="absolute top-0 right-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <CornerFloralDecoration position="bottom-left" className="absolute bottom-0 left-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <CornerFloralDecoration position="bottom-right" className="absolute bottom-0 right-0 z-10 w-20 sm:w-24 md:w-28 opacity-40" />
      <FloatingPetals count={3} />

      <div className="w-full max-w-xl bg-white/70 backdrop-blur-md border border-[#E0D8C8] rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-300 z-20 relative">

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs uppercase tracking-[0.25em] font-lato text-[#C4714A] font-medium">
            {t('register.category')}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#3B2A22] font-semibold">
            {t('register.title')}
          </h1>
          <p className="font-lato text-xs sm:text-sm text-[#5C4033]/70 max-w-md mx-auto">
            {t('register.subtitle')}
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-[#C4714A]/10 text-[#C4714A] rounded-full flex items-center justify-center mx-auto text-2xl">
              ✨
            </div>
            <h2 className="font-serif text-2xl text-[#3B2A22] font-semibold">
              {t('register.thankYou', { name: formData.nickname || formData.name || 'Guest' })}
            </h2>
            <p className="font-lato text-sm text-[#5C4033]/80 max-w-sm mx-auto">
              {t('register.submittedMessage')}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2.5 rounded-full border border-[#C4714A] text-[#C4714A] font-lato text-xs uppercase tracking-wider hover:bg-[#C4714A]/5 transition-colors"
            >
              {t('register.editResponse')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Nickname Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block font-lato text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
                >
                  {t('register.nameLabel')} <span className="text-[#C4714A]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder={t('register.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#E0D8C8] text-[#3B2A22] placeholder-[#5C4033]/40 font-lato text-sm focus:outline-none focus:ring-2 focus:ring-[#C4714A]/40 focus:border-[#C4714A] transition-all"
                />
              </div>

              {/* Nickname */}
              <div className="space-y-1.5">
                <label
                  htmlFor="nickname"
                  className="block font-lato text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
                >
                  {t('register.nicknameLabel')} <span className="text-[#C4714A]">*</span>
                </label>
                <input
                  id="nickname"
                  type="text"
                  required
                  placeholder={t('register.nicknamePlaceholder')}
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#E0D8C8] text-[#3B2A22] placeholder-[#5C4033]/40 font-lato text-sm focus:outline-none focus:ring-2 focus:ring-[#C4714A]/40 focus:border-[#C4714A] transition-all"
                />
              </div>
            </div>

            {/* Groom Mate or Bride Mate Selection */}
            <div className="space-y-2">
              <label className="block font-lato text-xs font-semibold text-[#5C4033] uppercase tracking-wider">
                {t('register.partyLabel')} <span className="text-[#C4714A]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, party: 'groom' })}
                  className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${formData.party === 'groom'
                      ? 'border-[#C4714A] bg-[#C4714A]/10 text-[#C4714A] font-semibold shadow-sm ring-1 ring-[#C4714A]'
                      : 'border-[#E0D8C8] bg-white/80 text-[#5C4033]/80 hover:bg-white'
                    }`}
                >
                  <span className="font-lato text-xs sm:text-sm">{t('register.groomPartyOption')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, party: 'bride' })}
                  className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${formData.party === 'bride'
                      ? 'border-[#C4714A] bg-[#C4714A]/10 text-[#C4714A] font-semibold shadow-sm ring-1 ring-[#C4714A]'
                      : 'border-[#E0D8C8] bg-white/80 text-[#5C4033]/80 hover:bg-white'
                    }`}
                >
                  <span className="font-lato text-xs sm:text-sm">{t('register.bridePartyOption')}</span>
                </button>
              </div>
            </div>

            {/* Number of Followers */}
            <div className="space-y-1.5">
              <label
                htmlFor="followersCount"
                className="block font-lato text-xs font-semibold text-[#5C4033] uppercase tracking-wider"
              >
                {t('register.followersLabel')} <span className="text-[#C4714A]">*</span>
              </label>
              <input
                id="followersCount"
                type="number"
                min={1}
                required
                placeholder="1"
                value={formData.followersCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followersCount: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/80 border border-[#E0D8C8] text-[#3B2A22] placeholder-[#5C4033]/40 font-lato text-sm focus:outline-none focus:ring-2 focus:ring-[#C4714A]/40 focus:border-[#C4714A] transition-all"
              />
            </div>

            {/* Attendance Choice */}
            <div className="space-y-2 pt-2">
              <label className="block font-lato text-xs font-semibold text-[#5C4033] uppercase tracking-wider">
                {t('register.attendanceLabel')} <span className="text-[#C4714A]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendance: 'attending' })}
                  className={`py-3.5 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${formData.attendance === 'attending'
                      ? 'border-[#C4714A] bg-[#C4714A]/10 text-[#C4714A] font-semibold shadow-sm ring-1 ring-[#C4714A]'
                      : 'border-[#E0D8C8] bg-white/80 text-[#5C4033]/80 hover:bg-white'
                    }`}
                >
                  <span>🎉</span>
                  <span className="font-lato text-xs sm:text-sm">{t('register.acceptOption')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attendance: 'declined' })}
                  className={`py-3.5 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${formData.attendance === 'declined'
                      ? 'border-[#5C4033] bg-[#5C4033]/10 text-[#3B2A22] font-semibold shadow-sm ring-1 ring-[#5C4033]'
                      : 'border-[#E0D8C8] bg-white/80 text-[#5C4033]/80 hover:bg-white'
                    }`}
                >
                  <span>✉️</span>
                  <span className="font-lato text-xs sm:text-sm">{t('register.declineOption')}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#C4714A] text-white font-lato font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] hover:bg-[#b05f3a] focus:ring-4 focus:ring-[#C4714A]/30 transition-all shadow-md active:scale-[0.99]"
              >
                {t('register.submitButton')}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
