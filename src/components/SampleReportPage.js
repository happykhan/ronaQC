import React, { useContext } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Table,
  CircularProgress,
  TableBody,
  TableHead,
  TableCell,
  Button,
  TableRow,
} from "@mui/material/";
import SampleContext from "../context/SampleContext";
import AmpPlot from "./AmpPlot";
import { saveAs } from "file-saver";

const SampleReportPage = () => {
  const { samples } = useContext(SampleContext);

  const amplicons = samples
    .filter((ele) => !!ele.amplicons)
    .map((ele) => ({
      name: ele.name
        .replace(/\.mapped\.bam/, "")
        .replace(/\.bam/, "")
        .replace(/\.sorted/, ""),
      coverage: ele.amplicons.map((cov) => (cov ? cov : 0)),
    }));
  const randomLabelArray = () => {
    return Array.from({ length: 97 }, (x, y) => `amp_${y}`);
  };

  const randomCoverageArray = () => {
    return Array.from({ length: 97 }, () => Math.floor(Math.random() * 1000));
  };
  const ampliconsRand = [
    { name: "1.mapped.bam", coverage: randomCoverageArray() },
    { name: "2.mapped.bam", coverage: randomCoverageArray() },
    { name: "3.mapped.bam", coverage: randomCoverageArray() },
    { name: "4.mapped.bam", coverage: randomCoverageArray() },
    { name: "5.mapped.bam", coverage: randomCoverageArray() },
    { name: "6.mapped.bam", coverage: randomCoverageArray() },
    { name: "7.mapped.bam", coverage: randomCoverageArray() },
    { name: "8.mapped.bam", coverage: randomCoverageArray() },
  ];

  const consensusDownload = (fastaString, name) => {
    var blob = new Blob([fastaString.replaceAll(",", "\n")], {
      type: "text/plain",
    });
    saveAs(blob, name + ".fasta");
  };

  const SummaryTable = (tableSamples) => {
    const { samples } = tableSamples;

    return (
      <Table sx={{ minWidth: 400 }} aria-label="Sample table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Ambigious bases</TableCell>
            <TableCell>Longest run of N</TableCell>
            <TableCell>QC Pass (High/Base)</TableCell>
            <TableCell>Consensus Length</TableCell>
            <TableCell>Mapped reads (Best/Well/Total)</TableCell>
            <TableCell>Missing amplicons</TableCell>
            <TableCell>Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {samples.map((element, index) => (
            <TableRow key={element.name}>
              <TableCell>{element.name}</TableCell>
              <TableCell>
                {typeof element.ambigiousBasesCount == "number"
                  ? element.ambigiousBasesCount
                  : "Unknown"}
              </TableCell>
              <TableCell>
                {element.longestNRun ? element.longestNRun : "Unknown"}
              </TableCell>
              <TableCell>
                {" "}
                {element.highQCpass ? element.highQCpass : "Unknown"} /{" "}
                {element.baseQCpass ? element.baseQCpass : "Unknown"}
              </TableCell>
              <TableCell>
                {" "}
                {element.consensusLength
                  ? element.consensusLength
                  : "Unknown bases"}
              </TableCell>
              <TableCell>
                {" "}
                {element.onefoureight ? element.onefoureight : "Unknown"} /{" "}
                {element.properReads ? element.properReads : "Unknown"}/{" "}
                {element.totalReads
                  ? element.totalReads
                  : "Unknown total reads"}
              </TableCell>
              <TableCell>
                {element.missingAmplicons
                  ? element.missingAmplicons.length > 0
                    ? element.missingAmplicons.length
                    : "All amplicons found"
                  : "Unknown missing amplicons"}
              </TableCell>
              <TableCell>
                {element.comments == "Done" ? "" : <CircularProgress />}
                {element.comments ? element.comments : "No comments"}
                {element.consensusFasta && (
                  <Button
                    variant="text"
                    size="small"
                    color="success"
                    onClick={() =>
                      consensusDownload(element.consensusFasta, element.name)
                    }
                  >
                    Download consensus
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Container maxWidth="md" data-testid={`Sample-report-page`}>
      <Card>
        <CardContent>
          <Typography variant="h3" my={3} gutterBottom>
            Sample report
          </Typography>
          {samples.length > 0 ? (
            <SummaryTable samples={samples} />
          ) : (
            <Typography variant="body1">
              You have no sample files loaded. Please add files under Import
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {amplicons.length > 0 && (
            <AmpPlot amplicons={amplicons} labels={samples[0].ampLabels} />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
export default SampleReportPage;
