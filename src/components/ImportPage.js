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
import { sampleConsensus, sampleConsensusMetrics } from "../util/SampleUtil";
import NegativeControlContext from "../context/NegativeControlContext";
import SampleContext from "../context/SampleContext";
import Aioli from "@biowasm/aioli";

const ImportPage = () => {
  const { negativeControl, dispatch } = useContext(NegativeControlContext);
  const { Sample, sampleDispatch } = useContext(SampleContext);

  const submitControl = (event) => {
    const negControlFile = event.target.files[0];
    // Add record to store
    dispatch({
      type: "ADD_CONTROL",
      name: negControlFile.name,
      file: negControlFile,
    });
    // Send off for processing
    generateNCMetrics(negControlFile, dispatch);
  };

  const submitSamples = (event) => {
    const sampleFiles = event.target.files;
    // Add record to store
    Array.from(sampleFiles).forEach((row) => {
      sampleDispatch({
        type: "ADD_SAMPLE",
        name: row.name,
        file: row,
      });
      // Send off for processing
      generateSampleMetrics(row);
    });
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

  const getSampleConsensus = async (mountedFiles, fileHandle, CLI) => {
    sampleDispatch({
      type: "EDIT_SAMPLE",
      name: fileHandle.name,
      updates: {
        comments: "Generating consensus",
      },
    });
    const fastaOut = await sampleConsensus(mountedFiles, fileHandle, CLI);
    sampleDispatch({
      type: "EDIT_SAMPLE",
      name: fileHandle.name,
      updates: {
        comments: "Generated consensus",
      },
    });
    if (fastaOut.length > 200) {
      const [
        consensusLength,
        ambigiousBasesCount,
        longestNRun,
        fastaString,
        highQCpass,
        baseQCpass,
      ] = await sampleConsensusMetrics(fastaOut, fileHandle.name);
      console.log(highQCpass, baseQCpass);
      const highQCpassString = highQCpass ? "True" : "False";
      const baseQCpassString = baseQCpass ? "True" : "False";
      sampleDispatch({
        type: "EDIT_SAMPLE",
        name: fileHandle.name,
        updates: {
          consensusLength,
          ambigiousBasesCount,
          longestNRun,
          highQCpass: highQCpassString,
          baseQCpass: baseQCpassString,
        },
      });
    } else {
      sampleDispatch({
        type: "EDIT_SAMPLE",
        name: fileHandle.name,
        updates: {
          comments: "Error: Could not generate consensus",
        },
      });
    }
  };

  const getSampleMappedReads = async (mountedFiles, fileHandle, CLI) => {
    const [properReads, onefoureight] = await mappedReads(
      mountedFiles,
      fileHandle,
      CLI
    );
    sampleDispatch({
      type: "EDIT_SAMPLE",
      name: fileHandle.name,
      updates: { properReads, onefoureight },
    });
  };

  const getSampleAmplicons = async (
    mountedFiles,
    fileHandle,
    CLI,
    isSample
  ) => {
    const ampList = await amplicons(mountedFiles, fileHandle, CLI, isSample);
    const missingAmplicons = Array.from(ampList)
      .filter((ele) => parseFloat(ele.coverage) < 0.4)
      .map((ele) => ele.idname);
    sampleDispatch({
      type: "EDIT_SAMPLE",
      name: fileHandle.name,
      updates: { amplicons: ampList, missingAmplicons },
    });
  };
  const generateSampleMetrics = async (fileHandle) => {
    let CLI = await new Aioli(["samtools/1.10", "ivar/1.3.1", "grep/3.7"]);
    const mountedFiles = await CLI.mount([fileHandle]);
    const cov = getSampleConsensus(mountedFiles, fileHandle, CLI);
    const amp = getSampleAmplicons(mountedFiles, fileHandle, CLI, true);
    const map = getSampleMappedReads(mountedFiles, fileHandle, CLI);
    await Promise.all([cov, map, amp]);
    sampleDispatch({
      type: "EDIT_SAMPLE",
      name: fileHandle.name,
      updates: {
        comments: "Done",
      },
    });
  };

  return (
    <Container maxWidth="md" data-testid={`Import-page`}>
      <Card>
        <CardContent>
          <Typography variant="h3" my={3} gutterBottom>
            Import
          </Typography>

          <Grid container spacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item>
              <Typography variant="body1">
                RonaQC accepts mapped SARS-CoV-2 reads (BAM format), generated
                from the SARS-CoV-2 bioinformatic pipelines like ARTIC, and any
                control samples from the respective sequencing run
                (negative/positive) as input. It will then assess the levels of
                cross contamination and primer contamination in the samples, and
                determine if the samples are reliable for detecting SARS-CoV-2,
                phylogenetic analysis, and/or submission to public databases.
              </Typography>
            </Grid>
            <Grid item xs={7}>
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
            <Grid item xs={7}>
              <form onChange={(e) => submitSamples(e)}>
                <input type="file" multiple="multiple" />
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
            <Grid item xs={7}>
              <Button variant="outlined" color="primary" disabled>
                Demo
              </Button>
            </Grid>
            <Grid item xs={7}>
              <Button variant="outlined" color="primary" disabled>
                Demo (repeat analysis)
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ImportPage;
