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
  TableRow,
} from "@mui/material/";
import SampleContext from "../context/SampleContext";
import AmpPlot from "./AmpPlot";

const SampleReportPage = () => {
  const { samples } = useContext(SampleContext);
  const amplicons = samples
    .filter((ele) => !!ele.amplicons)
    .map((ele) => ({
      name: ele.name.replace(/\.mapped\.bam/, ""),
      coverage: ele.amplicons.map((cov) => ({
        coverage: cov.coverage ? cov.coverage : 0,
      })),
    }));

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
          {amplicons.length > 0 && <AmpPlot amplicons={amplicons} />}
        </CardContent>
      </Card>
    </Container>
  );
};
export default SampleReportPage;
