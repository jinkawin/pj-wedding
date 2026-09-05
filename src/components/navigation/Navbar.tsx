'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'
import { useTranslation } from '@/locale/I18nContext'

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  // Do not render navbar on landing page (root route '/')
  if (pathname === '/') {
    return null
  }

  const NAV_ITEMS = [
    { key: 'nav.overview', href: '/overview' },
    { key: 'nav.location', href: '/location' },
    { key: 'nav.about', href: '/about' },
    { key: 'nav.register', href: '/register' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F1]/90 backdrop-blur-md border-b border-[#E0D8C8] px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-vibes text-2xl text-[#3B2A22] hover:opacity-80 transition-opacity">
          P &amp; J
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 sm:gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-lato text-xs uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? 'text-[#C4714A] font-semibold border-b border-[#C4714A] pb-0.5'
                      : 'text-[#5C4033]/70 hover:text-[#3B2A22]'
                  }`}
                >
                  {t(item.key)}
                </Link>
              )
            })}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
