import { test, expect } from '@playwright/test'

test.describe('Import Page', () => {
  test('shows file upload areas', async ({ page }) => {
    await page.goto('/import')

    await expect(page.getByText('Negative Control')).toBeVisible()
    await expect(page.getByText('Sample Data')).toBeVisible()
    await expect(page.getByText('Drop negative control BAM file here')).toBeVisible()
    await expect(page.getByText('Drop sample BAM files here')).toBeVisible()
  })

  test('shows ARTIC version selector', async ({ page }) => {
    await page.goto('/import')

    const selector = page.locator('#artic-version')
    await expect(selector).toBeVisible()

    const options = selector.locator('option')
    await expect(options).toHaveCount(5)
    await expect(options.first()).toHaveText('ARTIC V4.1')
  })

  test('shows sample data download link', async ({ page }) => {
    await page.goto('/import')
    await expect(page.getByText('Download Sample Data')).toBeVisible()
  })

  test('shows informational alert', async ({ page }) => {
    await page.goto('/import')
    await expect(page.getByText('RonaQC accepts mapped SARS-CoV-2 reads')).toBeVisible()
  })
})
