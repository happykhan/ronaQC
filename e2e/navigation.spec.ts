import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('redirects root to /import', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/import')
  })

  test('navigates between pages via tab nav', async ({ page }) => {
    await page.goto('/import')
    const tabNav = page.locator('.rqc-tab-nav')

    await tabNav.getByText('Control Report').click()
    await expect(page).toHaveURL('/control')

    await tabNav.getByText('Sample Report').click()
    await expect(page).toHaveURL('/report')

    await tabNav.getByText('Help').click()
    await expect(page).toHaveURL('/help')

    await tabNav.getByText('Import').click()
    await expect(page).toHaveURL('/import')
  })

  test('theme toggle switches between dark and light', async ({ page }) => {
    await page.goto('/import')

    // Default is dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.getByRole('button', { name: 'Light theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.getByRole('button', { name: 'Dark theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})
