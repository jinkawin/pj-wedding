'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'
import en from '@/locale/en/translations.json'
import th from '@/locale/th/translations.json'
import cn from '@/locale/cn/translations.json'
import jp from '@/locale/jp/translations.json'

export type Locale = 'en' | 'th' | 'cn' | 'jp'

type Translations = typeof en

const dictionary: Record<Locale, Translations> = {
  en,
  th: th as Translations,
  cn: cn as Translations,
  jp: jp as Translations,
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const STORAGE_KEY = 'pj_wedding_locale'

function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.')
  let current: any = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [, startTransition] = useTransition()

  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'th' || savedLocale === 'cn' || savedLocale === 'jp')) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    startTransition(() => {
      setLocaleState(newLocale)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newLocale)
      }
    })
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const currentDict = dictionary[locale]
    const fallbackDict = dictionary.en

    let value = getNestedValue(currentDict, key) ?? getNestedValue(fallbackDict, key) ?? key

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        value = value.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(paramVal))
      })
    }

    return value
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return context
}
