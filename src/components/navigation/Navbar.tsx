'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'
import { useTranslation } from '@/locale/I18nContext'

const NAV_ITEMS = [
  { key: 'nav.overview', href: '/overview' },
  { key: 'nav.location', href: '/location' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.register', href: '/register' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Do not render navigation on landing page (root route '/')
  if (pathname === '/') {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F1]/95 backdrop-blur-md border-b border-[#E0D8C8] px-4 sm:px-6 py-3.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Title */}
        <Link href="/" className="font-vibes text-2xl sm:text-3xl text-[#3B2A22] hover:opacity-80 transition-opacity">
          P &amp; J
        </Link>

        {/* Right Section: Language Switcher + Desktop Nav + Mobile Hamburger */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-lato text-xs uppercase tracking-[0.15em] transition-colors ${isActive
                      ? 'text-[#C4714A] font-semibold border-b border-[#C4714A] pb-0.5'
                      : 'text-[#5C4033]/70 hover:text-[#3B2A22]'
                    }`}
                >
                  {t(item.key)}
                </Link>
              )
            })}
          </nav>

          {/* Language Switcher Dropdown */}
          <LanguageSwitcher />

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#3B2A22] hover:bg-[#EAE2D2]/50 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-[#E0D8C8] mt-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-lato text-xs uppercase tracking-[0.15em] transition-colors ${isActive
                    ? 'bg-[#C4714A]/10 text-[#C4714A] font-semibold'
                    : 'text-[#5C4033] hover:bg-[#FAF7F1]'
                  }`}
              >
                <span>{t(item.key)}</span>
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
