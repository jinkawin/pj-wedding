import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'
import { GALLERY_ITEMS, TIMELINE_YEARS } from '../src/data/galleryData'

test.describe('gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/images.unsplash.com/**', (route) =>
      route.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64') }),
    )
    await page.route('**/_next/image**', (route) =>
      route.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64') }),
    )
    await page.goto('/gallery')
  })

  test('renders every photo card', async ({ page }) => {
    const titles = await page.getByRole('heading', { level: 3 }).allInnerTexts()
    expect(titles).toEqual(expect.arrayContaining(GALLERY_ITEMS.map((i) => i.title)))
    expect(titles).toHaveLength(GALLERY_ITEMS.length)
  })

  test('year filter shows only that year', async ({ page }) => {
    const year = TIMELINE_YEARS[0]
    await page.getByRole('button', { name: String(year), exact: true }).click()
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(GALLERY_ITEMS.filter((i) => i.year === year).length)
    await page.getByRole('button', { name: en.gallery.allYears }).click()
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(GALLERY_ITEMS.length)
  })

  test('category filter narrows the cards', async ({ page }) => {
    await page.getByRole('button', { name: en.gallery.filter.proposal }).click()
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(GALLERY_ITEMS.filter((i) => i.category === 'proposal').length)
  })

  test('opening a card shows the lightbox with its story', async ({ page }) => {
    const item = GALLERY_ITEMS[0]
    await page.getByRole('heading', { level: 3, name: item.title }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { level: 2, name: item.title })).toBeVisible()
    await expect(dialog).toContainText(item.story)
  })

  test('next and previous wrap around', async ({ page }) => {
    await page.getByRole('heading', { level: 3, name: GALLERY_ITEMS[0].title }).click()
    const dialog = page.getByRole('dialog')
    await page.getByRole('button', { name: en.gallery.prev }).click()
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(GALLERY_ITEMS[GALLERY_ITEMS.length - 1].title)
    await page.getByRole('button', { name: en.gallery.next }).click()
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(GALLERY_ITEMS[0].title)
  })

  test('keyboard arrows navigate and Escape closes', async ({ page }) => {
    await page.getByRole('heading', { level: 3, name: GALLERY_ITEMS[0].title }).click()
    const dialog = page.getByRole('dialog')
    await page.keyboard.press('ArrowRight')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(GALLERY_ITEMS[1].title)
    await page.keyboard.press('ArrowLeft')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(GALLERY_ITEMS[0].title)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  })

  test('close button closes and restores page scroll', async ({ page }) => {
    await page.getByRole('heading', { level: 3, name: GALLERY_ITEMS[0].title }).click()
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')
    await page.getByRole('button', { name: en.gallery.close }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })
})
