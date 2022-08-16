const fsPromises = require("fs/promises");
import "regenerator-runtime/runtime";
import Aioli from "../../node_modules/@biowasm/aioli/dist/aioli";
import React from "react";
import "@testing-library/jest-dom/extend-expect";

import {
  covDepth,
  snpMethod,
  mappedReads,
  amplicons,
} from "../util/NegativeControl";

test("should filter sort by amount", async () => {
  const filePath = "src/tests/Test-NC.mapped.bam";
  const fileHandle = await fsPromises.readFile("src/tests/Test-NC.mapped.bam");
  let CLI = await new Aioli("samtools/1.10");
  const mountedFiles = await CLI.mount([fileHandle]);

  //   const filters = {
  //     text: "",
  //     sortBy: "amount",
  //     startDate: undefined,
  //     endDate: undefined,
  //   };
  //   const result = selectExpenses(expenses, filters);
  //   expect(result).toEqual([expenses[1], expenses[2], expenses[0]]);
});
