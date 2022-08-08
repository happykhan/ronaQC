/**
 * @jest-environment jsdom
 */
import React from "react";
import HelpPage from "../../components/HelpPage";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";

test("should render help page correctly", () => {
  render(
    <MemoryRouter>
      <HelpPage />
    </MemoryRouter>
  );
  expect(screen.getByTestId(`Help-page`)).toMatchSnapshot();
});
