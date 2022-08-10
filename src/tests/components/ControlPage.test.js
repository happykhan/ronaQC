/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NegativeControlContext from "../../context/NegativeControlContext";
import ControlPage from "../../components/ControlPage";

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <NegativeControlContext.Provider {...providerProps}>
      {ui}
    </NegativeControlContext.Provider>,
    renderOptions
  );
};

test("should render Control page", () => {
  const negativeControl = {
    name: "test.bam",
    genomeRecovery: 400,
    snpCount: 1,
  };
  const dispatch = jest.fn();

  const providerProps = {
    value: {
      negativeControl,
      dispatch,
    },
  };

  customRender(<ControlPage />, { providerProps });
  screen.debug();
  expect(screen.getByTestId(`Control-page`)).toMatchSnapshot();
});
