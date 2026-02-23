import { test, expect } from '@playwright/test'

test.describe('Import Page', () => {
  test('shows file upload areas', async ({ page }) => {
    await page.goto('/import')

    await expect(page.getByText('Negative Control')).toBeVisible()
    await expect(page.getByText('Sample Data')).toBeVisible()
    await expect(page.getByText('Drop negative control BAM file here')).toBeVisible()
    await expect(page.getByText('Drop sample BAM files here')).toBeVisible()
  })

  test('shows ARTIC version selector with all versions including v5', async ({ page }) => {
    await page.goto('/import')

    const selector = page.locator('#artic-version')
    await expect(selector).toBeVisible()

    const options = selector.locator('option')
    await expect(options).toHaveCount(8)
    await expect(options.first()).toContainText('V5.4.2')
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
