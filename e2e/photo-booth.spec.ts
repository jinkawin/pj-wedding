import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'

const pb = en.photoBooth
const MODEL_HOSTS = ['**/cdn.jsdelivr.net/**', '**/storage.googleapis.com/**']

test.describe('photo booth', () => {
  test.beforeEach(async ({ page }) => {
    for (const host of MODEL_HOSTS) await page.route(host, (route) => route.abort())
  })

  test('renders the header, selectors and empty gallery', async ({ page }) => {
    await page.goto('/photo-booth')
    await expect(page.getByRole('heading', { level: 1, name: pb.title })).toBeVisible()
    for (const name of Object.values(pb.polaroidStyles)) {
      await expect(page.getByRole('button', { name })).toBeVisible()
    }
    await expect(page.getByText(pb.noPhotos)).toBeVisible()
  })

  test('back link returns to the overview', async ({ page }) => {
    await page.goto('/photo-booth')
    await page.getByRole('link', { name: en.about.backToOverview }).click()
    await expect(page).toHaveURL(/\/overview$/)
  })

  test('model download failure leaves a visible error and no endless spinner', async ({ page }) => {
    await page.goto('/photo-booth')
    await expect(page.getByText(/Failed to load camera or AI model/)).toBeVisible()
    await expect(page.getByText(/Loading/)).toHaveCount(0)
  })

  test('the polaroid style choice changes the required shots', async ({ page }) => {
    await page.goto('/photo-booth')
    await page.getByRole('button', { name: pb.polaroidStyles.doubleShots }).click()
    await expect(page.getByText(/take 2 shots/)).toBeVisible()
    await page.getByRole('button', { name: pb.polaroidStyles.tripleShots }).click()
    await expect(page.getByText(/take 3 shots/)).toBeVisible()
    await page.getByRole('button', { name: pb.polaroidStyles.singleShot }).click()
    await expect(page.getByText(/take 1 shots/)).toBeVisible()
  })

  test('face tracker starts with no faces', async ({ page }) => {
    await page.goto('/photo-booth')
    await expect(page.getByText('Scanning Faces...')).toBeVisible()
  })

  test('does not open the camera when models fail to load', async ({ page, context }) => {
    await context.grantPermissions(['camera'])
    await page.addInitScript(() => {
      ;(window as unknown as { __gum: number }).__gum = 0
      const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
      navigator.mediaDevices.getUserMedia = (c) => {
        ;(window as unknown as { __gum: number }).__gum++

        return original(c)
      }
    })
    await page.goto('/photo-booth')
    await expect(page.getByText(/Failed to load camera or AI model/)).toBeVisible()
    expect(await page.evaluate(() => (window as unknown as { __gum: number }).__gum)).toBe(0)
  })
})

test('page stays usable while models load slowly', async ({ page }) => {
  await page.route('**/cdn.jsdelivr.net/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.abort()
  })
  await page.route('**/storage.googleapis.com/**', (route) => route.abort())
  await page.goto('/photo-booth')
  await expect(page.getByRole('heading', { level: 1, name: pb.title })).toBeVisible()
  await expect(page.getByText(/Failed to load camera or AI model/)).toBeVisible({ timeout: 10_000 })
})
