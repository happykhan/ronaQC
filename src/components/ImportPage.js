import React, { useContext } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material/";
import {
  covDepth,
  snpMethod,
  mappedReads,
  amplicons,
} from "../util/NegativeControl";
import NegativeControlContext from "../context/NegativeControlContext";
import Aioli from "@biowasm/aioli";

const ImportPage = () => {
  const { negativeControl, dispatch } = useContext(NegativeControlContext);

  const submitControl = (event) => {
    const negControlFile = event.target.files[0];
    // Add record to store
    dispatch({
      type: "ADD_CONTROL",
      name: negControlFile.name,
      file: negControlFile,
    });
    console.log(negativeControl);
    // Send off for processing
    generateNCMetrics(negControlFile, dispatch);
  };

  const submitSamples = (event) => {
    const sampleFiles = event.target.files;
    // Add record to store
    // Send off for processing
  };

  const getCoverage = async (mountedFiles, fileHandle, CLI) => {
    const coverage = await covDepth(mountedFiles[0], fileHandle.name, CLI);
    dispatch({
      type: "ADD_COVERAGE",
      name: fileHandle.name,
      coverage: coverage.coverage,
    });
    dispatch({
      type: "ADD_GEN_RECOVERY",
      name: fileHandle.name,
      genomeRecovery: coverage.genomeRecovery,
    });
  };

  const getSnp = async (mountedFiles, fileHandle, CLI) => {
    let snpInfo = await snpMethod(mountedFiles, fileHandle, CLI);
    snpInfo = snpInfo ? snpInfo : 0;
    console.log("snp", snpInfo);
    dispatch({
      type: "ADD_SNP_COUNT",
      name: fileHandle.name,
      snpCount: snpInfo,
    });
  };

  const getMappedReads = async (mountedFiles, fileHandle, CLI) => {
    const [properReads, onefoureight] = await mappedReads(
      mountedFiles,
      fileHandle,
      CLI
    );
    dispatch({
      type: "ADD_PROPER_MAPPED_READS",
      name: fileHandle.name,
      properReads,
    });
    dispatch({
      type: "ADD_MAPPED_READS",
      name: fileHandle.name,
      onefoureight,
    });
  };

  const getAmplicons = async (mountedFiles, fileHandle, CLI) => {
    const ampList = await amplicons(mountedFiles, fileHandle, CLI);
    dispatch({
      type: "ADD_AMPLICONS",
      name: fileHandle.name,
      amplicons: ampList,
    });
  };
  const generateNCMetrics = async (fileHandle, dispatch) => {
    let CLI = await new Aioli(["samtools/1.10", "ivar/1.3.1", "grep/3.7"]);
    const mountedFiles = await CLI.mount([fileHandle]);
    getCoverage(mountedFiles, fileHandle, CLI);
    getSnp(mountedFiles, fileHandle, CLI);
    getMappedReads(mountedFiles, fileHandle, CLI);
    getAmplicons(mountedFiles, fileHandle, CLI);
  };

  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Typography variant="h3" my={3} gutterBottom>
            Import
          </Typography>

          <Grid container spacing={3} columns={1}>
            <Grid item>
              <form onChange={(e) => submitControl(e)}>
                <input type="file" />
                <Button
                  color="secondary"
                  variant="contained"
                  component="span"
                  type="submit"
                >
                  Upload Negative control
                </Button>
              </form>
            </Grid>
            <Grid item>
              <form onChange={(e) => submitSamples(e)}>
                <input type="file" />
                <Button
                  color="primary"
                  variant="contained"
                  component="span"
                  type="submit"
                >
                  Upload Sample data
                </Button>
              </form>
            </Grid>
            <Grid item>
              <Button>Demo</Button>
            </Grid>
            <Grid item>
              <Button>Demo (repeat analysis)</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ImportPage;
