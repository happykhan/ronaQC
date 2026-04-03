import { test, expect } from '@playwright/test'

test.describe('Help Page', () => {
  test('renders all help sections', async ({ page }) => {
    await page.goto('/help')
    const main = page.locator('.app-main')

    await expect(main.getByRole('heading', { name: 'Overview' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'Getting Started' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'File Requirements' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'Understanding the Control Report' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'Understanding the Sample Report' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'ARTIC Primer Versions' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'Subsampling' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'Troubleshooting' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'Citation' })).toBeVisible()
    await expect(main.getByRole('heading', { name: 'Technology & Privacy' })).toBeVisible()
  })

  test('shows QC metrics and thresholds table', async ({ page }) => {
    await page.goto('/help')
    const main = page.locator('.app-main')
    await expect(main.getByRole('heading', { name: 'QC Metrics & Thresholds' })).toBeVisible()
    await expect(main.getByText('Genome Completeness').first()).toBeVisible()
    await expect(main.getByText(/PHA4GE/).first()).toBeVisible()
  })

  test('mentions primer scheme source', async ({ page }) => {
    await page.goto('/help')
    await expect(page.getByText('quick-lab/primerschemes')).toBeVisible()
  })

  test('mentions privacy (no data upload)', async ({ page }) => {
    await page.goto('/help')
    const main = page.locator('.app-main')
    await expect(main.getByText('No data leaves your computer').first()).toBeVisible()
  })
})
