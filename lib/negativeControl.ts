// Typed port of src/util/NegativeControl.js with try-catch error handling

interface AioliCLI {
  exec: (cmd: string) => Promise<string>
  cat: (path: string) => Promise<string>
  fs: {
    writeFile: (path: string, content: string) => Promise<void>
  }
}

export interface CoverageResult {
  coverage: number[]
  genomeRecovery: number
}

export async function covDepth(
  mountedPath: string,
  _fileName: string,
  CLI: AioliCLI
): Promise<CoverageResult> {
  try {
    const depthOutput = await CLI.exec(`samtools depth -a ${mountedPath}`)
    const coverage = depthOutput
      .split('\n')
      .map((v) => {
        const val = +v.split('\t')[2]
        return Number.isNaN(val) ? 0 : val
      })

    const genomeRecovery = coverage.filter((v) => v >= 10).length

    return { coverage, genomeRecovery }
  } catch (err) {
    throw new Error(`Coverage depth analysis failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

export async function snpMethod(
  mountedPath: string,
  _fileName: string,
  CLI: AioliCLI,
  ivarMinFreqThreshold = 0.75,
  ivarMinDepth = 10,
  ivarMinVariantQuality = 20
): Promise<number | string> {
  try {
    const response = await fetch('/MN908947.3.fasta')
    const respText = await response.text()
    await CLI.fs.writeFile('ref.fasta', respText)

    await CLI.exec(
      `samtools mpileup -A -d 0 -B -Q 0 ${mountedPath} -o test.pileup --reference ref.fasta`
    )
    await CLI.exec(
      `ivar variants -p out test.pileup -m ${ivarMinDepth} -q ${ivarMinVariantQuality} -t ${ivarMinFreqThreshold} -r ref.fasta`
    )

    const ivarOut = await CLI.cat('out.tsv')
    const snpList = ivarOut
      .split(/\r?\n/)
      .map((line) => line.split(/\t/))
      .filter(
        (cols) =>
          cols.length > 13 &&
          parseFloat(cols[9]) >= ivarMinVariantQuality &&
          parseFloat(cols[10]) >= ivarMinFreqThreshold &&
          cols[13] === 'TRUE' &&
          parseFloat(cols[11]) >= ivarMinDepth
      )

    return snpList.length > 0 ? snpList.length : 0
  } catch (err) {
    throw new Error(`SNP analysis failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

export async function mappedReads(
  mountedPath: string,
  _fileName: string,
  CLI: AioliCLI
): Promise<[string, string, string]> {
  try {
    const statOut = await CLI.exec(`samtools flagstat ${mountedPath}`)
    const lines = statOut.split('\n')
    const totalReads = lines[0]?.split(' ')[0] ?? '0'
    const properReads = lines[8]?.split(' ')[0] ?? '0'

    const viewOut = await CLI.exec(`samtools view -F 4 -m 148 -c -q 60 ${mountedPath}`)
    const onefoureight = viewOut.split('\n')[0] ?? '0'

    return [properReads, onefoureight, totalReads]
  } catch (err) {
    throw new Error(`Mapped reads analysis failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

export async function amplicons(
  mountedPath: string,
  _fileName: string,
  CLI: AioliCLI,
  articV: string
): Promise<[number[], string[]]> {
  try {
    const bedFileLoc = await fetch(`/primer_schemes/${articV}`)
    const depthOutput = await CLI.exec(`samtools depth -a ${mountedPath}`)
    const coverage = depthOutput
      .split('\n')
      .map((v) => {
        const val = +v.split('\t')[2]
        return Number.isNaN(val) ? 0 : val
      })

    const amp = await bedFileLoc.text()
    const bedFile = amp.split('\n').filter((line) => line.trim().length > 0)

    const ampList: number[] = []
    const ampListName: string[] = []

    for (let j = 0; j < bedFile.length; j++) {
      const cols = bedFile[j].split('\t')
      const start = +cols[1]
      const stop = +cols[2]
      const idname = cols[3] ?? `amplicon_${j}`

      let covAmp = 0
      for (let k = start; k < stop; k++) {
        if ((coverage[k] ?? 0) > 9) {
          covAmp++
        }
      }

      ampList.push(covAmp / (stop - start))
      ampListName.push(idname)
    }

    return [ampList, ampListName]
  } catch (err) {
    throw new Error(`Amplicon analysis failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}
