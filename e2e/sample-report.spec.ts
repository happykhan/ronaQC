import { test, expect } from '@playwright/test'

test.describe('Sample Report Page', () => {
  test('shows empty state when no samples are loaded', async ({ page }) => {
    await page.goto('/report')
    await expect(page.getByText('No sample files loaded')).toBeVisible()
    await expect(page.getByText('Import')).toBeVisible()
  })
})
