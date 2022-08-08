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
import NegativeControlContext from "../context/NegativeControlContext";
import Covplot from "./CovPlot";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const SummaryTable = (control) => {
  return (
    <Table sx={{ minWidth: 400 }} aria-label="NC table">
      <TableHead>
        <TableRow>
          <TableCell>
            SNPs {control.snpCount > 0 && <ErrorIcon sx={{ color: "red" }} />}
            {control.snpCount === 0 && (
              <CheckCircleIcon sx={{ color: "green" }} />
            )}
          </TableCell>
          <TableCell>
            Called bases
            {control.genomeRecovery >= 500 && (
              <WarningIcon sx={{ color: "orange" }} />
            )}
            {control.genomeRecovery < 500 && (
              <CheckCircleIcon sx={{ color: "green" }} />
            )}
          </TableCell>
          <TableCell>Best mapped reads / Well mapped reads</TableCell>
          <TableCell>
            Detected amplicons{" "}
            {(control.amplicons ? control.amplicons.length : 0) > 1 && (
              <ErrorIcon sx={{ color: "red" }} />
            )}{" "}
            {(control.amplicons ? control.amplicons.length : 0) == 1 && (
              <WarningIcon sx={{ color: "orange" }} />
            )}
            {(control.amplicons ? control.amplicons.length : 0) == 0 && (
              <CheckCircleIcon sx={{ color: "green" }} />
            )}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            {control.snpCount ? control.snpCount : "Unknown SNPs"}
          </TableCell>
          <TableCell>
            {control.genomeRecovery
              ? `${control.genomeRecovery}`
              : "Unknown genome recovery"}
          </TableCell>
          <TableCell>
            {control.onefoureight
              ? control.onefoureight
              : "Unknown mapped reads"}{" "}
            /{" "}
            {control.properReads ? control.properReads : "Unknown mapped reads"}
          </TableCell>
          <TableCell>
            {control.amplicons
              ? control.amplicons.length > 0
                ? control.amplicons.join(", ")
                : "No amplicons found"
              : "Unknown amplicons"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const ControlPage = () => {
  const { negativeControl } = useContext(NegativeControlContext);
  return (
    <Container maxWidth="md" data-testid={`Control-page`}>
      <Card>
        <CardContent>
          <Typography variant="h3" my={3} gutterBottom>
            Control report
          </Typography>
          {negativeControl.name ? (
            <Typography variant="body1">
              {`Loaded file ${negativeControl.name}`}
            </Typography>
          ) : (
            <Typography variant="body1">
              You have no control file loaded. Please add a file under Import
            </Typography>
          )}
          {negativeControl.name && <SummaryTable {...negativeControl} />}
        </CardContent>
        <CardContent>
          {negativeControl.coverage ? (
            <Covplot coverage={negativeControl.coverage} />
          ) : (
            negativeControl.name && <CircularProgress />
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
export default ControlPage;
