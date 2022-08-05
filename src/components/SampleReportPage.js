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
      coverage: ele.amplicons.map((cov) => (cov.coverage ? cov.coverage : 0)),
    }));

  console.log("amp", amplicons);

  const SummaryTable = (tableSamples) => {
    const { samples } = tableSamples;
    console.log(samples);

    return (
      <Table sx={{ minWidth: 400 }} aria-label="Sample table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>SNPs</TableCell>
            <TableCell>Called bases</TableCell>
            <TableCell>Best mapped reads / Well mapped reads</TableCell>
            <TableCell>Missing amplicons</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {samples.map((element, index) => (
            <TableRow key={element.name}>
              <TableCell>{element.name}</TableCell>
              <TableCell>Not Implemented</TableCell>
              <TableCell>Not Implemented</TableCell>
              <TableCell>
                {" "}
                {element.onefoureight
                  ? element.onefoureight
                  : "Unknown mapped reads"}{" "}
                /{" "}
                {element.properReads
                  ? element.properReads
                  : "Unknown mapped reads"}
              </TableCell>
              <TableCell>
                {element.missingAmplicons
                  ? element.missingAmplicons.length > 0
                    ? element.missingAmplicons.join(", ")
                    : "All amplicons found"
                  : "Unknown missing amplicons"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Container maxWidth="md">
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
