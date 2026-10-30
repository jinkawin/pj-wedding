import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'

test.describe('about', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
  })

  test('overview tab shows both profiles', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: en.about.bride.name })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: en.about.groom.name })).toBeVisible()
  })

  test('bride tab shows only the bride', async ({ page }) => {
    await page.getByRole('button', { name: en.about.tabs.bride }).click()
    await expect(page.getByRole('heading', { level: 2, name: en.about.bride.name })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: en.about.groom.name })).toHaveCount(0)
  })

  test('groom tab shows only the groom', async ({ page }) => {
    await page.getByRole('button', { name: en.about.tabs.groom }).click()
    await expect(page.getByRole('heading', { level: 2, name: en.about.groom.name })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: en.about.bride.name })).toHaveCount(0)
  })

  test('story tab shows the story and hides the profiles', async ({ page }) => {
    await page.getByRole('button', { name: en.about.tabs.story }).click()
    await expect(page.getByRole('heading', { level: 2, name: en.about.story.title })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: en.about.bride.name })).toHaveCount(0)
  })

  test('profile images load', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    const broken = await page.locator('main img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc),
    )
    expect(broken).toEqual([])
  })
})
