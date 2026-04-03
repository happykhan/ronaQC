import { execSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default function globalSetup() {
  const fixturesDir = path.join(__dirname, 'fixtures', 'small_test')
  const zipPath = path.join(__dirname, '..', 'public', 'ronaqc_small_test.zip')

  if (!existsSync(path.join(fixturesDir, 'NC_OK.bam'))) {
    if (!existsSync(zipPath)) {
      console.log('Skipping fixture extraction: ronaqc_small_test.zip not found (pipeline tests will be skipped)')
      return
    }
    console.log('Extracting test BAM fixtures from zip...')
    execSync(`unzip -o "${zipPath}" -d "${path.join(__dirname, 'fixtures')}"`)
    console.log('Fixtures extracted.')
  }
}
