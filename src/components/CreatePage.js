import React from "react";
import { Typography, Container, Card, CardContent } from "@mui/material/";

const CreatePage = () => (
  <Container maxWidth="md" data-testid={`Create-page`}>
    <Card>
      <CardContent>
        <Typography variant="h3" my={3} gutterBottom>
          Create page
        </Typography>
        <Typography variant="body1">
        Working from raw reads 
        </Typography>
      </CardContent>
    </Card>
  </Container>
);
export default CreatePage;
