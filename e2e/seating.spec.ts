import { test, expect } from './fixtures'
import en from '../src/locale/en/translations.json'
import { SEATING_TABLES } from '../src/data/seatingData'

const firstTable = SEATING_TABLES[0]
const firstSeat = firstTable.guests[0]

test.describe('seating', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seating')
  })

  test('renders a node for every table', async ({ page }) => {
    for (const table of SEATING_TABLES) {
      await expect(page.getByText(`T-${table.id}`, { exact: true })).toBeVisible()
    }
  })

  test('searching a guest lists the match with its table', async ({ page }) => {
    await page.getByLabel('Search guest or table').fill(firstSeat.guestName)
    const result = page.getByRole('button', { name: new RegExp(firstSeat.guestName) }).first()
    await expect(result).toBeVisible()
    await expect(result).toContainText(firstTable.name)
  })

  test('search is case-insensitive', async ({ page }) => {
    await page.getByLabel('Search guest or table').fill(firstSeat.guestName.toUpperCase())
    await expect(page.getByRole('button', { name: new RegExp(firstSeat.guestName) }).first()).toBeVisible()
  })

  test('selecting a result opens the table details with the guest highlighted', async ({ page }) => {
    await page.getByLabel('Search guest or table').fill(firstSeat.guestName)
    await page.getByRole('button', { name: new RegExp(firstSeat.guestName) }).first().click()
    await expect(page.getByRole('heading', { level: 2, name: firstTable.name })).toBeVisible()
    await expect(page.getByText('★ Found')).toBeVisible()
    await expect(page.getByText(en.seating.yourSeat, { exact: false }).first()).toBeVisible()
  })

  test('searching by table name returns that table\'s guests', async ({ page }) => {
    await page.getByLabel('Search guest or table').fill(firstTable.name)
    for (const guest of firstTable.guests) {
      await expect(page.getByRole('button', { name: new RegExp(guest.guestName) }).first()).toBeVisible()
    }
  })

  test('no match shows the empty state', async ({ page }) => {
    await page.getByLabel('Search guest or table').fill('zzzz-nobody')
    await expect(page.getByText(en.seating.noResults)).toBeVisible()
  })

  test('clear button empties the search and hides suggestions', async ({ page }) => {
    const input = page.getByLabel('Search guest or table')
    await input.fill('zzzz')
    await page.getByRole('button', { name: en.seating.clearSearch }).click()
    await expect(input).toHaveValue('')
    await expect(page.getByText(en.seating.noResults)).toHaveCount(0)
  })

  test('clicking a table node opens its details', async ({ page }) => {
    const target = SEATING_TABLES[1]
    await page.getByText(`T-${target.id}`, { exact: true }).click()
    await expect(page.getByRole('heading', { level: 2, name: target.name })).toBeVisible()
  })

  test('list view lists the tables', async ({ page }) => {
    await page.getByRole('button', { name: new RegExp(en.seating.viewList) }).click()
    await expect(page.getByText(firstTable.name).first()).toBeVisible()
    await page.getByRole('button', { name: new RegExp(en.seating.viewMap) }).click()
    await expect(page.getByText(`T-${firstTable.id}`, { exact: true })).toBeVisible()
  })

  test('category filter dims tables outside the category', async ({ page }) => {
    await page.getByRole('button', { name: 'VIP & Parents', exact: true }).first().click()
    const vip = SEATING_TABLES.find((t) => t.category === 'vip')!
    const other = SEATING_TABLES.find((t) => t.category !== 'vip')!
    const nodeOf = (id: number) => page.getByText(`T-${id}`, { exact: true }).locator('xpath=ancestor::div[contains(@class,"absolute")][1]')
    await expect(nodeOf(vip.id)).toHaveClass(/opacity-100/)
    await expect(nodeOf(other.id)).toHaveClass(/opacity-35/)
  })
})
