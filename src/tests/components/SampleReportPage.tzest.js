/**
 * @jest-environment jsdom
 */
import React from "react";
import SampleReportPage from "../../components/SampleReportPage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";

test("should render help page correctly", () => {
  render(
    <MemoryRouter>
      <SampleReportPage />
    </MemoryRouter>
  );
  expect(screen.getByTestId(`Sample-report-page`)).toMatchSnapshot();
});
