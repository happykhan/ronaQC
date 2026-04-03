import { test, expect } from '@playwright/test'

test.describe('Control Report Page', () => {
  test('shows empty state when no control is loaded', async ({ page }) => {
    await page.goto('/control')
    const main = page.locator('.app-main')
    await expect(main.getByText('No control file loaded')).toBeVisible()
    await expect(main.getByRole('link', { name: 'Import' })).toBeVisible()
  })
})
