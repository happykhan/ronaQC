import { test, expect } from '@playwright/test'

test.describe('Help Page', () => {
  test('renders all help sections', async ({ page }) => {
    await page.goto('/help')

    await expect(page.getByText('Overview')).toBeVisible()
    await expect(page.getByText('Getting Started')).toBeVisible()
    await expect(page.getByText('File Requirements')).toBeVisible()
    await expect(page.getByText('Understanding the Control Report')).toBeVisible()
    await expect(page.getByText('Understanding the Sample Report')).toBeVisible()
    await expect(page.getByText('ARTIC Primer Versions')).toBeVisible()
    await expect(page.getByText('Subsampling')).toBeVisible()
    await expect(page.getByText('Troubleshooting')).toBeVisible()
    await expect(page.getByText('Citation')).toBeVisible()
    await expect(page.getByText('Technology & Privacy')).toBeVisible()
  })

  test('shows QC metrics and thresholds table', async ({ page }) => {
    await page.goto('/help')
    await expect(page.getByText('QC Metrics & Thresholds')).toBeVisible()
    await expect(page.getByText('Genome Completeness')).toBeVisible()
    await expect(page.getByText('PHA4GE')).toBeVisible()
  })

  test('mentions primer scheme source', async ({ page }) => {
    await page.goto('/help')
    await expect(page.getByText('quick-lab/primerschemes')).toBeVisible()
  })

  test('mentions privacy (no data upload)', async ({ page }) => {
    await page.goto('/help')
    await expect(page.getByText('No data leaves your computer')).toBeVisible()
  })
})
