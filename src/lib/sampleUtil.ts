// Typed port of src/util/SampleUtil.js with bug fixes

interface AioliCLI {
  exec: (cmd: string) => Promise<string>
  cat: (path: string) => Promise<string>
  fs: {
    writeFile: (path: string, content: string) => Promise<void>
  }
}

export async function sampleConsensus(
  mountedPath: string,
  fileName: string,
  CLI: AioliCLI,
  subsampleRatio?: number,
  ivarMinFreqThreshold = 0.75,
  ivarMinDepth = 10,
  ivarMinVariantQuality = 20
): Promise<string> {
  try {
    const response = await fetch('/MN908947.3.fasta')
    const respText = await response.text()
    await CLI.fs.writeFile('ref.fasta', respText)

    let inputPath = mountedPath

    if (subsampleRatio !== undefined && subsampleRatio < 1) {
      await CLI.exec(
        `samtools view ${mountedPath} -b -s ${subsampleRatio} -o ${fileName}.subsample.bam`
      )
      inputPath = `${fileName}.subsample.bam`
    }

    await CLI.exec(
      `samtools mpileup -A -d 0 -B -Q 0 ${inputPath} -o ${fileName}.pileup --reference ref.fasta`
    )
    await CLI.exec(
      `ivar consensus -p out ${fileName}.pileup -m ${ivarMinDepth} -q ${ivarMinVariantQuality} -t ${ivarMinFreqThreshold} -r ref.fasta`
    )

    const fastaOut = await CLI.cat('out.fa')
    return fastaOut
  } catch (err) {
    throw new Error(`Consensus generation failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

export function sampleConsensusMetrics(
  fastaOut: string,
  fileName: string
): [number, number, number, string, boolean, boolean] {
  const consensusString = fastaOut
    .split(/\r?\n/)
    .filter((line) => !line.startsWith('>'))
    .join('')

  // Consensus length (non-N bases: A, T, G, C)
  const consensusLength = (consensusString.match(/[ATGC]/g) || []).length

  // Longest N run — fix: handle case where no N runs exist
  const repeatedChars = consensusString.match(/N+/g)
  let longestNRun = 0
  if (repeatedChars && repeatedChars.length > 0) {
    longestNRun = Math.max(...repeatedChars.map((s) => s.length))
  }

  // Ambiguous bases (IUPAC codes)
  const ambigiousBasesCount = (consensusString.match(/[RYSWKMBDHV]/g) || []).length

  // QC thresholds
  const highQCpass = consensusLength / 29903 > 0.9
  const baseQCpass = consensusLength / 29903 > 0.5

  // Format FASTA output (80 chars per line)
  const wrappedSeq = consensusString.match(/.{1,80}/g) || []
  const fastaString = `>${fileName}\n${wrappedSeq.join('\n')}`

  return [consensusLength, ambigiousBasesCount, longestNRun, fastaString, highQCpass, baseQCpass]
}

export async function sampleMappedReads(
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
