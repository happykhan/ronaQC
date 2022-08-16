import { ConstructionOutlined } from "@mui/icons-material";

const covDepth = async (f, fileName, CLI) => {
  const version = await CLI.exec("samtools --version-only");
  console.log(
    "Samtools version",
    version,
    "File input",
    f,
    f.name,
    "Filename input",
    fileName
  );
  const depthOutput = await CLI.exec(`samtools depth -a ${f}`);
  const blankCoverageArray = depthOutput
    .split("\n")
    .map((v) => (Number.isNaN(+v.split("\t")[2]) ? 0 : +v.split("\t")[2]));
  const output = {
    coverage: blankCoverageArray,
    genomeRecovery: Number(
      Math.round(blankCoverageArray.filter((v) => v >= 10).length)
    ),
  }; // / blankCoverageArray.length * 100 + 'e2' ) + 'e-2' )}))
  return output;
};

const snpMethod = async (
  f,
  fileName,
  CLI,
  ivarMinFreqThreshold = 0.75,
  ivarMinDepth = 10,
  ivarMinVariantQuality = 20
) => {
  // Calculate the SNPs
  const response = await fetch("MN908947.3.fasta");
  const respText = await response.text();
  await CLI.fs.writeFile("ref.fasta", `${respText}`);
  // You can't seem to have multiple padding spaces i.e. no '  ' only ' '
  let samOutput = await CLI.exec(
    `samtools mpileup -A -d 0 -B -Q 0 ${f} -o test.pileup --reference ref.fasta`
  );
  samOutput = await CLI.exec(
    `ivar variants -p out test.pileup -m ${ivarMinDepth} -q ${ivarMinVariantQuality} -t ${ivarMinFreqThreshold} -r ref.fasta`
  );
  const ivarOut = await CLI.exec("grep .* out.tsv");
  console.log(ivarOut);
  const snpList = ivarOut
    .split(/\r?\n/)
    .map((element) => element.split(/\t/))
    .filter(
      (element) =>
        parseFloat(element[9]) >= ivarMinVariantQuality &&
        parseFloat(element[10]) >= ivarMinFreqThreshold &&
        element[13] == "TRUE" &&
        parseFloat(element[11]) >= ivarMinDepth
    );
  console.log("snp count", snpList);
  const snpCounter = snpList.length ? snpList.length : "No SNPs";
  return snpCounter;
};

const mappedReads = async (f, fileName, CLI) => {
  const statOut = await CLI.exec(`samtools flagstat ${f}`);
  const totalReads = statOut.split("\n")[0].split(" ")[0];
  const properReads = statOut.split("\n")[8].split(" ")[0];
  console.log(statOut);
  // Fetch the "good" mapped read
  // samtools view /data/322537-PC_S1084.mapped.bam -F 4 -m 148 -c -q 60
  const viewOut = await CLI.exec(`samtools view -F 4 -m 148 -c -q 60 ${f}`);
  const onefoureight = viewOut.split("\n")[0];
  console.log("statout", statOut);
  console.log("viewout", viewOut);
  return [properReads, onefoureight, totalReads];
};

const amplicons = async (f, fileName, CLI, isSample = false) => {
  const bedFileLoc = await fetch("nCov-2019.insert.bed");
  const depthOutput = await CLI.exec(`samtools depth -a ${f}`);
  const blankCoverageArray = depthOutput
    .split("\n")
    .map((v) => (Number.isNaN(+v.split("\t")[2]) ? 0 : +v.split("\t")[2]));
  const amp = await bedFileLoc.text();
  const bedFile = amp.split("\n");
  let ampList = [];
  for (var j = 0; j < bedFile.length; j++) {
    let start = +bedFile[j].split("\t")[1];
    let stop = +bedFile[j].split("\t")[2];
    let idname = +bedFile[j].split("\t")[3];
    let covAmp = 0;
    for (var k = start; k < stop; k++) {
      if (blankCoverageArray[k] > 9) {
        covAmp = covAmp + 1;
      }
    }

    if (isSample) {
      ampList.push({ idname, coverage: covAmp / (stop - start) });
    } else {
      if (covAmp / (stop - start) > 0.4) {
        ampList.push(idname);
      }
    }
  }
  return ampList;
};

export { covDepth, snpMethod, mappedReads, amplicons };
