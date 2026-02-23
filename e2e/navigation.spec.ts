import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('redirects root to /import', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/import')
  })

  test('navigates between pages', async ({ page }) => {
    await page.goto('/import')

    await page.click('text=Control Report')
    await expect(page).toHaveURL('/control')
    await expect(page.locator('h1')).toContainText('Control Report')

    await page.click('text=Sample Report')
    await expect(page).toHaveURL('/report')
    await expect(page.locator('h1')).toContainText('Sample Report')

    await page.click('text=Help')
    await expect(page).toHaveURL('/help')
    await expect(page.locator('h1')).toContainText('Help')

    await page.click('text=Import')
    await expect(page).toHaveURL('/import')
  })

  test('theme toggle switches between dark and light', async ({ page }) => {
    await page.goto('/import')

    // Default is dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // Click the theme toggle (switch role)
    const themeToggle = page.getByRole('switch')
    await themeToggle.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    // Toggle back
    await themeToggle.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('shows 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent')
    await expect(page.locator('h1')).toContainText('404')
  })
})
