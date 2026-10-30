import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'

test.describe('overview', () => {
  test('shows the heading, countdown and calendar menu', async ({ page }) => {
    await page.goto('/overview')
    await expect(page.getByRole('heading', { level: 1, name: en.overview.title })).toBeVisible()
    await expect(page.getByLabel(en.countdown.ariaLabel)).toBeVisible()
    await expect(page.getByRole('button', { name: en.countdown.addToCalendar })).toBeVisible()
  })

  test('the register call-to-action goes to /register', async ({ page }) => {
    await page.goto('/overview')
    await page.getByRole('link', { name: en.overview.registerNow }).click()
    await expect(page).toHaveURL(/\/register$/)
  })

  test('add to calendar menu offers google, ical and outlook', async ({ page }) => {
    await page.goto('/overview')
    const trigger = page.getByRole('button', { name: en.countdown.addToCalendar })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const google = page.getByRole('link', { name: en.countdown.googleCalendar })
    await expect(google).toHaveAttribute('target', '_blank')
    await expect(google).toHaveAttribute('rel', /noopener/)
    await expect(google).toHaveAttribute('href', /dates=20270227T030000Z\/20270227T070000Z/)
    await expect(page.getByRole('link', { name: /Outlook/ })).toHaveAttribute('href', /startdt=2027-02-27T10:00:00/)
  })

  test('ical download is a valid event on the wedding date', async ({ page }) => {
    await page.goto('/overview')
    await page.getByRole('button', { name: en.countdown.addToCalendar }).click()
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: en.countdown.appleCalendar }).click(),
    ])
    expect(download.suggestedFilename()).toBe('wedding-parima-jinkawin.ics')
    const path = await download.path()
    const { readFileSync } = await import('node:fs')
    const ics = readFileSync(path, 'utf8')
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('DTSTART:20270227T030000Z')
    expect(ics).toContain('DTEND:20270227T070000Z')
    expect(ics).toContain('END:VCALENDAR')
  })

  test('calendar menu closes on outside click', async ({ page }) => {
    await page.goto('/overview')
    const trigger = page.getByRole('button', { name: en.countdown.addToCalendar })
    await trigger.click()
    await page.mouse.click(5, 300)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
