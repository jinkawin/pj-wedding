import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React, { act, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { I18nProvider, useTranslation } from './I18nContext'
import en from './en/translations.json'
import th from './th/translations.json'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const STORAGE_KEY = 'pj_wedding_locale'

let container: HTMLDivElement
let root: Root
let api: ReturnType<typeof useTranslation>

function Probe() {
  const value = useTranslation()
  useEffect(() => {
    api = value
  })

  return null
}

const mount = () => {
  act(() => {
    root.render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    )
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.lang = ''
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('I18nProvider', () => {
  it('defaults to English', () => {
    mount()
    expect(api.locale).toBe('en')
    expect(api.t('nav.overview')).toBe(en.nav.overview)
    expect(document.documentElement.lang).toBe('en')
  })

  it('restores a saved locale', () => {
    localStorage.setItem(STORAGE_KEY, 'th')
    mount()
    expect(api.locale).toBe('th')
    expect(api.t('nav.overview')).toBe(th.nav.overview)
  })

  it('ignores an unknown saved locale', () => {
    localStorage.setItem(STORAGE_KEY, 'xx')
    mount()
    expect(api.locale).toBe('en')
  })

  it.each([
    ['th', 'th'],
    ['cn', 'zh'],
    ['jp', 'ja'],
    ['en', 'en'],
  ] as const)('setLocale(%s) saves it and sets html lang to %s', (locale, lang) => {
    mount()
    act(() => api.setLocale(locale))
    expect(api.locale).toBe(locale)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(locale)
    expect(document.documentElement.lang).toBe(lang)
  })

  it('returns the key itself when it is missing everywhere', () => {
    mount()
    expect(api.t('does.not.exist')).toBe('does.not.exist')
  })

  it('does not resolve a path that points at an object', () => {
    mount()
    expect(api.t('nav')).toBe('nav')
  })

  it('interpolates params, tolerating spaces inside the braces and repeats', () => {
    mount()
    expect(api.t('register.thankYou', { name: 'Johnny' })).toBe('Thank You, Johnny!')
    expect(api.t('seating.capacity', { current: 3, max: 8 })).toContain('3')
  })

  it('leaves unmatched placeholders untouched', () => {
    mount()
    expect(api.t('register.thankYou')).toBe('Thank You, {{name}}!')
  })
})

describe('useTranslation', () => {
  it('throws outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => act(() => root.render(<Probe />))).toThrow('useTranslation must be used within an I18nProvider')
    spy.mockRestore()
  })
})
