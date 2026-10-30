import { test as base, expect } from '@playwright/test'

export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, provide) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`console: ${m.text()}`)
    })
    await provide(errors)
    expect(errors).toEqual([])
  },
})

export { expect }
