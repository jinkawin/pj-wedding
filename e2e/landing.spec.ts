import { test, expect } from './fixtures'

const DAY_MS = 86_400_000
const WEDDING_DATE = new Date('2027-02-27T10:00:00+07:00')

test.describe('landing', () => {
  test('hides the navbar and shows the closed envelope', async ({ page, errors }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Open the wedding invitation' })).toBeVisible()
    await expect(page.getByRole('banner')).toHaveCount(0)
    expect(errors).toEqual([])
  })

  test('opening the envelope reveals the invitation and countdown', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open the wedding invitation' }).click()
    await expect(page.getByRole('button', { name: 'Enter Website' })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Days', { exact: true })).toBeVisible()
  })

  test('enter website navigates to overview with the navbar', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open the wedding invitation' }).click()
    await page.getByRole('button', { name: 'Enter Website' }).click({ timeout: 10_000 })
    await expect(page).toHaveURL(/\/overview$/)
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('countdown shows zeros after the wedding date', async ({ page }) => {
    await page.clock.install({ time: new Date(WEDDING_DATE.getTime() + DAY_MS) })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open the wedding invitation' }).click()
    const countdown = page.getByLabel('Time until the wedding')
    await expect(countdown).toBeVisible({ timeout: 10_000 })
    await expect(countdown).toHaveText(/^00Days:00Hours:00Min:00Sec$/)
  })

  test('countdown shows 1 day when 25 hours remain', async ({ page }) => {
    await page.clock.install({ time: new Date(WEDDING_DATE.getTime() - (DAY_MS + 3_600_000)) })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open the wedding invitation' }).click()
    const countdown = page.getByLabel('Time until the wedding')
    await expect(countdown).toBeVisible({ timeout: 10_000 })
    await expect(countdown).toHaveText(/^01Days:0[01]Hours:/)
  })
})
