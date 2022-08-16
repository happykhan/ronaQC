# ronaQC

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ee08bfe-aff7-4260-a4c0-498708e5a17b/deploy-status)](https://app.netlify.com/sites/ronaqc/deploys)

[![Node.js CI](https://github.com/happykhan/ronaQC/actions/workflows/node.js.yml/badge.svg)](https://github.com/happykhan/ronaQC/actions/workflows/node.js.yml)

Source code for web resource, RonaQC. RonaQC accepts mapped SARS-CoV-2 reads (BAM format), generated
from the SARS-CoV-2 bioinformatic pipelines like ARTIC,
and any control samples from the respective sequencing run (negative/positive) as input.
It will then assess the levels of cross contamination and primer contamination in the samples, and determine
if the samples are reliable for detecting SARS-CoV-2, phylogenetic analysis, and/or submission to public databases.

The software is live on https://ronaqc.netlify.app/

# Deploy

```
npm run build
netlify deploy --prod
```

# My working fork of Aioli (required)

```
npm i  https://github.com/happykhan/aioli/releases/download/2.4.0j/biowasm-aioli-2.4.0.tgz
```
