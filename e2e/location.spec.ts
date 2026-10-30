import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'
import { weddingConfig } from '../src/configs/app'

const { venueName, dateTimeText, mapsEmbedUrl, directMapsUrl } = weddingConfig.location

test.describe('location', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/www.google.com/maps/**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>map</body></html>' }),
    )
    await page.goto('/location')
  })

  test('shows the venue name, date and city', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: en.location.title })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: venueName })).toBeVisible()
    await expect(page.getByText(dateTimeText)).toBeVisible()
    await expect(page.getByText(en.location.city)).toBeVisible()
  })

  test('embeds the configured map', async ({ page }) => {
    const frame = page.getByTitle('Wedding Venue Location Map')
    await expect(frame).toBeVisible()
    await expect(frame).toHaveAttribute('src', mapsEmbedUrl)
  })

  test('open in maps link is external and safe', async ({ page }) => {
    const link = page.getByRole('link', { name: en.location.openMaps })
    await expect(link).toHaveAttribute('href', directMapsUrl)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })
})
