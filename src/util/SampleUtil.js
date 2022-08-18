export const sampleConsensus = async (
  f,
  fileName,
  CLI,
  ivarMinFreqThreshold = 0.75,
  ivarMinDepth = 10,
  ivarMinVariantQuality = 20
) => {
  // Calculate the consensus
  const response = await fetch("MN908947.3.fasta");
  const respText = await response.text();
  await CLI.fs.writeFile("ref.fasta", `${respText}`);
  // You can't seem to have multiple padding spaces i.e. no '  ' only ' '
  let samOutput = await CLI.exec(
    `samtools mpileup -A -d 0 -B -Q 0 ${f} -o ${fileName.name}.pileup --reference ref.fasta`
  );
  samOutput = await CLI.exec(
    `ivar consensus -p out ${fileName.name}.pileup -m ${ivarMinDepth} -q ${ivarMinVariantQuality} -t ${ivarMinFreqThreshold} -r ref.fasta`
  );
  const fastaOut = await CLI.exec("grep .* out.fa");
  return fastaOut;
};

export const sampleConsensusMetrics = async (fastaOut, fileName) => {
  let consensusString = "";
  consensusString = fastaOut
    .split(/\r?\n/)
    .filter((element) => !element.startsWith(">"))
    .join("");

  // Calculate the consensus length (number of bases NOT N)
  const consensusLength = (consensusString.match(/[ATGC]/g) || []).length;

  // Calculate longest N run
  const repeatedChars = consensusString
    .match(/(.)\1*/g)
    .filter((element) => element.match(/N/g));
  const longestNRun = Math.max(...repeatedChars.map((str) => str.length));

  // Calculate number of ambigious bases
  const ambigiousBasesCount = (consensusString.match(/[RYSWKMBDHV]/g) || [])
    .length;

  // Calculate high-QC pass and base-QC pass
  const highQCpass = consensusLength / 29903 > 0.9;
  const baseQCpass = consensusLength / 29903 > 0.5;
  // Create final fasta file output.
  const fastaString = `>${fileName}\n${consensusString.match(/.{1,80}/g)}`;
  return [
    consensusLength,
    ambigiousBasesCount,
    longestNRun,
    fastaString,
    highQCpass,
    baseQCpass,
  ];
};

const mappedReads = async (f, fileName, CLI) => {
  const statOut = await CLI.exec(`samtools flagstat ${f}`);
  const properReads = statOut.split("\n")[8].split(" ")[0];

  // Fetch the "good" mapped read
  // samtools view /data/322537-PC_S1084.mapped.bam -F 4 -m 148 -c -q 60
  const viewOut = await CLI.exec(`samtools view -F 4 -m 148 -c -q 60 ${f}`);
  const onefoureight = viewOut.split("\n")[0];
  return [properReads, onefoureight];
};
