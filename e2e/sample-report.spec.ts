import { test, expect } from '@playwright/test'

test.describe('Sample Report Page', () => {
  test('shows empty state when no samples are loaded', async ({ page }) => {
    await page.goto('/report')
    const main = page.locator('.app-main')
    await expect(main.getByText('No sample files loaded')).toBeVisible()
    await expect(main.getByRole('link', { name: 'Import' })).toBeVisible()
  })
})
