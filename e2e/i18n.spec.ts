import { test, expect } from './fixtures'
import { LOCALES, NAV_ROUTES } from './routes'
import en from '../src/locale/en/translations.json'
import th from '../src/locale/th/translations.json'
import cn from '../src/locale/cn/translations.json'
import jp from '../src/locale/jp/translations.json'

const STORAGE_KEY = 'pj_wedding_locale'
const dictionaries = { en, th, cn, jp }

type Dict = { nav: Record<string, string> }
const navLabel = (code: keyof typeof dictionaries, key: string) =>
  (dictionaries[code] as unknown as Dict).nav[key]

const flatten = (obj: unknown, prefix = ''): string[] =>
  Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  )

test.describe('i18n', () => {
  test('defaults to English', async ({ page }) => {
    await page.goto('/overview')
    await expect(page.getByRole('banner').getByRole('button', { name: /EN/ })).toBeVisible()
  })

  for (const { code, label } of LOCALES) {
    test(`switching to ${code} updates the nav and persists across reload`, async ({ page, isMobile }) => {
      await page.goto('/overview')
      await page.getByRole('banner').getByRole('button', { name: /EN/ }).click()
      await page.getByRole('button', { name: label, exact: false }).click()
      await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY)).toBe(code)

      if (isMobile) await page.getByRole('button', { name: 'Toggle Navigation Menu' }).click()
      const expected = navLabel(code, 'agenda')
      await expect(page.getByRole('banner').getByRole('link', { name: expected })).toBeVisible()

      await page.reload()
      if (isMobile) await page.getByRole('button', { name: 'Toggle Navigation Menu' }).click()
      await expect(page.getByRole('banner').getByRole('link', { name: expected })).toBeVisible()
    })
  }

  test('locale choice survives route changes', async ({ page }) => {
    await page.addInitScript(([k]) => localStorage.setItem(k, 'th'), [STORAGE_KEY])
    await page.goto('/agenda')
    await expect(page.getByRole('banner').getByRole('button', { name: /TH/ })).toBeVisible()
    await page.goto('/seating')
    await expect(page.getByRole('banner').getByRole('button', { name: /TH/ })).toBeVisible()
  })

  test('invalid stored locale falls back to English', async ({ page }) => {
    await page.addInitScript(([k]) => localStorage.setItem(k, 'xx'), [STORAGE_KEY])
    await page.goto('/overview')
    await expect(page.getByRole('banner').getByRole('button', { name: /EN/ })).toBeVisible()
  })

  test('html lang attribute follows the selected locale', async ({ page }) => {
    await page.addInitScript(([k]) => localStorage.setItem(k, 'th'), [STORAGE_KEY])
    await page.goto('/overview')
    await expect(page.getByRole('banner').getByRole('button', { name: /TH/ })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  })

  test('every locale has every English key', () => {
    const enKeys = flatten(en)
    for (const [code, dict] of Object.entries({ th, cn, jp })) {
      const keys = new Set(flatten(dict))
      const missing = enKeys.filter((k) => !keys.has(k))
      expect(missing, `${code} missing keys`).toEqual([])
    }
  })

  test.describe('no raw translation keys leak into the UI', () => {
    const enKeys = flatten(en).filter((k) => k.includes('.'))
    for (const { code } of LOCALES) {
      for (const { path } of NAV_ROUTES) {
        test(`${code} ${path}`, async ({ page }) => {
          await page.addInitScript(([k, c]) => localStorage.setItem(k, c), [STORAGE_KEY, code])
          await page.goto(path)
          await page.waitForLoadState('networkidle')
          const text = await page.locator('body').innerText()
          const leaked = enKeys.filter((k) => text.includes(k))
          expect(leaked).toEqual([])
        })
      }
    }
  })
})
