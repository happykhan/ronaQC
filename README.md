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


# Test data

There are two datasets to demonstrate/test ronaQC:

## A very simple dataset (30MB).
This includes mapped reads of three sequenced controls of varying quality, and mapped reads of two genuine SARSCOV2 samples. https://ronaqc.netlify.app/ronaqc_small_test.zip 

## A more exhaustive dataset (1GB)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.7018405.svg)](https://doi.org/10.5281/zenodo.7018405) Test data is available here: https://zenodo.org/record/7018405

This includes:
* SARS-CoV-2 sequenced reads from major VOCs. 
* SARS-CoV-2 sequenced reads from samples that are known to have failed (for different reasons). 
* The test data from above, with one additional sample.  

VOC and failed QC data are taken from  [CDCgov/datasets-sars-cov-2](https://github.com/CDCgov/datasets-sars-cov-2). 



 
