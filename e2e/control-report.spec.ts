import { test, expect } from '@playwright/test'

test.describe('Control Report Page', () => {
  test('shows empty state when no control is loaded', async ({ page }) => {
    await page.goto('/control')
    await expect(page.getByText('No control file loaded')).toBeVisible()
    await expect(page.getByText('Import')).toBeVisible()
  })
})
