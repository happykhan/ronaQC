/**
 * @jest-environment jsdom
 */
import React from "react";
import ImportPage from "../../components/ImportPage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import "regenerator-runtime/runtime";

test("should render help page correctly", () => {
  render(
    <MemoryRouter>
      <ImportPage />
    </MemoryRouter>
  );
  expect(screen.getByTestId(`Import-page`)).toMatchSnapshot();
});
