import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'
import { AGENDA_EVENTS } from '../src/data/agendaData'

const byPeriod = (p: 'morning' | 'evening') => AGENDA_EVENTS.filter((e) => e.period === p)

test.describe('agenda', () => {
  test('lists every event in data order', async ({ page }) => {
    await page.goto('/agenda')
    const titles = await page.getByRole('heading', { level: 3 }).allInnerTexts()
    expect(titles).toEqual(AGENDA_EVENTS.map((e) => e.titleDefault))
  })

  test('shows the date banner and the event times', async ({ page }) => {
    await page.goto('/agenda')
    await expect(page.getByText('27 February 2027').first()).toBeVisible()
    for (const e of AGENDA_EVENTS) {
      await expect(page.getByText(e.time, { exact: true })).toBeVisible()
    }
  })

  test('morning tab filters events and shows the morning note', async ({ page }) => {
    await page.goto('/agenda')
    await page.getByRole('button', { name: en.agenda.morningTab }).click()
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(byPeriod('morning').length)
    await expect(page.getByText(en.agenda.morningNote)).toBeVisible()
    await expect(page.getByText(en.agenda.eveningNote)).toHaveCount(0)
  })

  test('evening tab filters events and shows the evening note', async ({ page }) => {
    await page.goto('/agenda')
    await page.getByRole('button', { name: en.agenda.eveningTab }).click()
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(byPeriod('evening').length)
    await expect(page.getByText(en.agenda.eveningNote)).toBeVisible()
  })

  test('all tab restores every event', async ({ page }) => {
    await page.goto('/agenda')
    await page.getByRole('button', { name: en.agenda.eveningTab }).click()
    await page.getByRole('button', { name: en.agenda.allTab }).click()
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(AGENDA_EVENTS.length)
  })

  test('highlighted events carry a highlight badge', async ({ page }) => {
    await page.goto('/agenda')
    const highlighted = AGENDA_EVENTS.filter((e) => e.highlight).length
    await expect(page.getByText('★ Highlight')).toHaveCount(highlighted)
  })

  test('has an add-to-calendar menu', async ({ page }) => {
    await page.goto('/agenda')
    await page.getByRole('button', { name: en.countdown.addToCalendar }).click()
    await expect(page.getByRole('link', { name: en.countdown.googleCalendar })).toBeVisible()
  })
})
