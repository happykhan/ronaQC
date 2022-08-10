/**
 * @jest-environment jsdom
 */
import React from "react";
import AppRouter from "../../routers/AppRouter";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

test("should render Full site (import page) correctly", () => {
  render(<AppRouter />);
  expect(screen.getByTestId(`Import-page`)).toMatchSnapshot();
});
