import { test, expect } from '@playwright/test'
import path from 'path'

const FIXTURES = path.join(__dirname, 'fixtures', 'small_test')

// Pipeline tests use real BAM files and WebAssembly processing — they need longer timeouts
test.describe('Pipeline — Negative Control', () => {
  test.setTimeout(300_000) // 5 minutes

  test('NC_Terrible shows contaminated control', async ({ page }) => {
    await page.goto('/import')

    // Select ARTIC V3 (test data was generated with V3 primers)
    await page.locator('#artic-version').selectOption('nCov-2019.v3.insert.bed')

    // Upload NC_Terrible.bam via the hidden file input in the NC drop zone
    const ncInput = page.locator('input[type="file"]').first()
    await ncInput.setInputFiles(path.join(FIXTURES, 'NC_Terrible.bam'))

    // Wait for processing to complete — look for the progress to say "Complete"
    await expect(page.getByText('Complete')).toBeVisible({ timeout: 120_000 })

    // Navigate to control report
    await page.click('text=Control Report')
    await expect(page).toHaveURL('/control')

    // Should show the filename
    await expect(page.getByText('NC_Terrible.bam')).toBeVisible()

    // The metrics table should be visible with results
    await expect(page.locator('table.gx-table')).toBeVisible()

    // NC_Terrible should have some contamination indicators:
    // - SNPs should be present (fail status)
    // - Detected amplicons should be > 0
    // Wait for all metrics to load (no more "Calculating..." text)
    await expect(page.getByText('Calculating...')).toHaveCount(0, { timeout: 10_000 })

    // Check that there's at least one fail or warn badge
    const failBadges = page.locator('text=Fail')
    const warnBadges = page.locator('text=Warn')
    const failCount = await failBadges.count()
    const warnCount = await warnBadges.count()
    expect(failCount + warnCount).toBeGreaterThan(0)

    // Coverage plot should be rendered
    await expect(page.locator('svg.block')).toBeVisible()
  })

  test('NC_OK shows clean control', async ({ page }) => {
    await page.goto('/import')

    await page.locator('#artic-version').selectOption('nCov-2019.v3.insert.bed')

    const ncInput = page.locator('input[type="file"]').first()
    await ncInput.setInputFiles(path.join(FIXTURES, 'NC_OK.bam'))

    await expect(page.getByText('Complete')).toBeVisible({ timeout: 120_000 })

    await page.click('text=Control Report')
    await expect(page).toHaveURL('/control')
    await expect(page.getByText('NC_OK.bam')).toBeVisible()
    await expect(page.getByText('Calculating...')).toHaveCount(0, { timeout: 10_000 })

    // NC_OK should be a clean control — SNPs should be 0 and detected amplicons should be "None"
    await expect(page.getByText('None')).toBeVisible()

    // Check for pass badges
    const passBadges = page.locator('text=Pass')
    await expect(passBadges.first()).toBeVisible()
  })
})

test.describe('Pipeline — Sample Processing', () => {
  test.setTimeout(300_000) // 5 minutes

  test('Test_sample_1 shows good QC', async ({ page }) => {
    await page.goto('/import')

    await page.locator('#artic-version').selectOption('nCov-2019.v3.insert.bed')

    // Upload sample BAM via the second file input
    const sampleInput = page.locator('input[type="file"]').nth(1)
    await sampleInput.setInputFiles(path.join(FIXTURES, 'Test_sample_1.bam'))

    // Wait for processing — sample processing takes longer
    // Look for the progress indicator to show "Complete"
    await expect(page.getByText('Complete').last()).toBeVisible({ timeout: 240_000 })

    // Navigate to sample report
    await page.click('text=Sample Report')
    await expect(page).toHaveURL('/report')

    // Should show the sample name (without .bam extension)
    await expect(page.getByText('Test_sample_1')).toBeVisible()

    // Wait for processing to finish — no more spinners
    await expect(page.locator('.animate-spin')).toHaveCount(0, { timeout: 60_000 })

    // Test_sample_1 is a good sample — should show "High QC" status
    await expect(page.getByText('High QC')).toBeVisible()

    // Should show "Upload" judgement (suitable for GISAID)
    await expect(page.getByText('Upload')).toBeVisible()

    // Consensus download link should be available
    await expect(page.getByText('Consensus')).toBeVisible()

    // Coverage link should be available
    await expect(page.getByText('Coverage')).toBeVisible()

    // Amplicon heatmap should render
    await expect(page.getByText('Amplicon Coverage Heatmap')).toBeVisible()
  })
})

test.describe('Pipeline — Full Workflow', () => {
  test.setTimeout(300_000)

  test('upload control then sample, verify cross-check', async ({ page }) => {
    await page.goto('/import')

    await page.locator('#artic-version').selectOption('nCov-2019.v3.insert.bed')

    // Step 1: Upload negative control
    const ncInput = page.locator('input[type="file"]').first()
    await ncInput.setInputFiles(path.join(FIXTURES, 'NC_Terrible.bam'))
    await expect(page.getByText('Complete').first()).toBeVisible({ timeout: 120_000 })

    // Step 2: Upload sample
    const sampleInput = page.locator('input[type="file"]').nth(1)
    await sampleInput.setInputFiles(path.join(FIXTURES, 'Test_sample_1.bam'))
    await expect(page.getByText('Complete').last()).toBeVisible({ timeout: 240_000 })

    // Step 3: Verify control report
    await page.click('text=Control Report')
    await expect(page.getByText('NC_Terrible.bam')).toBeVisible()

    // Step 4: Check sample report for NC cross-check
    await page.click('text=Sample Report')
    await expect(page.getByText('Test_sample_1')).toBeVisible()
    await expect(page.locator('.animate-spin')).toHaveCount(0, { timeout: 60_000 })

    // The NC warning banner should appear if NC had detected amplicons
    // (NC_Terrible likely has contaminated amplicons)
    const controlWarning = page.getByText('Control warning')
    const hasWarning = await controlWarning.isVisible().catch(() => false)
    if (hasWarning) {
      // If there's a cross-check warning, NC badges should be visible in the table
      await expect(page.getByText('NC')).toBeVisible()
    }

    // Step 5: Test CSV export
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByText('Export CSV').click(),
    ])
    expect(download.suggestedFilename()).toBe('sample_report.csv')

    // Step 6: Test per-sample coverage modal
    await page.getByText('Coverage').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Coverage: Test_sample_1')).toBeVisible()

    // Close modal with Escape
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})

test.describe('Pipeline — Export', () => {
  test.setTimeout(300_000)

  test('control report CSV export works', async ({ page }) => {
    await page.goto('/import')

    await page.locator('#artic-version').selectOption('nCov-2019.v3.insert.bed')

    const ncInput = page.locator('input[type="file"]').first()
    await ncInput.setInputFiles(path.join(FIXTURES, 'NC_OK.bam'))
    await expect(page.getByText('Complete')).toBeVisible({ timeout: 120_000 })

    await page.click('text=Control Report')
    await expect(page.getByText('Calculating...')).toHaveCount(0, { timeout: 10_000 })

    // Export CSV
    const [csvDownload] = await Promise.all([
      page.waitForEvent('download'),
      page.getByText('Export CSV').click(),
    ])
    expect(csvDownload.suggestedFilename()).toBe('control_report.csv')

    // Export TSV
    const [tsvDownload] = await Promise.all([
      page.waitForEvent('download'),
      page.getByText('Export TSV').click(),
    ])
    expect(tsvDownload.suggestedFilename()).toBe('control_report.tsv')
  })
})
