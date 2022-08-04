import React from "react";
import { Typography, Container, Card, CardContent } from "@mui/material/";

const HelpPage = () => (
  <Container maxWidth="md">
    <Card>
      <CardContent>
        <Typography variant="h3" my={3} gutterBottom>
          Help
        </Typography>
        <Typography variant="body1">
          RonaQC accepts mapped SARS-CoV-2 reads (BAM format), generated from
          the SARS-CoV-2 bioinformatic pipelines like ARTIC, and any control
          samples from the respective sequencing run (negative/positive) as
          input. It will then assess the levels of cross contamination and
          primer contamination in the samples, and determine if the samples are
          reliable for detecting SARS-CoV-2, phylogenetic analysis, and/or
          submission to public databases.
        </Typography>
      </CardContent>
    </Card>
  </Container>
);
export default HelpPage;
