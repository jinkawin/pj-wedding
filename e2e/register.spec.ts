import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'

const r = en.register

test.describe('register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('shows the form with defaults', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: r.title })).toBeVisible()
    await expect(page.getByLabel(new RegExp(`^${r.followersLabel}`))).toHaveValue('1')
    await expect(page.getByRole('button', { name: r.submitButton })).toBeVisible()
  })

  test('empty required fields block submit', async ({ page }) => {
    await page.getByRole('button', { name: r.submitButton }).click()
    await expect(page.getByRole('heading', { level: 1, name: r.title })).toBeVisible()
    await expect(page.getByLabel(new RegExp(`^${r.nameLabel}`))).toBeFocused()
    await expect(page.getByText(r.submittedMessage)).toHaveCount(0)
  })

  test('nickname is required too', async ({ page }) => {
    await page.getByLabel(new RegExp(`^${r.nameLabel}`)).fill('John Doe')
    await page.getByRole('button', { name: r.submitButton }).click()
    await expect(page.getByLabel(new RegExp(`^${r.nicknameLabel}`))).toBeFocused()
  })

  test('submitting shows a thank-you with the nickname', async ({ page }) => {
    await page.getByLabel(new RegExp(`^${r.nameLabel}`)).fill('John Doe')
    await page.getByLabel(new RegExp(`^${r.nicknameLabel}`)).fill('Johnny')
    await page.getByRole('button', { name: r.submitButton }).click()
    await expect(page.getByRole('heading', { level: 2, name: 'Thank You, Johnny!' })).toBeVisible()
    await expect(page.getByText(r.submittedMessage)).toBeVisible()
  })

  test('declined attendance can also be submitted', async ({ page }) => {
    await page.getByLabel(new RegExp(`^${r.nameLabel}`)).fill('Jane')
    await page.getByLabel(new RegExp(`^${r.nicknameLabel}`)).fill('J')
    await page.getByRole('button', { name: r.declineOption }).click()
    await page.getByRole('button', { name: r.bridePartyOption }).click()
    await page.getByRole('button', { name: r.submitButton }).click()
    await expect(page.getByRole('heading', { level: 2, name: 'Thank You, J!' })).toBeVisible()
  })

  test('followers count never drops below 1', async ({ page }) => {
    const field = page.getByLabel(new RegExp(`^${r.followersLabel}`))
    await field.fill('0')
    await expect(field).toHaveValue('1')
    await field.fill('5')
    await expect(field).toHaveValue('5')
  })

  test('edit response returns to the form with values kept', async ({ page }) => {
    await page.getByLabel(new RegExp(`^${r.nameLabel}`)).fill('John Doe')
    await page.getByLabel(new RegExp(`^${r.nicknameLabel}`)).fill('Johnny')
    await page.getByLabel(new RegExp(`^${r.followersLabel}`)).fill('3')
    await page.getByRole('button', { name: r.submitButton }).click()
    await page.getByRole('button', { name: r.editResponse }).click()
    await expect(page.getByLabel(new RegExp(`^${r.nameLabel}`))).toHaveValue('John Doe')
    await expect(page.getByLabel(new RegExp(`^${r.followersLabel}`))).toHaveValue('3')
  })

  test('submitting makes no network request', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (req) => {
      if (['POST', 'PUT', 'PATCH'].includes(req.method())) requests.push(req.url())
    })
    await page.getByLabel(new RegExp(`^${r.nameLabel}`)).fill('John')
    await page.getByLabel(new RegExp(`^${r.nicknameLabel}`)).fill('J')
    await page.getByRole('button', { name: r.submitButton }).click()
    await expect(page.getByText(r.submittedMessage)).toBeVisible()
    expect(requests).toEqual([])
  })
})
