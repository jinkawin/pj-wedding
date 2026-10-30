import { test, expect } from './fixtures'
import { NAV_ROUTES } from './routes'

test.describe('navigation', () => {
  for (const { path } of NAV_ROUTES) {
    test(`${path} loads with the navbar and no errors`, async ({ page, errors, context }) => {
      await context.grantPermissions([])
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByRole('banner')).toBeVisible()
      await expect(page.locator('main').first()).toBeVisible()
      expect(errors).toEqual([])
    })
  }

  test('unknown route returns 404', async ({ page, errors }) => {
    const response = await page.goto('/does-not-exist')
    expect(response?.status()).toBe(404)
    errors.length = 0
  })

  test('desktop nav highlights the active link', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop nav is hidden below lg')
    await page.goto('/agenda')
    const nav = page.getByRole('banner').getByRole('navigation')
    await expect(nav.getByRole('link', { name: 'Agenda' })).toHaveClass(/font-semibold/)
    await expect(nav.getByRole('link', { name: 'Overview' })).not.toHaveClass(/font-semibold/)
  })

  test('brand link returns to the landing page', async ({ page }) => {
    await page.goto('/agenda')
    await page.getByRole('link', { name: /P\s*&\s*J/ }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('banner')).toHaveCount(0)
  })

  test('mobile menu opens, navigates and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'hamburger only below lg')
    await page.goto('/overview')
    const toggle = page.getByRole('button', { name: 'Toggle Navigation Menu' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.getByRole('banner').getByRole('link', { name: 'Seat Map' }).click()
    await expect(page).toHaveURL(/\/seating$/)
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
